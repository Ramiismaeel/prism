# PROJECT_PLAN.md — "Prism" Animated Nuxt Playground

> **For the AI agent reading this file:** This is the single source of truth for the project.
> Execute the phases **in order**, one phase per session/task. After each phase:
> run the dev server, verify the acceptance criteria, tick the checkboxes in this file,
> and commit with git (`git commit -m "phase N: <title>"`). Do not skip ahead.
> If something in this plan is outdated (package API changed), check the package docs,
> adapt, and add a short note under **Change Log** at the bottom of this file.

---

## 0. Project Summary

**Prism** is a fun, fictional creative studio website built for learning and experimenting.
Goals: many animations and transitions, a multi-color palette, light/dark mode, forms,
and a rich reusable component library.

### Tech Stack

| Part | Choice |
|---|---|
| Framework | Nuxt 4 (latest stable, `app/` directory, TypeScript) |
| Animation | `motion-v` (Motion for Vue) + Nuxt CSS page/layout transitions |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| Light/Dark | `@nuxtjs/color-mode` (class strategy) |
| Icons | `@nuxt/icon` (Iconify, e.g. `lucide:*`) |
| Fonts | `@nuxt/fonts` (Space Grotesk for headings, Inter for body) |
| Images | `@nuxt/image` + Lorem Picsum (`https://picsum.photos/seed/<word>/<w>/<h>`) |
| Illustrations | unDraw SVGs stored in `public/illustrations/` |
| Forms | Zod validation + Nuxt server route |
| AI feature (bonus) | Claude API via Nuxt server route (`@anthropic-ai/sdk`) |

---

## 1. Global Rules (apply to EVERY phase)

1. Nuxt 4 conventions: code lives in `app/`, server code in `server/`. Use `<script setup lang="ts">`.
2. Animations use **motion-v only**: `import { motion, AnimatePresence } from 'motion-v'`.
   Use composables like `useScroll`, `useTransform`, `useSpring`, `useInView` from `motion-v` when needed.
3. Styling uses **Tailwind v4 utilities only**. No other CSS frameworks. Custom CSS only in `app/assets/css/main.css`.
4. Use the theme colors: `grape`, `coral`, `sun`, `mint`, `sky` (e.g. `bg-grape`, `text-coral`).
5. **Every** component and page must look correct in **light AND dark** mode (use the `dark:` variant).
6. Respect `prefers-reduced-motion`: use motion-v's `useReducedMotion()` in heavy animations and keep the CSS fallback.
7. Images: Lorem Picsum with a fixed `seed` so images are stable. Always set `alt`, `width`, `height`, `loading="lazy"` (except hero).
8. Illustrations: reference `/illustrations/<name>.svg`. If a file is missing, render a colored placeholder box with the expected filename and add it to the **Assets To Download** list (section 9).
9. Reuse components from `app/components/motion` and `app/components/ui`. Never duplicate a component that already exists.
10. Mobile-first and fully responsive (check 375px, 768px, 1280px).
11. Accessibility: semantic HTML, focus-visible styles, keyboard support for menus/modals/tabs, `aria-*` where needed.
12. Never expose secrets to the client. API keys only in `runtimeConfig` (server side) and `.env`. `.env` must be in `.gitignore`.
13. Keep components small (< ~150 lines). Split if bigger.
14. Lorem ipsum text is fine for content; keep headings fun and on-theme.

---

## 2. Target Folder Structure

```
prism/
├─ PROJECT_PLAN.md
├─ nuxt.config.ts
├─ .env                      # NUXT_ANTHROPIC_API_KEY=... (never commit)
├─ public/
│  └─ illustrations/         # unDraw SVGs
├─ server/
│  └─ api/
│     ├─ contact.post.ts
│     └─ tagline.post.ts     # bonus (Claude API)
└─ app/
   ├─ app.vue
   ├─ error.vue
   ├─ assets/css/main.css
   ├─ layouts/default.vue
   ├─ pages/
   │  ├─ index.vue
   │  ├─ about.vue
   │  ├─ services.vue
   │  ├─ gallery.vue
   │  ├─ playground.vue
   │  ├─ contact.vue
   │  └─ blog/
   │     ├─ index.vue
   │     └─ [slug].vue
   ├─ data/                  # static content (posts, team, features, pricing...)
   ├─ composables/
   └─ components/
      ├─ layout/   AppHeader, AppFooter, MobileMenu, ThemeToggle, ScrollProgress
      ├─ ui/       BaseButton, MagneticButton, Badge, Card, TiltCard, Modal,
      │            Tabs, Accordion, Toast, Tooltip, Toggle, Marquee
      ├─ motion/   Reveal, StaggerList, SplitText, CountUp, Parallax, GradientBlob
      ├─ sections/ HeroSection, FeaturesGrid, StatsBand, Testimonials, CtaBand, PricingTable
      └─ form/     FormInput, FormTextarea, FormSelect, FormCheckbox, StepIndicator
```

---

## 3. Reference Code (use as the starting point)

### 3.1 Setup commands

```bash
npm create nuxt@latest prism
cd prism
git init

npm i motion-v tailwindcss @tailwindcss/vite zod
npx nuxi module add color-mode
npx nuxi module add icon
npx nuxi module add fonts
npx nuxi module add image
# bonus phase only:
npm i @anthropic-ai/sdk
```

### 3.2 `nuxt.config.ts`

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: [
    'motion-v/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/image',
  ],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  colorMode: { classSuffix: '', preference: 'system', fallback: 'light' },
  image: { domains: ['picsum.photos'] },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: { title: 'Prism — Creative Playground' },
  },
  runtimeConfig: {
    anthropicApiKey: '', // set via NUXT_ANTHROPIC_API_KEY in .env
  },
})
```

### 3.3 `app/assets/css/main.css`

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-grape: #7c3aed;
  --color-coral: #f43f5e;
  --color-sun: #f59e0b;
  --color-mint: #10b981;
  --color-sky: #0ea5e9;

  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
}

html { scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  @apply bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300;
}
h1, h2, h3, h4 { font-family: var(--font-display); }

/* Page transitions */
.page-enter-active, .page-leave-active,
.layout-enter-active, .layout-leave-active { transition: all .4s ease; }
.page-enter-from { opacity: 0; transform: translateY(20px); filter: blur(6px); }
.page-leave-to   { opacity: 0; transform: translateY(-20px); filter: blur(6px); }
.layout-enter-from, .layout-leave-to { opacity: 0; }

/* Multi-color gradient text helper */
.text-prism {
  background: linear-gradient(90deg, var(--color-grape), var(--color-coral), var(--color-sun), var(--color-mint), var(--color-sky));
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: prism-shift 8s linear infinite;
}
@keyframes prism-shift { to { background-position: 300% 0; } }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

### 3.4 `app/components/motion/Reveal.vue`

```vue
<script setup lang="ts">
import { motion } from 'motion-v'

const props = withDefaults(
  defineProps<{ delay?: number; y?: number; x?: number; once?: boolean }>(),
  { delay: 0, y: 30, x: 0, once: true },
)
</script>

<template>
  <motion.div
    :initial="{ opacity: 0, y: props.y, x: props.x }"
    :while-in-view="{ opacity: 1, y: 0, x: 0 }"
    :in-view-options="{ once: props.once, amount: 0.3 }"
    :transition="{ duration: 0.6, delay: props.delay, ease: 'easeOut' }"
  >
    <slot />
  </motion.div>
</template>
```

### 3.5 Picsum usage example

```vue
<NuxtImg
  src="https://picsum.photos/seed/prism-hero/1200/800"
  alt="Colorful abstract scene"
  width="1200" height="800"
  class="rounded-3xl object-cover"
/>
```

---

## 4. Animation Catalogue (must all exist somewhere in the site)

- [x] Scroll reveal (`Reveal`)
- [x] Staggered children (`StaggerList`)
- [x] Split-text letter/word reveal (`SplitText`)
- [x] Page + layout transitions (CSS in `main.css`)
- [ ] `AnimatePresence` enter/exit (mobile menu, modal, toast)
- [ ] Layout animations (tabs indicator, gallery filter reorder)
- [ ] Spring hover / tap scale on buttons and cards
- [ ] Drag with constraints (playground, 404 page)
- [x] Parallax with `useScroll` + `useTransform` (`Parallax`)
- [x] Scroll progress bar (`ScrollProgress`)
- [x] Count-up numbers when in view (`CountUp`)
- [ ] Infinite marquee (`Marquee`)
- [x] Animated gradient blobs (`GradientBlob`)
- [ ] 3D tilt following the cursor (`TiltCard`)
- [ ] Magnetic button following the cursor (`MagneticButton`)
- [x] Theme toggle sun/moon morph (`ThemeToggle`)
- [ ] Form error shake + success checkmark SVG path draw
- [ ] Card flip on hover (About team cards)
- [x] Animated gradient text (`.text-prism`)
- [ ] Typewriter text effect (Playground AI widget)

---

## 5. Pages & Sections Spec

### Home `/`
- `HeroSection`: `GradientBlob` background (3 blobs: grape, coral, sky), `SplitText` headline, subtitle fade, two buttons (`MagneticButton` + outline), picsum hero image with `Parallax`.
- `Marquee`: row of fake client logos (text + icons).
- `FeaturesGrid`: 6 cards, each a different theme color, staggered reveal, hover lift.
- `StatsBand`: 4 `CountUp` numbers on a gradient band.
- `Testimonials`: carousel with `AnimatePresence` slide transitions, auto-play + arrows + dots, picsum avatars.
- `CtaBand`: big colorful band with unDraw illustration and button.

### About `/about`
- Intro with unDraw illustration sliding in from the side.
- Timeline: vertical line that grows with scroll (`useScroll` + `scaleY`), items reveal alternately left/right.
- Team: 6 flip cards (front: picsum photo + name, back: bio + social icons).
- Values: 3 cards with icons and stagger.

### Services `/services`
- `Tabs` with a sliding active indicator (layout animation), each tab shows a service + illustration.
- `PricingTable`: 3 plans, monthly/yearly `Toggle` with animated price change, middle plan highlighted with gradient border.
- `Accordion` FAQ (6 items) with smooth height animation.

### Gallery `/gallery`
- Filter chips (All, Nature, City, People, Abstract) — items reorder with layout animation.
- Masonry-style grid of ~18 picsum images (different seeds and heights).
- Click opens `Modal` lightbox with zoom-in, prev/next keys, ESC to close.

### Playground `/playground`
- Grid of demo tiles, one animation each: drag box with constraints, spring slider, `MagneticButton`, `TiltCard`, morphing shape (border-radius keyframes), confetti button, scroll-linked rotating element, toast trigger.
- Bonus: AI Tagline widget (Phase 8).

### Blog `/blog` and `/blog/[slug]`
- Data from `app/data/posts.ts` (6 posts: slug, title, excerpt, cover seed, tags, date, body paragraphs).
- List: cards with hover lift + image zoom, staggered.
- Article: `ScrollProgress` bar, cover image, paragraphs revealed on scroll, "related posts" at the bottom, 404 if slug not found.

### Contact `/contact`
- 3-step form: (1) name + email, (2) topic select + budget radio, (3) message + consent checkbox.
- `StepIndicator` with animated progress line.
- Floating labels, Zod validation per step, shake animation on error, inline error text.
- Submit POSTs to `/api/contact`; show success screen with animated checkmark + unDraw illustration + `Toast`.

### 404 `app/error.vue`
- Big animated "404" with `.text-prism`, draggable unDraw illustration, "Back home" button (`clearError({ redirect: '/' })`).

---

## 6. Phases (execute in order)

### Phase 1 — Foundation
- [x] Create project, install packages (section 3.1), `git init`.
- [x] Apply `nuxt.config.ts` and `main.css` from section 3.
- [x] `app.vue` with `<NuxtLayout><NuxtPage /></NuxtLayout>`.
- [x] `layouts/default.vue` with `AppHeader`, `<slot />`, `AppFooter`.
- [x] `AppHeader`: logo with `.text-prism`, nav links with animated active underline (layout animation), `ThemeToggle`, hamburger opening `MobileMenu` with `AnimatePresence`. Sticky with blur background.
- [x] `ThemeToggle`: switches `useColorMode().preference` between light/dark with sun/moon morph animation. Wrap in `<ClientOnly>` to avoid hydration mismatch.
- [x] `AppFooter`: links, social icons, copyright.
- [x] Create empty placeholder pages for all routes with a title so navigation works.

**Accept when:** `npm run dev` works, all routes navigate with page transition, dark mode toggles and persists after reload, mobile menu opens/closes animated, no console errors.

### Phase 2 — Motion Kit
- [x] Build all components in `components/motion/`: `Reveal`, `StaggerList`, `SplitText`, `CountUp`, `Parallax`, `GradientBlob`.
- [x] Build `ScrollProgress` in `components/layout/`.
- [x] Add a temporary demo of each on `/playground`.

**Accept when:** each motion component works on the playground, respects reduced motion, works in both themes.

### Phase 3 — UI Kit
- [ ] Build all components in `components/ui/` (see folder structure).
- [ ] `Modal` and `Toast` use `AnimatePresence`; `Modal` traps focus and closes on ESC/backdrop.
- [ ] `Tabs` and `Accordion` are keyboard accessible.
- [ ] `BaseButton` supports variants (`solid`, `outline`, `ghost`) and colors (5 theme colors) and sizes.
- [ ] Toast system via a composable `useToast()`.

**Accept when:** every UI component is demoed on `/playground`, keyboard works, both themes look good.

### Phase 4 — Home Page
- [ ] Build all `sections/` used by Home and assemble `pages/index.vue` per section 5.
- [ ] Put content in `app/data/` (features, testimonials, stats).

**Accept when:** Home matches the spec, smooth at 60fps on desktop, responsive at 375/768/1280.

### Phase 5 — About, Services, Gallery
- [ ] Build `/about`, `/services`, `/gallery` per section 5.
- [ ] Add data files: `team.ts`, `pricing.ts`, `faq.ts`, `gallery.ts`.

**Accept when:** all three pages match the spec, gallery filter animates reorder, lightbox works with keyboard.

### Phase 6 — Blog
- [ ] `data/posts.ts`, `/blog` list, `/blog/[slug]` article per section 5.
- [ ] Use `useSeoMeta` for title/description on each page.

**Accept when:** list → article navigation animated, unknown slug shows the error page.

### Phase 7 — Contact Form + Error Page
- [ ] Form components in `components/form/`.
- [ ] Multi-step contact page with Zod (shared schema in `app/utils/contactSchema.ts`, also used by the server).
- [ ] `server/api/contact.post.ts`: validate with the same Zod schema, return `{ ok: true }` or a 400 with field errors. (No real email sending; just `console.log` the message.)
- [ ] `app/error.vue` per section 5.

**Accept when:** invalid input shows errors + shake, valid submit shows success animation + toast, server rejects invalid payloads.

### Phase 8 — Bonus: Claude API Tagline Widget
- [ ] `npm i @anthropic-ai/sdk`. Add `NUXT_ANTHROPIC_API_KEY=` to `.env` (ask the user to fill in the key; never hard-code it).
- [ ] Create `server/api/tagline.post.ts`:

```ts
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const Body = z.object({ idea: z.string().min(3).max(200) })

export default defineEventHandler(async (event) => {
  const parsed = Body.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid idea' })

  const { anthropicApiKey } = useRuntimeConfig()
  if (!anthropicApiKey) throw createError({ statusCode: 500, statusMessage: 'Missing API key' })

  const client = new Anthropic({ apiKey: anthropicApiKey })
  const msg = await client.messages.create({
    model: 'claude-haiku-5-5',
    max_tokens: 300,
    system: 'You write short, playful startup taglines. Reply ONLY with a JSON array of 3 strings.',
    messages: [{ role: 'user', content: `Startup idea: ${parsed.data.idea}` }],
  })

  const text = msg.content
    .map((b) => (b.type === 'text' ? b.text : ''))
    .join('')
    .replace(/```json|```/g, '')
    .trim()

  try {
    return { taglines: JSON.parse(text) as string[] }
  } catch {
    return { taglines: [text] }
  }
})
```

- [ ] Playground widget: input + button, loading shimmer, results appear with a typewriter effect and staggered reveal, errors shown via toast.
- [ ] Simple protection: disable button while loading; limit idea length.

**Accept when:** widget returns 3 taglines, no API key reaches the browser (check the Network tab and the client bundle).

### Phase 9 — Polish
- [ ] Review every page in light and dark mode.
- [ ] Check responsive at 375 / 768 / 1280.
- [ ] Test with OS "reduce motion" enabled.
- [ ] Run Lighthouse; fix any accessibility issues below 90.
- [ ] Remove temporary demos that are no longer needed; keep the playground tidy.
- [ ] Update `README.md` with setup steps.

**Accept when:** all checkboxes in section 4 (Animation Catalogue) are ticked.

---

## 7. Content Theme (for lorem ipsum and headings)

- Studio name: **Prism**. Tagline: "We bend light into ideas."
- Tone: playful, colorful, confident.
- Feature names: Spectrum Design, Refraction Strategy, Glow Branding, Motion Lab, Color Systems, Lightspeed Dev.
- Picsum seeds: use readable words, e.g. `prism-hero`, `team-1`…`team-6`, `gallery-nature-1`, `blog-1-cover`.

---

## 8. Agent Workflow Notes

- Start each session by reading this file and finding the first unchecked phase.
- Work on **one phase only**, then stop and report: what was built, how it was verified, any issues.
- Tick checkboxes in this file as tasks are completed.
- Commit after each phase.
- If a package API differs from the code in this file, follow the current official docs and log the change below.

---

## 9. Assets To Download (unDraw)

Download from https://undraw.co, set the accent color to `#7c3aed` (grape), save as SVG in `public/illustrations/`:

- [ ] `hero.svg` (e.g. "creative thinking")
- [ ] `about.svg` (e.g. "team spirit")
- [ ] `services.svg` (e.g. "design process")
- [ ] `contact.svg` (e.g. "mail sent")
- [ ] `success.svg` (e.g. "completed")
- [ ] `not-found.svg` (e.g. "page not found")
- [ ] `cta.svg` (e.g. "launching")

(The agent should add any additional needed filenames here.)

---

## 10. Change Log

_The agent records deviations from this plan here (date — phase — change — reason)._

- 2026-11-05 — Phase 1 — Added `@nuxt/eslint` to `modules` — `eslint.config.mjs` imports the file it generates in `.nuxt/`.
- 2026-11-05 — Phase 1 — Declared `fonts.families` (Space Grotesk + Inter, weights 400–700, `global: true`) in `nuxt.config.ts` — the fonts are only referenced through CSS variables, which `@nuxt/fonts` can't detect on its own.
- 2026-11-05 — Phase 1 — Installed `@iconify-json/lucide` and `@iconify-json/simple-icons` as devDependencies — icons are served locally instead of from the Iconify API at runtime. Brand logos use `simple-icons:*`.
- 2026-11-05 — Phase 1 — Added `app/data/navigation.ts` (nav and social links shared by the header, mobile menu and footer) and `app/composables/useFocusTrap.ts` (used by `MobileMenu`; reuse it for `Modal` in Phase 3).
- 2026-11-05 — Phase 1 — `main.css`: added a global `:focus-visible` outline (grape, sky in dark mode). `.text-prism` repeats grape at the end of the gradient so the loop is seamless. Also added a skip link in `layouts/default.vue`.
- 2026-11-05 — Phase 1 — `MobileMenu` teleports to `#teleports` (Nuxt's SSR-safe teleport target) — the header's `backdrop-filter` would otherwise make `position: fixed` children relative to the header.
- 2026-11-05 — Phase 1 — The decorative SVG in `ThemeToggle` uses `pointer-events: none` — otherwise Chrome gives focus to the masked `<circle>` on click instead of the button.
- 2026-11-05 — Phase 2 — Added `typescript` and `vue-tsc` as devDependencies — `npx nuxi typecheck` needs them.
- 2026-11-05 — Phase 2 — The motion kit uses `<Motion :as>` instead of `motion.div`, so callers can pick the tag. `as` props are typed as the literal union `MotionTag` (`app/types/motion.ts`), because a plain `string` breaks motion-v's prop typings.
- 2026-11-05 — Phase 2 — `app.vue` wraps the app in `<MotionConfig reduced-motion="user">` as a reduced-motion safety net. With OS reduced motion on, Motion logs a one-time dev-only console warning ("You have Reduced Motion enabled…"); this is expected.
- 2026-11-05 — Phase 2 — Reduced motion only changes transitions and callbacks, never the rendered initial styles, because `useReducedMotion()` can differ between SSR and the first client render (hydration mismatch). `Parallax` gates its strength with a motion value that is set after mount.
- 2026-11-05 — Phase 2 — Added `fastly.picsum.photos` to `image.domains` — picsum redirects there, and IPX returned 403 without it.
- 2026-11-05 — Phase 2 — `layouts/default.vue` wrapper gets `overflow-x-clip` — Reveal x-offsets and blobs were causing sideways scroll on mobile. It isn't on `body`, because body overflow propagates to the viewport as `hidden`.
- 2026-11-05 — Phase 2 — Playground demos use a temporary `components/playground/DemoBlock.vue` (card with a Replay button that remounts run-once animations).
