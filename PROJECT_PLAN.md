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
- [x] `AnimatePresence` enter/exit (mobile menu, modal, toast)
- [x] Layout animations (tabs indicator, gallery filter reorder)
- [x] Spring hover / tap scale on buttons and cards
- [ ] Drag with constraints (playground, 404 page)
- [x] Parallax with `useScroll` + `useTransform` (`Parallax`)
- [x] Scroll progress bar (`ScrollProgress`)
- [x] Count-up numbers when in view (`CountUp`)
- [x] Infinite marquee (`Marquee`)
- [x] Animated gradient blobs (`GradientBlob`)
- [x] 3D tilt following the cursor (`TiltCard`)
- [x] Magnetic button following the cursor (`MagneticButton`)
- [x] Theme toggle sun/moon morph (`ThemeToggle`)
- [x] Form error shake + success checkmark SVG path draw
- [x] Card flip on hover (About team cards)
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
- [x] Build all components in `components/ui/` (see folder structure).
- [x] `Modal` and `Toast` use `AnimatePresence`; `Modal` traps focus and closes on ESC/backdrop.
- [x] `Tabs` and `Accordion` are keyboard accessible.
- [x] `BaseButton` supports variants (`solid`, `outline`, `ghost`) and colors (5 theme colors) and sizes.
- [x] Toast system via a composable `useToast()`.

**Accept when:** every UI component is demoed on `/playground`, keyboard works, both themes look good.

### Phase 4 — Home Page
- [x] Build all `sections/` used by Home and assemble `pages/index.vue` per section 5.
- [x] Put content in `app/data/` (features, testimonials, stats).

**Accept when:** Home matches the spec, smooth at 60fps on desktop, responsive at 375/768/1280.

### Phase 5 — About, Services, Gallery
- [x] Build `/about`, `/services`, `/gallery` per section 5.
- [x] Add data files: `team.ts`, `pricing.ts`, `faq.ts`, `gallery.ts`.

**Accept when:** all three pages match the spec, gallery filter animates reorder, lightbox works with keyboard.

### Phase 6 — Blog
- [x] `data/posts.ts`, `/blog` list, `/blog/[slug]` article per section 5.
- [x] Use `useSeoMeta` for title/description on each page.

**Accept when:** list → article navigation animated, unknown slug shows the error page.

### Phase 7 — Contact Form + Error Page
- [x] Form components in `components/form/`.
- [x] Multi-step contact page with Zod (shared schema in `app/utils/contactSchema.ts`, also used by the server).
- [x] `server/api/contact.post.ts`: validate with the same Zod schema, return `{ ok: true }` or a 400 with field errors. (No real email sending; just `console.log` the message.)
- [x] `app/error.vue` per section 5.

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

- [x] `hero.svg` (e.g. "creative thinking")
- [x] `about.svg` (e.g. "team spirit")
- [x] `services.svg` (e.g. "design process")
- [x] `contact.svg` (e.g. "mail sent")
- [x] `success.svg` (e.g. "completed")
- [x] `not-found.svg` (e.g. "page not found")
- [x] `cta.svg` (e.g. "launching")
- [x] `services-design.svg` (e.g. "designer")
- [x] `services-strategy.svg` (e.g. "planning")
- [x] `services-branding.svg` (e.g. "logo design")
- [x] `services-motion.svg` (e.g. "animating")

(The agent should add any additional needed filenames here.)

Note: the downloaded files use their own accent colors rather than grape (e.g. the `services-*.svg` set uses #b839a1, #3955b8, #0e95c7 and #c70e39). Fine as per-service variety, or recolor them by replacing that hex in each file.

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
- 2026-11-05 — Phase 3 — Added text-safe `*-ink` (light mode) and `*-glow` (dark mode) shades of the five theme colors in `main.css`, plus a `COLOR_CLASSES` map in `app/utils/themeColors.ts` — the base `sun`/`mint`/`sky` colors fail 4.5:1 as small text. Solid fills use white text only on grape and `zinc-950` on the others. Phase 1's ad-hoc `violet-300` classes were replaced with `grape-glow`.
- 2026-11-05 — Phase 3 — Added `useScrollLock()` (a shared counter, so stacked overlays don't unlock each other); `MobileMenu` now uses it. `html` has `scrollbar-gutter: stable`, so locking scroll doesn't shift the layout.
- 2026-11-05 — Phase 3 — `ui/Toast.vue` is the toast *viewport* (one persistent `aria-live` region), mounted once in `layouts/default.vue`. `useToast()` returns `toast`, `dismiss`, `pause` and `resume`; at most 4 toasts show at once.
- 2026-11-05 — Phase 3 — `BaseButton` wraps its element with `<Motion as-child>`, so it renders a real `NuxtLink` (`to`), `<a>` (`href`) or `<button>` with the spring hover/tap and no wrapper element. Disabled links get `aria-disabled` and `tabindex=-1`.
- 2026-11-05 — Phase 3 — `Marquee` eases its playback speed to 0.001 rather than 0 on hover — at exactly 0, motion holds the animation, and raising the speed again either leaves it frozen or jumps it to the loop start.
- 2026-11-05 — Phase 3 — Playground demos split into `components/playground/{Motion,Controls,Surfaces,Overlays,Disclosure}Demo(s).vue` (the page would have far exceeded the component size guideline). `DemoBlock` titles are now `h3` under section `h2`s.
- 2026-11-05 — Phase 4 — Home content lives in `app/data/{features,stats,testimonials,clients}.ts`. The client-logo marquee is its own section, `sections/LogoMarquee.vue`.
- 2026-11-05 — Phase 4 — Hero headline: "We bend light" uses `SplitText`, and "into ideas." is a separate `Reveal` with `.text-prism`, because gradient text can't be split (the letters render invisible).
- 2026-11-05 — Phase 4 — Added `ui/Illustration.vue`. `nuxt.config.ts` lists `public/illustrations/*.svg` at startup into `runtimeConfig.public.illustrations`, so a missing file renders the rule-8 placeholder without a request (no 404 in the console). `watch` restarts the dev server when an SVG is added. Added `@types/node` for the `node:fs` import.
- 2026-11-05 — Phase 4 — Added the `picsum(seed, w, h)` util and use it instead of template literals in template bindings: vue-tsc 3.3 mangles `` :src="`https://…${x}`" `` on components, which silently broke type-checking for the rest of the template.
- 2026-11-05 — Phase 4 — Added `useMotionEnabled()`: false during SSR and hydration, then `!prefersReducedMotion`. Use it for anything *rendered* that depends on reduced motion (the carousel's pause button and `aria-live` caused a hydration mismatch before this).
- 2026-11-05 — Phase 4 — Testimonials: slides stack in one grid cell (exit and enter overlap with no height jump). Auto-play runs only while the carousel is in view, pauses on hover or focus, has a pause button and is off for reduced motion. Swipe uses motion drag. Controls are in `sections/TestimonialsControls.vue`.
- 2026-11-05 — Phase 4 — Contrast: `StatsBand` uses a darker `grape-ink → grape → coral-ink` gradient (white text, worst pixel 4.85:1 including the blobs). The light-mode `CtaBand` pastel is at 60% so the grape-ink button text passes (4.84:1).
- 2026-11-05 — Phase 5 — Data: `team.ts`, `pricing.ts`, `faq.ts`, `gallery.ts` as planned, plus `about.ts` (timeline, values) and `services.ts`. Each service tab has its own illustration, so 4 filenames were added to §9.
- 2026-11-05 — Phase 5 — Shared `sections/PageHeader.vue` (badge, split h1, lead, optional `#aside` that slides in from the right) for About, Services and Gallery, and reusable for Blog and Contact.
- 2026-11-05 — Phase 5 — Added `ui/FlipCard.vue`: flips on mouse hover, and the full-card button flips it for touch and keyboard. The face turned away is `inert` (not `aria-hidden`, which would leave its links focusable), and focus moves to the visible face.
- 2026-11-05 — Phase 5 — Gallery masonry is a CSS grid with 10px rows and per-shape row spans, which keeps every tile in one parent so layout animations can move them. Tiles are wrapped in `<LayoutGroup>`: in motion-v a `layout` element only measures itself when *it* re-renders, so without the group the surviving tiles jumped instead of gliding.
- 2026-11-05 — Phase 5 — The lightbox reuses `UiModal` (focus trap, ESC, focus return), browses within the active filter, and keeps the last photo rendered during the exit animation.
- 2026-11-05 — Phase 5 — `UiTabs` gained a `center` prop. Placeholder people photos (team, testimonial avatars) use `alt=""`: Picsum returns random scenes, not portraits, and the names are shown as text.
- 2026-11-05 — Fix — The illustration list moved from `nuxt.config.ts` into the local module `modules/illustrations.ts`. The Phase 4 `watch` entry never fired: Nuxt resolves it relative to `srcDir` (`app/`), and its watcher doesn't cover `public/`. The module watches `public/illustrations/` itself in dev and restarts Nuxt when SVGs are added or removed (tested both ways). The 4 service illustrations are in place; their accents are not grape (see §9 note).
- 2026-11-05 — Phase 6 — `data/posts.ts` also exports helpers: `sortedPosts`, `getPost`, `getRelated` (most shared tags, then newest), `readingMinutes` and `formatDate`. Dates are formatted in UTC so server and client always agree. Post cards are `components/blog/PostCard.vue`: one stretched title link per card, with a focus ring on the card. The Blog header uses `hero.svg`, since the home hero uses a Picsum photo as specified.
- 2026-11-05 — Phase 6 — Unknown slugs use `definePageMeta({ validate })` returning a 404 error, not `throw createError()` in setup: on client navigation a setup throw doesn't stop rendering (Vue rendered the page with `post` undefined and crashed). Verified: SSR returns HTTP 404, client navigation shows the error page, and production returns 404.
- 2026-11-05 — Phase 6 — `main.css` base rules (html/body/headings/focus outline) moved into `@layer base`. Unlayered, they beat every Tailwind utility regardless of specificity, e.g. `focus-visible:outline-none` and `font-body` had no effect.
- 2026-11-05 — Phase 6 — `blog-5-cover` resolves to the same Picsum photo as `blog-2-cover`, so post 5 uses `blog-5-calm`. All 39 seeds on the site were checked for collisions.
- 2026-11-05 — Phase 7 — The shared Zod schema lives in `shared/utils/contactSchema.ts` (Nuxt 4's folder for code shared by app and server; server code can't import from `app/`) instead of `app/utils/`. It also exports `TOPICS`, `BUDGETS`, `CONTACT_STEPS` (fields per step) and `fieldErrors()`.
- 2026-11-05 — Phase 7 — Form components: `FormInput`/`FormTextarea` (floating labels via `placeholder=" "` + `peer-placeholder-shown`), native `FormSelect`, `FormRadioGroup` (real radios in styled cards, used for budget; not in the plan's list), `FormCheckbox` (tick drawn with pathLength), `FormStepIndicator` and `FormFieldError`. Errors use `aria-invalid` + `aria-describedby`; on a failed step, focus moves to the first invalid field. Errors clear as soon as the value becomes valid.
- 2026-11-05 — Phase 7 — Step changes use `AnimatePresence mode="wait"`, which mounts the next step only after the old one has left. Focus (step heading, or the field the server rejected) is applied when the new step mounts, not on `nextTick`.
- 2026-11-05 — Phase 7 — A server 400 maps `data.fieldErrors` back to the step that owns the first bad field, and shows an error toast.
- 2026-11-05 — Phase 7 — `error.vue` wraps itself in `<MotionConfig>` and `<NuxtLayout>` (it replaces app.vue). 4xx errors show their message; 5xx stay generic. It sets `robots: noindex`. In dev, visiting an unknown URL logs Vue Router/Nuxt diagnostics (R0004/E1005); production is clean.
