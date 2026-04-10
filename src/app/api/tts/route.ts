import { NextRequest, NextResponse } from "next/server";

const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY;
const GOOGLE_TTS_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";

// Best Bangla voices from Google Cloud TTS
// bn-IN voices are Indian Bangla, most accurate for South Asian audiences
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
  // English fallbacks for English content
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
  try {
    const { text, voice = "female", language = "BANGLA" } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (!GOOGLE_TTS_API_KEY) {
      return NextResponse.json(
        { error: "TTS service is not configured" },
        { status: 500 }
      );
    }

    // Google TTS has a 5000 character limit per request
    if (text.length > 5000) {
      return NextResponse.json(
        {
          error:
            "Text exceeds 5000 character limit. Please break into chunks.",
        },
        { status: 400 }
      );
    }

    // Select voice based on language and gender
    const voiceKey =
      language === "ENGLISH"
        ? voice === "male"
          ? "maleEn"
          : "femaleEn"
        : voice === "male"
        ? "male"
        : "female";

    const selectedVoice = VOICES[voiceKey];

    const response = await fetch(
      `${GOOGLE_TTS_URL}?key=${GOOGLE_TTS_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            errorData.error?.message || "Failed to generate audio",
        },
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

    // Return as data URL so client can play it directly
    // For production, consider uploading to a CDN and returning the URL
    return NextResponse.json({
      success: true,
      audioContent: data.audioContent, // base64 MP3
      voice: selectedVoice.name,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong generating audio" },
      { status: 500 }
    );
  }
}
