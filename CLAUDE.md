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
- Language: Bangla primary (lang="bn"), English for UI labels

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check
