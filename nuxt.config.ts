import { existsSync, readdirSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";

// unDraw files present in public/illustrations. <UiIllustration> renders a placeholder for
// anything missing without requesting it (no 404s). Adding a file restarts the dev server.
const ILLUSTRATIONS_DIR = "public/illustrations";
const illustrations = existsSync(ILLUSTRATIONS_DIR)
  ? readdirSync(ILLUSTRATIONS_DIR)
      .filter((f) => f.endsWith(".svg"))
      .map((f) => f.slice(0, -4))
  : [];

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: [
    "@nuxt/eslint",
    "motion-v/nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/image",
  ],
  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },
  colorMode: { classSuffix: "", preference: "system", fallback: "light" }, // adds "dark" class on <html>
  fonts: {
    // Declared explicitly: the families are referenced through CSS variables,
    // which @nuxt/fonts cannot detect on its own.
    families: [
      { name: "Space Grotesk", provider: "google", weights: [400, 500, 600, 700], global: true },
      { name: "Inter", provider: "google", weights: [400, 500, 600, 700], global: true },
    ],
  },
  image: { domains: ["picsum.photos", "fastly.picsum.photos"] }, // picsum redirects to its fastly CDN
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      title: "Prism — Creative Playground",
      htmlAttrs: { lang: "en" },
      meta: [{ name: "description", content: "Prism — we bend light into ideas." }],
    },
  },
  runtimeConfig: {
    anthropicApiKey: "", // filled by NUXT_ANTHROPIC_API_KEY in .env
    public: { illustrations },
  },
  watch: [`${ILLUSTRATIONS_DIR}/*.svg`],
});
