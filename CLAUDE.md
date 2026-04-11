# mehedihas Portfolio

## Project Overview
Personal portfolio website for Mehedi — product designer, author, content creator & mentor.

## Tech Stack
- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + CSS custom properties (4 themes)
- **CMS:** Sanity (to be set up)
- **Newsletter:** Kit (to be integrated)
- **Audio:** Google Cloud TTS (to be integrated)
- **Hosting:** Vercel

## Architecture
- `src/app/` — Next.js App Router pages
- `src/components/` — Reusable components organized by domain (ui/, layout/, blog/, interactive/)
- `src/lib/` — Utility functions and API helpers
- `reference/` — Original HTML prototypes (design reference only, not served)

## Design System
- 4 themes: light (default), sepia, dark, night
- All theme tokens defined as CSS custom properties in `globals.css`
- Mapped to Tailwind via `@theme inline` block
- Primary font: Hind Siliguri (Bangla + Latin)
- Accent color: amber (#E8A832)

## Conventions
- Use Tailwind utility classes referencing the design system (e.g., `bg-bg`, `text-text-primary`, `border-border`)
- Components are client-side only when they need interactivity — use `"use client"` directive
- All pages have metadata exports for SEO
- HTML root `lang="en"` (UI is English-first; article content can be Bangla per-post)

## Visual Design Rules — Avoid AI-Slop

When designing UI, **do not** use the lazy decorative tropes that scream "AI generated". Aim for confident, intentional, design-system-driven interfaces.

### ❌ Don't
- **Decorative gradient blobs / radial blurs.** No `radial-gradient` background ornaments, no `blur-3xl opacity-XX` halos behind cards or icons.
- **Linear-gradient borders / pseudo-borders.** No `bg-gradient-to-br` shells, no "shimmer" rings, no faux holographic outlines.
- **Stacked shadow soup.** Don't combine 3+ box-shadows on one element to fake "depth". One purposeful shadow is enough.
- **Random dot/grid patterns** as backdrop "texture". The site already has a single subtle paper-noise overlay — that's the only allowed backdrop pattern.
- **Emoji as iconography.** Icons come from `lucide-react`. Emojis are only allowed when the user-provided content contains them, never as UI furniture.
- **Arbitrary hex colors mid-component.** Use design tokens (`bg-amber`, `text-text-primary`, `bg-highlight-bg`, `border-border`, `text-success`, etc.). Inline `#XXXXXX` is only allowed for content that must look identical across themes (e.g. an OG image preview).
- **Glow / "magical" effects** on every interactive element. Glows are reserved for the primary CTA, used sparingly.
- **Tailwind opacity-on-color tricks** like `text-amber/30` for "ghost" text. If text is decoration, it shouldn't be there at all.
- **Two competing accent colors**, novelty fonts for emphasis, or fake "premium" badges (✨ Sparkles, 💎, etc.).

### ✓ Do
- Lean on **flat, solid surfaces** with intentional contrast — `bg-bg`, `bg-bg-card`, `bg-bg-subtle`.
- Use **borders, not shadows**, for separating cards from background. Shadows only for elements that genuinely float (modals, dropdowns, FABs).
- Use **one accent color** (amber) for state and emphasis. Use semantic tokens (`text-success`, `text-error`) for status.
- Keep **type hierarchy clear**: display font for hero/title moments, Inter for everything else, Hind Siliguri for Bangla. No mixing within a single label.
- Reach for **lucide icons** with `strokeWidth={1.8}` for the standard look.
- Use **rounded-full pills** for interactive chips and **`rounded-[14px]`** (the `--radius-lg` token) for cards. Don't invent new radii.
- When in doubt, **remove an effect** instead of adding one.

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check
