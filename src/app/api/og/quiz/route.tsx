import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const TIERS = [
  { min: 100, emoji: "🎯", title: "Perfect", color: "#2E7D32" },
  { min: 80, emoji: "⭐", title: "Impressive", color: "#C48A1A" },
  { min: 60, emoji: "📖", title: "Solid", color: "#8B6B4A" },
  { min: 40, emoji: "🤔", title: "Getting there", color: "#C48A1A" },
  { min: 0, emoji: "💭", title: "Honest start", color: "#6B5D4F" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const score = Number.parseInt(searchParams.get("score") || "0", 10);
    const total = Number.parseInt(searchParams.get("total") || "5", 10);
    const title = (searchParams.get("title") || "Blog Quiz").slice(0, 80);
    const name = searchParams.get("name")?.slice(0, 40);

    const percent = Math.round((score / total) * 100) || 0;
    const tier = TIERS.find((t) => percent >= t.min) || TIERS[TIERS.length - 1];

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FAF5EE",
            backgroundImage:
              "radial-gradient(circle at 85% 15%, rgba(232,168,50,0.25) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(232,168,50,0.15) 0%, transparent 45%)",
            padding: 80,
            position: "relative",
            fontFamily: "sans-serif",
          }}
        >
          {/* Top row: logo + label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 60,
            }}
          >
            {/* mh Logo (inline SVG) */}
            <svg width="70" height="56" viewBox="0 0 59 48" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M36.5625 21.9363C37.9275 21.3226 39.4397 20.9811 41.0312 20.9811C47.0891 20.9811 52 25.9241 52 32.0216V47.9689H45.5V32.0216C45.5 29.5374 43.4993 27.5236 41.0312 27.5236C38.5632 27.5236 36.5625 29.5374 36.5625 32.0216V48L15.4375 38.5497V14.8476H6.5V38.564H0V8.30508H17.9972L36.5625 0V21.9363ZM21.9375 13.7023V34.2969L30.0625 37.9323V10.0677L21.9375 13.7023Z"
                fill="#36322D"
              />
              <circle cx="55.3332" cy="24.3226" r="3.33333" fill="#FF8000" />
            </svg>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                backgroundColor: "rgba(255,255,255,0.8)",
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(232, 168, 50, 0.3)",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: tier.color,
                }}
              />
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#6B5D4F",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Quiz Score
              </span>
            </div>
          </div>

          {/* Tier label */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: tier.color,
              marginBottom: 16,
              display: "flex",
            }}
          >
            {tier.emoji} {tier.title}
          </div>

          {/* Big score */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontSize: 280,
                fontWeight: 900,
                lineHeight: 0.85,
                color: "#36322D",
                letterSpacing: "-0.06em",
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontSize: 120,
                fontWeight: 900,
                lineHeight: 0.85,
                color: "#8B7D6F",
                marginLeft: 8,
              }}
            >
              /{total}
            </span>
            <span
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: "#C48A1A",
                marginLeft: "auto",
              }}
            >
              {percent}%
            </span>
          </div>

          {/* Name (if provided) */}
          {name && (
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: "#6B5D4F",
                marginBottom: 12,
                display: "flex",
              }}
            >
              <span style={{ color: "#36322D", fontWeight: 800 }}>{name}</span>
              <span style={{ marginLeft: 10 }}>aced it</span>
            </div>
          )}

          {/* Article title */}
          <div
            style={{
              fontSize: 26,
              color: "#6B5D4F",
              lineHeight: 1.3,
              marginBottom: "auto",
              maxWidth: 900,
              display: "flex",
            }}
          >
            {title}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 40,
              paddingTop: 30,
              borderTop: "1px solid rgba(139, 125, 111, 0.2)",
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#8B7D6F",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              mehedihas.pro
            </span>
            <span
              style={{
                fontSize: 20,
                color: "#8B7D6F",
                fontStyle: "italic",
              }}
            >
              Take the quiz →
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response("Failed to generate image", { status: 500 });
  }
}
