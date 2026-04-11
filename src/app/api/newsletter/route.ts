import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientId } from "@/lib/rate-limit";
import { isValidEmail } from "@/lib/validators";

const KIT_API_KEY = process.env.KIT_API_KEY;
const KIT_FORM_ID = process.env.KIT_FORM_ID;
const KIT_API_URL = "https://api.convertkit.com/v3";

export async function POST(request: NextRequest) {
  // Rate limit: 5 subscriptions per IP per 15 minutes
  const clientId = getClientId(request);
  const rl = rateLimit(`newsletter:${clientId}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const { email } = await request.json();

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (!KIT_API_KEY) {
      return NextResponse.json(
        { error: "Newsletter service is not configured" },
        { status: 500 }
      );
    }

    if (!KIT_FORM_ID) {
      return NextResponse.json(
        { error: "Newsletter form is not set up yet" },
        { status: 500 }
      );
    }

    // Timeout guard (10s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    let response: Response;
    try {
      response = await fetch(
        `${KIT_API_URL}/forms/${KIT_FORM_ID}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: KIT_API_KEY, email }),
          signal: controller.signal,
        }
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, message: "Successfully subscribed!" });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
