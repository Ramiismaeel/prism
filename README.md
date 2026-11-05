# Prism — Creative Playground

A playful, fictional creative-studio website built to explore animation in Nuxt: page and layout transitions, scroll-driven effects, springs, drag, a full motion + UI component kit, light/dark mode, a multi-step form and a small Claude-powered widget.

> "We bend light into ideas."

## Tech stack

| Part | Choice |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) (TypeScript, `app/` directory) |
| Animation | [motion-v](https://motion.dev/docs/vue) (Motion for Vue) + CSS page transitions |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Light/dark | `@nuxtjs/color-mode` |
| Icons / fonts / images | `@nuxt/icon` (Lucide, Simple Icons), `@nuxt/fonts` (Space Grotesk, Inter), `@nuxt/image` + Lorem Picsum |
| Forms | Zod, validated on both client and server |
| AI widget | Claude (Haiku) via `@anthropic-ai/sdk`, or Gemini (Flash-Lite) via `@google/genai` |

## Getting started

Requires **Node.js 22.22+ or 24.15+**.

```bash
npm install          # also runs `nuxt prepare`
npm run dev          # http://localhost:3000
```

### Optional: the AI lab (component generator + tagline machine)

The Playground's "AI lab" has two AI tools: a **component generator** (describe a component, e.g. "a mint toggle for dark mode", and the AI picks one from Prism's kit and fills in its settings; it never writes code, the recipe is validated on the server and rendered with Prism's real components) and a **tagline machine**. Both call an AI model from the server. Copy `.env.example` to `.env` and add **one** key:

```bash
NUXT_GEMINI_API_KEY=...        # Gemini Flash-Lite: free tier at https://aistudio.google.com/app/apikey
NUXT_ANTHROPIC_API_KEY=sk-ant-... # Claude Haiku: https://platform.claude.com (used first if both are set)
```

If the provider is busy or the key is wrong, the tools fall back to labelled samples (the reason is logged on the server). Restart the dev server after changing `.env`. In production, pass the variables to the Node process (e.g. `node --env-file=.env .output/server/index.mjs`).

Without a key both tools run in **demo mode**: they return clearly labelled samples (a keyword-matched component, template taglines) and make no external calls. The key is only read on the server (`runtimeConfig`); it is never sent to the browser. Each generation is one small Claude Haiku request, rate-limited to 8 per minute per visitor.

## Scripts

```bash
npm run dev          # dev server with HMR
npm run build        # production build → .output/
npm run preview      # preview the production build
npx eslint .         # lint
npx nuxi typecheck   # type check (vue-tsc)
```

Deploy the `.output/` folder as a Node server (`node .output/server/index.mjs`). The contact form (`/api/contact`) and the AI widget (`/api/tagline`) are server routes, so a fully static `nuxt generate` build would lose them.

## What's inside

**Pages:** Home, About, Services, Gallery, Playground, Blog (list + articles), Contact and a custom 404/error page. The Playground shows everything at once: 8 quick animation tiles, a live demo of every motion and UI kit component, and the AI lab.

**Motion kit** (`app/components/motion`): `Reveal`, `StaggerList`, `SplitText`, `CountUp`, `Parallax`, `GradientBlob`, `Typewriter`.

**UI kit** (`app/components/ui`): `BaseButton` (3 variants × 5 colors × 3 sizes), `MagneticButton`, `Badge`, `Card`, `TiltCard`, `FlipCard`, `Modal`, `Tabs`, `Accordion`, `Toast` + `useToast()`, `Tooltip`, `Toggle`, `Marquee`, `Illustration`.

**Forms** (`app/components/form`): floating-label inputs, select, radio cards, an animated checkbox and a step indicator, used by the 3-step contact form.

```
app/
  components/   layout · motion · ui · sections · form · blog · contact · playground
  composables/  useToast, useFocusTrap, useScrollLock, useMotionEnabled
  data/         page content (features, team, posts, pricing, gallery, …)
  pages/        routes
  error.vue     custom error page
server/api/     contact.post.ts, tagline.post.ts
shared/utils/   code shared by app and server (Zod contact schema, limits)
modules/        illustrations.ts (lists public/illustrations at startup)
```

### Illustrations

unDraw SVGs live in `public/illustrations/`. Any missing file renders a labelled placeholder instead (no broken image, no 404), and adding a file restarts the dev server automatically.

## Accessibility & motion

- Every page works in light and dark mode, at phone, tablet and desktop widths.
- `prefers-reduced-motion` is respected everywhere: entrance animations become instant, parallax, marquee and tilt stand still, and the carousel doesn't auto-play.
- Keyboard support throughout: focus-trapped modal and menu, WAI-ARIA tabs and accordion, roving focus, visible focus rings, and focus management in the multi-step form.
- Lighthouse (mobile, production build): **Accessibility 100, Best Practices 100, SEO 100** on every page. Performance scores 76–86. The main cost is intentional: above-the-fold entrance animations start invisible and only reveal after hydration. Drop the `Reveal`/`SplitText` wrappers around hero content if you'd rather optimise LCP.

## Credits

Illustrations by [unDraw](https://undraw.co) (Katerina Limpitsouni). Photos from [Lorem Picsum](https://picsum.photos). Icons from [Lucide](https://lucide.dev) and [Simple Icons](https://simpleicons.org) via Iconify. All studio names, people and quotes are fictional.
