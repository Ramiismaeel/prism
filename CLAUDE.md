# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project plan

`PROJECT_PLAN.md` holds the original spec (pages, sections, animation catalogue) and a **Change Log** (§10) of every deviation and its reason. All 9 phases are complete. For new work, keep the plan's Global Rules (§1), add a dated Change Log entry when you deviate, and commit with a descriptive message.

## Commands

```bash
npm install          # also runs `nuxt prepare` (postinstall), which generates .nuxt/
npm run dev          # dev server at http://localhost:3000
npm run build        # production build
npm run preview      # preview the production build
npm run generate     # static generation
npx eslint .         # lint (there is no npm script for it)
npx nuxi typecheck   # type check (vue-tsc)
```

There is no test framework in the repo. You verify a phase by checking its acceptance criteria against the running dev server. Chrome is installed on this machine, so client-side behavior (hydration, transitions, theme persistence, focus handling, console errors) can be scripted with `playwright-core` (`chromium.launch({ channel: "chrome" })`). Install it in a scratch directory, not as a project dependency.

`eslint.config.mjs` imports `./.nuxt/eslint.config.mjs`, which the `@nuxt/eslint` module generates, so run `nuxt prepare` or `npm install` first.

## Architecture and conventions

- **Nuxt 4 layout:** app code lives in `app/` (pages, layouts, components, composables, `data/`, `utils/`). Server routes live in `server/api/`. Code used by both the app and the server goes in `shared/` (import with `#shared/...`); the server can't import from `app/`. Components are auto-imported and get a prefix from their folder, so `components/ui/BaseButton.vue` is used as `<UiBaseButton>`.
- **Component library:** reusable pieces live in `app/components/{layout,ui,motion,sections,form}`. Reuse them and never duplicate one. Keep components under about 150 lines. Toasts go through a `useToast()` composable.
- **Animation:** use `motion-v` only (`motion`, `AnimatePresence`, `useScroll`, `useTransform`, `useSpring`, `useInView`, `useReducedMotion`). It is registered through the `motion-v/nuxt` module. Route-level page and layout transitions are CSS classes (`.page-*`, `.layout-*`) in `app/assets/css/main.css`, wired up through `app.pageTransition` and `app.layoutTransition` in `nuxt.config.ts`. Heavy animations must check `useReducedMotion()`. The global CSS `prefers-reduced-motion` block is a fallback and must stay.
- **Styling:** use Tailwind v4 through `@tailwindcss/vite`. There is no `tailwind.config`. The theme tokens live in the `@theme` block in `main.css`: the colors `grape`, `coral`, `sun`, `mint` and `sky`, and the fonts `font-display` and `font-body`. Custom CSS goes only in `main.css`.
- **Dark mode:** `@nuxtjs/color-mode` with `classSuffix: ''` puts a `dark` class on `<html>`, and `@custom-variant dark` in `main.css` connects the `dark:` variant to that class. Every component must work in both themes. Wrap the theme toggle in `<ClientOnly>` to avoid hydration mismatches.
- **Images:** use `<NuxtImg>` with Lorem Picsum (`https://picsum.photos/seed/<word>/<w>/<h>`). `picsum.photos` is the only allowed image domain. Always use a fixed seed and set `alt`, `width`, `height` and `loading="lazy"` (except on the hero image). Illustrations are served from `/illustrations/<name>.svg` (`public/illustrations/`).
- **Secrets / AI widget:** keys live only in server `runtimeConfig` (`anthropicApiKey` ← `NUXT_ANTHROPIC_API_KEY`, `geminiApiKey` ← `NUXT_GEMINI_API_KEY`) via the gitignored `.env`. `.env.example` is committed, so it must only ever contain empty values. `server/api/tagline.post.ts` picks Claude (Haiku 5.5) → Gemini (`gemini-flash-lite-latest`) → demo. Provider calls live in `server/utils/taglineProviders.ts` (structured outputs, short timeouts, Gemini retries capped). Any provider failure falls back to labelled samples (`demo: true, fallbackFrom`) and is logged; only bad input (400), safety declines (422) and rate limits (429) are errors. `gemini-flash-latest` was frequently 503 "high demand", which is why flash-lite is used. Test the UI by mocking `/api/tagline`; real calls cost money or quota. Test the UI by mocking `/api/tagline`; real calls cost money.

- **Motion kit** (`app/components/motion/*`, used as `<MotionReveal>`, `<MotionSplitText>`, …): built on `<Motion :as>`, with `as` typed as `MotionTag` from `~/types/motion`. Never type it as `string`, because that breaks motion-v's prop types. `app.vue` wraps everything in `<MotionConfig reduced-motion="user">`.
- **Colors in components:** take a `color: ThemeColor` prop and pick classes from `COLOR_CLASSES` (`~/utils/themeColors`), which holds full class strings so Tailwind detects them. Never build class names like `` `bg-${color}` ``. For colored *text* use `text-<color>-ink dark:text-<color>-glow`, because the base colors fail contrast as small text.
- **Overlays** (menu, modal, future lightbox): `<Teleport to="#teleports">` + `useFocusTrap(el, open, close)` + `useScrollLock(open)`. `UiModal` already does all of this, so reuse it.
- **Toasts:** `<UiToast />` is mounted once in the default layout. Call `useToast().toast({ title, description?, type })` from anywhere.
- **Page tops:** use `<SectionsPageHeader eyebrow title lead color>`, with an optional `#aside` slot for an illustration.
- **Blog:** posts and helpers live in `app/data/posts.ts` (format dates with `formatDate`, which uses UTC so there's no hydration mismatch). Cards are `<BlogPostCard>`.
- **Forms:** compose `Form*` components (`FormInput`, `FormTextarea`, `FormSelect`, `FormRadioGroup`, `FormCheckbox`, `FormStepIndicator`). Each takes an `error` prop and handles `aria-invalid`/`aria-describedby` itself. Validate with the shared Zod schema (`#shared/utils/contactSchema`) on both client and server.
- **Playground:** `pages/playground.vue` has four sections, linked from buttons at the top: **Quick demos** (`PlaygroundTiles`, a grid of `PlaygroundTile*` components, one animation each, wrapped in `<PlaygroundTile title how>` with an info tooltip), **Motion kit** (`PlaygroundMotionDemos`), **UI kit** (`PlaygroundControlsDemo`, `…SurfacesDemo`, `…OverlaysDemo`, `…DisclosureDemo`, using `PlaygroundDemoBlock` cards with Replay buttons) and **AI lab**. The kit showcases demo every component; keep them in sync when a component changes.
- **AI component generator:** the AI only returns a *recipe* validated by `componentRecipe` (`shared/utils/componentSpec.ts`, a Zod discriminated union of 13 kit-backed types with color, icon and length limits). `PlaygroundSpecRenderer` renders it with the real `Ui*`/`Motion*` components; generated code never runs. To add a type: add its shape to `componentSpec`, describe it in the `SYSTEM` prompt in `server/api/component.post.ts`, render it in `SpecRenderer.vue`, and add keywords in `shared/utils/demoComponent.ts`. Both AI routes share `server/utils/ai.ts` (`pickProvider`, `generateJson`, `describeFailure`) and `PlaygroundAiProviderNote`.
- **Shared data and helpers:** nav and social links (plus `isNavActive`) live in `app/data/navigation.ts`. `app/composables/useFocusTrap.ts` handles focus trapping, ESC and focus restore for any overlay.
- **Page titles:** `app.vue` sets a `titleTemplate` (`"<title> · Prism"`). Pages call `useSeoMeta({ title })`, and the home page sets no title.
- **Icons:** `lucide:*` for UI icons and `simple-icons:*` for brand logos. Both are installed locally (`@iconify-json/*`).

## Gotchas found so far

- **Reduced motion vs SSR:** `useReducedMotion()` (VueUse `useMediaQuery`) can already be `true` on the first client render while the server rendered `false`. Use it only for `transition`s and callbacks. For anything rendered (`v-if`, attributes, text), use `useMotionEnabled()`, which stays `false` until after mount. Expected console noise: with OS reduced motion on, Motion logs one dev-only warning ("You have Reduced Motion enabled…").
- **`.text-prism` with animated children:** `background-clip: text` doesn't reach children that are their own stacking context (transform, opacity, filter). Never put `.text-prism` on `MotionSplitText`; the text renders invisible.
- **Root nodes:** in dev mode Vue keeps template comments. A comment placed before the root element of a layout or page counts as a second root node (NUXT_E4002), so put comments inside the root.
- **Horizontal overflow:** the layout wrapper has `overflow-x-clip` so animation offsets never cause sideways scroll. Don't move it to `body`.
- **Clipped overflow hides layout bugs:** because of `overflow-x-clip`, too-wide content gets cut off rather than causing a scrollbar. Grid and flex children holding wide or scrolling content need `min-w-0`. When verifying at 375px, check element bounds, not just `scrollWidth`.
- **Motion playback speed:** never set an animation's `speed` to exactly 0. Ease to something like 0.001 (see `UiMarquee`).
- **vue-tsc and URL template literals:** vue-tsc 3.3 mangles `` :src="`https://…${x}`" `` on components (the `//` turns into a comment start), which silently breaks type-checking for the rest of the template ("Cannot find name", bogus `.value` errors). Build URLs in script, e.g. with `picsum(seed, w, h)` from `~/utils/picsum`.
- **Illustrations:** use `<UiIllustration name="cta" alt=… :width :height>`. Files live in `public/illustrations/` (not the `public/` root). `modules/illustrations.ts` lists them into `runtimeConfig.public.illustrations`, so missing ones render a labelled placeholder with no request. In dev it watches the folder and restarts Nuxt when an SVG is added or removed. Don't use nuxt.config `watch` for files outside `app/`: it resolves relative to `srcDir`.
- **Layout reflow animations:** a Motion element with `layout` only animates when *it* re-renders. When siblings are filtered or removed and the survivors should glide, wrap the list in `<LayoutGroup>` (see `SectionsGalleryGrid`). `layoutId` indicators (nav underline, tabs, filter pill) work without it. Verify layout animations by sampling transforms per frame, not by checking end positions.
- **Hidden interactive content:** use `inert` on content that is visually hidden but still in the DOM (e.g. the far side of `UiFlipCard`). `aria-hidden` alone leaves its links focusable.
- **Picsum people photos are not portraits:** seeds return random scenes, so photos standing in for people get `alt=""` when the name is shown as text.
- **404 for dynamic routes:** validate params with `definePageMeta({ validate: (route) => exists || createError({ statusCode: 404, … }) })`. Don't `throw createError()` in `<script setup>`: on client navigation Vue keeps rendering the page with the missing data.
- **CSS layers:** global element styles in `main.css` must stay inside `@layer base`. Unlayered CSS overrides every Tailwind utility regardless of specificity.
- **Tailwind v4 transforms:** `scale-*`, `rotate-*` and `translate-*` set the individual CSS `scale`/`rotate`/`translate` properties, not `transform`. Measure them via `getComputedStyle(el).scale` etc.; Motion's animations do use `transform`.
- **Picsum seed collisions:** different seeds can return the same photo (`blog-2-cover` = `blog-5-cover`). When adding seeds, resolve them (`curl -w '%{redirect_url}' https://picsum.photos/seed/<seed>/200/200`) and compare the `/id/<n>/` values.
- **Focus after `AnimatePresence mode="wait"`:** the new child mounts only after the old one has left, so `nextTick` focuses the *old* element. Focus from a watcher on the new element's template ref (see `ContactForm`).
- **Windows + production server:** a `node .output/server/index.mjs` started behind `timeout` survives stopping the shell and keeps file locks in `.output/`, so the next `nuxt build` fails silently. Start it with `exec node …` and confirm the port is free afterwards.
- **Lighthouse:** run it against the production build (`npm run build` + `node .output/server/index.mjs`), not the dev server. Use `npx lighthouse@12 <url> --chrome-flags="--headless=new"` with `CHROME_PATH` pointing at Chrome. Current baseline: A11y/Best Practices/SEO 100, Performance 76–86 (mobile).
- **Picsum hosts:** picsum redirects to `fastly.picsum.photos`. Both hosts must stay in `image.domains`.
- **Overlays:** fixed-position overlays must `<Teleport to="#teleports">`. The sticky header uses `backdrop-filter`, which traps `position: fixed` descendants, and `#teleports` is Nuxt's SSR-safe teleport target.
- **Template refs:** a template ref on a `<motion.*>` element returns the component instance, not the DOM node. Put the `ref` on a plain inner element when you need DOM access.
- **Decorative SVGs in buttons:** an animated SVG inside a `<button>` (especially one using `mask`) needs `pointer-events: none`. Otherwise Chrome gives focus to the SVG child on click, which shows a stray focus ring and breaks Tab order.
- **SVG masks:** `<mask>` children inherit the SVG's `stroke`. Set `stroke="none"` on the mask, or the edges leave semi-transparent rings.
- **Focus styles:** the global `:focus-visible` outline in `main.css` deliberately sets no `border-radius`, so the outline follows each element's own rounding.
