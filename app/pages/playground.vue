<script setup lang="ts">
import { picsum } from "~/utils/picsum";

useSeoMeta({
  title: "Playground",
  description: "Poke the pixels: drag, spring, tilt, morph and celebrate. Plus a tiny Claude-powered tagline machine.",
});
</script>

<template>
  <div>
    <LayoutScrollProgress />

    <section class="relative isolate overflow-hidden" aria-labelledby="page-title">
      <MotionGradientBlob color="grape" class="-top-24 -left-16 -z-10 size-80" />
      <MotionGradientBlob color="coral" class="top-10 right-0 -z-10 size-72" :delay="2" :duration="16" />
      <MotionGradientBlob color="sky" class="-bottom-24 left-1/3 -z-10 size-72" :delay="4" :duration="18" />
      <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <UiBadge color="mint" dot caps class="mb-4">Playground</UiBadge>
        <MotionSplitText id="page-title" as="h1" by="char" text="Poke the pixels" class="block text-5xl font-bold tracking-tight sm:text-7xl" />
        <MotionReveal :delay="0.5" class="mt-4 max-w-xl">
          <p class="text-lg text-zinc-600 dark:text-zinc-400">
            One animation per tile: drag it, slide it, tilt it, pop it. Hover the
            <Icon name="lucide:info" class="inline size-4 align-[-2px]" aria-label="info" /> buttons to see how each one works.
          </p>
        </MotionReveal>
      </div>
    </section>

    <div class="mx-auto max-w-7xl space-y-16 px-4 pb-24 sm:px-6 lg:px-8">
      <section aria-labelledby="tiles-title">
        <h2 id="tiles-title" class="sr-only">Animation demos</h2>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <PlaygroundTileDrag />
          <PlaygroundTileSpring />
          <PlaygroundTile title="Magnetic button" how="The button follows your cursor inside an invisible field, smoothed by springs. Mouse only, and off with reduced motion.">
            <UiMagneticButton :strength="0.5">
              <UiBaseButton size="lg" icon="lucide:magnet">Come closer</UiBaseButton>
            </UiMagneticButton>
          </PlaygroundTile>
          <PlaygroundTile title="Tilt card" how="Pointer position maps to rotateX/rotateY with springs, plus a glare that follows the cursor (useMotionTemplate).">
            <UiTiltCard class="w-full max-w-56">
              <NuxtImg
                format="webp"
                :src="picsum('tilt-demo', 600, 600)"
                alt=""
                width="300"
                height="300"
                loading="lazy"
                class="aspect-square w-full rounded-3xl object-cover"
              />
            </UiTiltCard>
          </PlaygroundTile>
          <PlaygroundTileMorph />
          <PlaygroundTileConfetti />
          <PlaygroundTileScrollRotate />
          <PlaygroundTileToast />
        </div>
      </section>

      <section id="ai-lab" class="scroll-mt-24" aria-labelledby="ai-lab-title">
        <div class="mb-6">
          <h2 id="ai-lab-title" class="text-3xl font-bold tracking-tight">AI lab</h2>
          <p class="mt-1 text-zinc-600 dark:text-zinc-400">A tiny Claude-powered widget, with the API key kept on the server.</p>
        </div>
        <PlaygroundAiTagline />
      </section>
    </div>
  </div>
</template>
