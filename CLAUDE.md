# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project plan comes first

`PROJECT_PLAN.md` is the single source of truth for this project ("Prism", an animated Nuxt playground and fictional creative studio site). Before doing any work:

1. Read `PROJECT_PLAN.md` and find the first phase in section 6 that still has unchecked boxes.
2. Do **one phase only**. Then verify its "Accept when" criteria (run the dev server), tick the checkboxes in the plan, and stop and report what you built and how you checked it.
3. Commit after each phase with `git commit -m "phase N: <title>"`.
4. If a package API differs from the reference code in the plan, follow the current official docs and add an entry to the plan's **Change Log** (section 10).
5. When a unDraw illustration is missing, render a colored placeholder box that shows the expected filename, and add the file to section 9 (Assets To Download).

The plan holds the full spec: pages, sections, the animation catalogue and the target folder layout. Don't copy it here; read it.

## Commands

```bash
npm install          # also runs `nuxt prepare` (postinstall), which generates .nuxt/
npm run dev          # dev server at http://localhost:3000
npm run build        # production build
npm run preview      # preview the production build
npm run generate     # static generation
npx eslint .         # lint (there is no npm script for it)
npx nuxi typecheck   # type check (needs vue-tsc, which is not installed yet)
```

There is no test framework in the repo. You verify a phase by checking its acceptance criteria against the running dev server. Chrome is installed on this machine, so client-side behavior (hydration, transitions, theme persistence, focus handling, console errors) can be scripted with `playwright-core` (`chromium.launch({ channel: "chrome" })`). Install it in a scratch directory, not as a project dependency.

`eslint.config.mjs` imports `./.nuxt/eslint.config.mjs`, which the `@nuxt/eslint` module generates, so run `nuxt prepare` or `npm install` first.

## Architecture and conventions

- **Nuxt 4 layout:** app code lives in `app/` (pages, layouts, components, composables, `data/`, `utils/`). Server routes live in `server/api/`. Components are auto-imported and get a prefix from their folder, so `components/ui/BaseButton.vue` is used as `<UiBaseButton>`.
- **Component library:** reusable pieces live in `app/components/{layout,ui,motion,sections,form}`. Reuse them and never duplicate one. Keep components under about 150 lines. Toasts go through a `useToast()` composable.
- **Animation:** use `motion-v` only (`motion`, `AnimatePresence`, `useScroll`, `useTransform`, `useSpring`, `useInView`, `useReducedMotion`). It is registered through the `motion-v/nuxt` module. Route-level page and layout transitions are CSS classes (`.page-*`, `.layout-*`) in `app/assets/css/main.css`, wired up through `app.pageTransition` and `app.layoutTransition` in `nuxt.config.ts`. Heavy animations must check `useReducedMotion()`. The global CSS `prefers-reduced-motion` block is a fallback and must stay.
- **Styling:** use Tailwind v4 through `@tailwindcss/vite`. There is no `tailwind.config`. The theme tokens live in the `@theme` block in `main.css`: the colors `grape`, `coral`, `sun`, `mint` and `sky`, and the fonts `font-display` and `font-body`. Custom CSS goes only in `main.css`.
- **Dark mode:** `@nuxtjs/color-mode` with `classSuffix: ''` puts a `dark` class on `<html>`, and `@custom-variant dark` in `main.css` connects the `dark:` variant to that class. Every component must work in both themes. Wrap the theme toggle in `<ClientOnly>` to avoid hydration mismatches.
- **Images:** use `<NuxtImg>` with Lorem Picsum (`https://picsum.photos/seed/<word>/<w>/<h>`). `picsum.photos` is the only allowed image domain. Always use a fixed seed and set `alt`, `width`, `height` and `loading="lazy"` (except on the hero image). Illustrations are served from `/illustrations/<name>.svg` (`public/illustrations/`).
- **Forms:** Phase 7 plans one shared Zod schema in `app/utils/contactSchema.ts`. Both the client form and `server/api/contact.post.ts` import it.
- **Secrets:** the Claude API key is set only through `runtimeConfig.anthropicApiKey`, which comes from `NUXT_ANTHROPIC_API_KEY` in `.env` (gitignored). Read it only on the server, in `server/api/tagline.post.ts`.

- **Shared data and helpers:** nav and social links (plus `isNavActive`) live in `app/data/navigation.ts`. `app/composables/useFocusTrap.ts` handles focus trapping, ESC and focus restore for any overlay.
- **Page titles:** `app.vue` sets a `titleTemplate` (`"<title> · Prism"`). Pages call `useSeoMeta({ title })`, and the home page sets no title.
- **Icons:** `lucide:*` for UI icons and `simple-icons:*` for brand logos. Both are installed locally (`@iconify-json/*`).

## Gotchas found so far

- **Overlays:** fixed-position overlays must `<Teleport to="#teleports">`. The sticky header uses `backdrop-filter`, which traps `position: fixed` descendants, and `#teleports` is Nuxt's SSR-safe teleport target.
- **Template refs:** a template ref on a `<motion.*>` element returns the component instance, not the DOM node. Put the `ref` on a plain inner element when you need DOM access.
- **Decorative SVGs in buttons:** an animated SVG inside a `<button>` (especially one using `mask`) needs `pointer-events: none`. Otherwise Chrome gives focus to the SVG child on click, which shows a stray focus ring and breaks Tab order.
- **SVG masks:** `<mask>` children inherit the SVG's `stroke`. Set `stroke="none"` on the mask, or the edges leave semi-transparent rings.
- **Focus styles:** the global `:focus-visible` outline in `main.css` deliberately sets no `border-radius`, so the outline follows each element's own rounding.
