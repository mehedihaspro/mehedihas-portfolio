import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientId } from "@/lib/rate-limit";

const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY;
const GOOGLE_TTS_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";

// Best Bangla voices from Google Cloud TTS
const VOICES = {
  female: {
    languageCode: "bn-IN",
    name: "bn-IN-Wavenet-A",
    ssmlGender: "FEMALE",
  },
  male: {
    languageCode: "bn-IN",
    name: "bn-IN-Wavenet-B",
    ssmlGender: "MALE",
  },
  femaleEn: {
    languageCode: "en-US",
    name: "en-US-Neural2-F",
    ssmlGender: "FEMALE",
  },
  maleEn: {
    languageCode: "en-US",
    name: "en-US-Neural2-D",
    ssmlGender: "MALE",
  },
} as const;

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
    const { text, voice = "female", language = "BANGLA" } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!GOOGLE_TTS_API_KEY) {
      return NextResponse.json(
        { error: "TTS service is not configured" },
        { status: 500 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Text exceeds 5000 character limit." },
        { status: 400 }
      );
    }

    const voiceKey =
      language === "ENGLISH"
        ? voice === "male"
          ? "maleEn"
          : "femaleEn"
        : voice === "male"
        ? "male"
        : "female";

    const selectedVoice = VOICES[voiceKey];

    // 15s timeout for TTS
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
          input: { text },
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
