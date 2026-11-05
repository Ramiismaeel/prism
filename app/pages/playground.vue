<script setup lang="ts">
useSeoMeta({
  title: "Playground",
  description: "Poke the pixels: quick animation demos, the full motion and UI kits, and AI tools (Claude or Gemini) that build components and write taglines.",
});

const sections = [
  { id: "quick-demos", title: "Quick demos", blurb: "One animation per tile: drag it, slide it, tilt it, pop it. Hover the info buttons to see how each works." },
  { id: "motion-kit", title: "Motion kit", blurb: "Scroll-driven and in-view animations used across the site." },
  { id: "ui-kit", title: "UI kit", blurb: "Buttons, badges, toggles, tooltips, cards, overlays and disclosure widgets." },
  { id: "ai-lab", title: "AI lab", blurb: "Describe a component or a startup idea and let AI (Claude or Gemini) do the rest. Keys stay on the server." },
];
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
            Every animation and component in Prism, live. Scroll down: the bar along the top edge is
            <code class="font-mono text-sm">ScrollProgress</code>.
          </p>
        </MotionReveal>
        <nav aria-label="Playground sections" class="mt-8 flex flex-wrap gap-3">
          <UiBaseButton
            v-for="s in sections"
            :key="s.id"
            :href="`#${s.id}`"
            variant="outline"
            size="sm"
            icon-right="lucide:arrow-down"
          >
            {{ s.title }}
          </UiBaseButton>
        </nav>
      </div>
    </section>

    <div class="mx-auto max-w-7xl space-y-20 px-4 pb-24 sm:px-6 lg:px-8">
      <section v-for="s in sections" :id="s.id" :key="s.id" class="scroll-mt-24" :aria-labelledby="`${s.id}-title`">
        <div class="mb-6">
          <h2 :id="`${s.id}-title`" class="text-3xl font-bold tracking-tight">{{ s.title }}</h2>
          <p class="mt-1 text-zinc-600 dark:text-zinc-400">{{ s.blurb }}</p>
        </div>
        <PlaygroundTiles v-if="s.id === 'quick-demos'" />
        <PlaygroundMotionDemos v-else-if="s.id === 'motion-kit'" />
        <div v-else-if="s.id === 'ai-lab'" class="space-y-6">
          <PlaygroundAiComponentGenerator />
          <PlaygroundAiTagline />
        </div>
        <div v-else class="space-y-6">
          <PlaygroundControlsDemo />
          <PlaygroundSurfacesDemo />
          <PlaygroundOverlaysDemo />
          <PlaygroundDisclosureDemo />
        </div>
      </section>
    </div>
  </div>
</template>
