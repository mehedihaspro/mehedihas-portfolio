import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

// OG image must look identical across themes (it's a static image), so the
// hex values here are intentional and pinned to the LIGHT theme tokens —
// not a violation of the "no arbitrary hex" rule documented in CLAUDE.md.
const COLORS = {
  bg: "#FAF5EE",       // --bg
  ink: "#2D2D2D",      // --text-primary
  inkSoft: "#6B5D4F",  // --text-secondary
  muted: "#8B7D6F",    // --text-muted
  border: "#E8DFD0",   // --border
  amber: "#E8A832",    // --amber
} as const;

const TIERS = [
  { min: 100, title: "Perfect score" },
  { min: 80, title: "Impressive" },
  { min: 60, title: "Solid" },
  { min: 40, title: "Getting there" },
  { min: 0, title: "Honest start" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawScore = Number.parseInt(searchParams.get("score") || "0", 10);
    const rawTotal = Number.parseInt(searchParams.get("total") || "5", 10);
    // Clamp to sane ranges
    const score = Math.max(0, Math.min(100, Number.isFinite(rawScore) ? rawScore : 0));
    const total = Math.max(1, Math.min(100, Number.isFinite(rawTotal) ? rawTotal : 5));
    // Strip control chars then slice
    const sanitize = (s: string, max: number) =>
      s.replace(/[\u0000-\u001F\u007F<>]/g, "").slice(0, max);
    const title = sanitize(searchParams.get("title") || "Blog Quiz", 80);
    const rawName = searchParams.get("name");
    const name = rawName ? sanitize(rawName, 40) : undefined;

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
            backgroundColor: COLORS.bg,
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
                fill={COLORS.ink}
              />
              <circle cx="55.3332" cy="24.3226" r="3.33333" fill={COLORS.amber} />
            </svg>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 20px",
                borderRadius: 999,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: COLORS.muted,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Quiz score
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
              color: COLORS.amber,
              marginBottom: 16,
              display: "flex",
            }}
          >
            {tier.title}
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
                color: COLORS.ink,
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
                color: COLORS.muted,
                marginLeft: 8,
              }}
            >
              /{total}
            </span>
            <span
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: COLORS.amber,
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
                color: COLORS.inkSoft,
                marginBottom: 12,
                display: "flex",
              }}
            >
              <span style={{ color: COLORS.ink, fontWeight: 800 }}>{name}</span>
              <span style={{ marginLeft: 10 }}>aced it</span>
            </div>
          )}

          {/* Article title */}
          <div
            style={{
              fontSize: 26,
              color: COLORS.inkSoft,
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
              borderTop: `1px solid ${COLORS.border}`,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: COLORS.muted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              mehedihas.pro
            </span>
            <span
              style={{
                fontSize: 20,
                color: COLORS.muted,
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
