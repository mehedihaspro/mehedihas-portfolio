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

## Buttons — single source of truth

**Always use `<Button>` from `@/components/ui/button` for any clickable action.** Inline button classNames are not allowed. Use `buttonClasses({ variant, size })` only when you need to apply button styling to a `<Link>` or `<a>` (typically for navigation).

### Variants

| variant | Background | Use it for |
|---|---|---|
| **primary** | `bg-text-primary text-bg` (auto-inverts per theme: dark on light themes, light on dark themes) | The single most important action on a screen — Subscribe, Start the quiz, Next, See results, Get in touch, Try again (only when paired alone), Play. |
| **secondary** | `bg-bg-card` + `border-border` + `text-text-primary` | The "other choice" beside a primary — Try again, Cancel, Back home. |
| **ghost** | transparent, `text-text-secondary`, hover `bg-bg-subtle` | Low-emphasis nav inside a flow — Back, Previous, Skip. |
| **icon** | Like secondary but square/circle | Icon-only buttons — close X, FAB, sticky controls. |

### Sizes

| size | height | padding | text | use |
|---|---|---|---|---|
| `sm` | 36px | px-4 | 13px | Inside modals, dense toolbars. |
| `md` (default) | 44px | px-5 | 14px | Page-level CTAs (the standard). |
| `lg` | 52px | px-7 | 15px | Hero CTAs, full-width forms (Subscribe). |
| `icon-sm` / `icon-md` / `icon-lg` | 36 / 44 / 52 square | — | — | Icon-only. |

All button shapes are **`rounded-full`**. Don't introduce `rounded-xl` or `rounded-lg` button shapes — they don't exist in the system anymore.

### Theme adaptation
The primary variant uses `bg-text-primary text-bg`, which means it automatically inverts:
- **Light theme** → near-black button on cream background
- **Sepia theme** → dark brown button on warm cream
- **Dark theme** → near-white button on near-black background
- **Night theme** → near-white button on pure black

Never hardcode `#FFFFFF` / `#000000` / `#2D2D2D` for button colors — let the tokens flip.

### Loading state
Pass `loading={isPending}` and the Button renders a spinner + sets `aria-busy`. Don't build your own spinner inside a button.

### Disabled state
Pass `disabled` and the Button applies `opacity-40 cursor-not-allowed pointer-events-none`. Single rule everywhere.

### What's NOT a Button
These look like buttons but they're a different pattern — leave them alone:
- **Toggleable chips** (theme tags, font tags, language filter, quiz options, Listen toggle on the blog header). They use a border + amber active state. Selection ≠ action.
- **Navbar links** — they're text links with active-state highlighting, not actions.
- **Sliders** (text size, line spacing) — interactive control, not a button.

### Where amber stays (intentional)
Amber is the **selection / state** color, not the action color:
- Selected state on theme/font/language/quiz tags
- Active nav link in the navbar
- Audio progress bar fill + dot
- Reading progress strip at the top
- Section-label decorative dashes
- Logo brand dot
- Focus-visible outline

If you find yourself reaching for `bg-amber` on a button, stop and use `<Button variant="primary">` instead.

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check

## One-off migrations
Sanity schema migrations live in `scripts/`. Each script has a comment
block at the top explaining prerequisites. Current scripts:

- `scripts/migrate-categories.ts` — converts the legacy `post.category`
  string field into references to the new `category` document type.
  Run once after deploying the new schema:

  ```bash
  export SANITY_WRITE_TOKEN=sk...    # from manage.sanity.io → API → Tokens
  npx tsx scripts/migrate-categories.ts
  ```

  Safe to re-run — it's idempotent.
