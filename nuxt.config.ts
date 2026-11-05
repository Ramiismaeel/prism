import tailwindcss from "@tailwindcss/vite";

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
  // Pre-compress JS/CSS/SVG (gzip + brotli) at build time; the Node server serves them when accepted.
  nitro: { compressPublicAssets: true },
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
    geminiApiKey: "", // filled by NUXT_GEMINI_API_KEY in .env (used when no Claude key is set)
    // Filled by modules/illustrations.ts from the files in public/illustrations.
    public: { illustrations: [] as string[] },
  },
});
