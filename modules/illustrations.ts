import { existsSync, mkdirSync, readdirSync, watch } from "node:fs";
import { resolve } from "node:path";
import { defineNuxtModule } from "@nuxt/kit";

/**
 * Lists the unDraw SVGs in public/illustrations into `runtimeConfig.public.illustrations`,
 * so <UiIllustration> can render a placeholder for missing files without requesting them.
 *
 * In dev it also watches that folder and restarts Nuxt when an SVG is added or removed
 * (Nuxt's own watcher doesn't cover public/, and `watch` in nuxt.config is relative to srcDir).
 */
export default defineNuxtModule({
  meta: { name: "prism-illustrations" },
  setup(_options, nuxt) {
    const dir = resolve(nuxt.options.rootDir, "public/illustrations");
    const list = () =>
      existsSync(dir)
        ? readdirSync(dir)
            .filter((f) => f.endsWith(".svg"))
            .map((f) => f.slice(0, -4))
        : [];

    const illustrations = list();
    nuxt.options.runtimeConfig.public.illustrations = illustrations;

    if (!nuxt.options.dev) return;

    mkdirSync(dir, { recursive: true });
    let timer: ReturnType<typeof setTimeout> | undefined;
    const watcher = watch(dir, () => {
      // Debounce: copying several files fires many events.
      clearTimeout(timer);
      timer = setTimeout(() => {
        const next = list();
        if (next.join() === illustrations.join()) return;
        console.info("[prism-illustrations] illustrations changed, restarting Nuxt…");
        void nuxt.callHook("restart", { hard: true });
      }, 300);
    });
    nuxt.hook("close", () => {
      clearTimeout(timer);
      watcher.close();
    });
  },
});
