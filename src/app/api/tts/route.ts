import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientId } from "@/lib/rate-limit";

const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY;
const GOOGLE_TTS_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";

// Voice selection: WaveNet is the sweet spot for Bangla — clean pronunciation
// and fast generation (≈1–2s). Chirp 3 HD sounds even more natural but takes
// 30+ seconds for long text, which is too slow for real-time playback.
// bn-IN-Wavenet-C is the warmest Bangla female voice in Google's catalog.
const VOICES = {
  bangla: {
    languageCode: "bn-IN",
    name: "bn-IN-Wavenet-C",
    ssmlGender: "FEMALE" as const,
  },
  english: {
    languageCode: "en-US",
    name: "en-US-Neural2-F",
    ssmlGender: "FEMALE" as const,
  },
} as const;

// Google Cloud TTS has a 5000-byte limit per request. Bangla is ~3 bytes
// per character in UTF-8, so a naive character slice overflows fast. Trim
// by byte length and back up to the nearest whitespace so we don't cut a
// word in half.
const MAX_REQUEST_BYTES = 4800;

function truncateToBytes(input: string, maxBytes: number): string {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(input);
  if (encoded.length <= maxBytes) return input;

  // Decode a safe prefix (stopOnError ensures we don't split a multibyte char)
  const decoder = new TextDecoder("utf-8");
  let truncated = decoder.decode(encoded.slice(0, maxBytes), { stream: false });

  // Back up to the last sentence or word boundary for a cleaner cut
  const lastSentence = Math.max(
    truncated.lastIndexOf("।"),
    truncated.lastIndexOf("."),
    truncated.lastIndexOf("?"),
    truncated.lastIndexOf("!")
  );
  if (lastSentence > truncated.length * 0.6) {
    truncated = truncated.slice(0, lastSentence + 1);
  } else {
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 0) truncated = truncated.slice(0, lastSpace);
  }
  return truncated;
}

export async function POST(request: NextRequest) {
  // Rate limit: 20 TTS requests per IP per 15 minutes (guards Google Cloud billing)
  const clientId = getClientId(request);
  const rl = rateLimit(`tts:${clientId}`, {
    limit: 20,
    windowMs: 15 * 60 * 1000,
  });

  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many audio requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const { text, language = "BANGLA" } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!GOOGLE_TTS_API_KEY) {
      return NextResponse.json(
        { error: "TTS service is not configured" },
        { status: 500 }
      );
    }

    // Hard cap the raw input so we don't allocate absurd buffers
    if (text.length > 20000) {
      return NextResponse.json(
        { error: "Text is too long." },
        { status: 400 }
      );
    }

    // Truncate to Google's 5000-byte limit (Chirp 3 HD + most voices)
    const safeText = truncateToBytes(text, MAX_REQUEST_BYTES);

    const selectedVoice =
      language === "ENGLISH" ? VOICES.english : VOICES.bangla;

    // 15s timeout — Wavenet finishes in ~1–2s for 5k bytes
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    let response: Response;
    try {
      response = await fetch(GOOGLE_TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_TTS_API_KEY,
        },
        body: JSON.stringify({
          input: { text: safeText },
          voice: {
            languageCode: selectedVoice.languageCode,
            name: selectedVoice.name,
            ssmlGender: selectedVoice.ssmlGender,
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 1.0,
            pitch: 0,
            volumeGainDb: 0,
            effectsProfileId: ["headphone-class-device"],
          },
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      // Don't leak Google's detailed error messages to the client
      return NextResponse.json(
        { error: "Failed to generate audio" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.audioContent) {
      return NextResponse.json(
        { error: "No audio content returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      audioContent: data.audioContent,
      voice: selectedVoice.name,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong generating audio" },
      { status: 500 }
    );
  }
}
