<script setup lang="ts">
useSeoMeta({ title: "Playground" });

// Temporary demos of the motion and UI kits; tidied up in Phase 9.
const sections = [
  { id: "motion-kit", title: "Motion kit", blurb: "Scroll-driven and in-view animations." },
  { id: "ui-kit", title: "UI kit", blurb: "Buttons, surfaces, overlays and disclosure widgets." },
  { id: "ai-lab", title: "AI lab", blurb: "A tiny Claude-powered widget, with the API key kept on the server." },
];
</script>

<template>
  <div>
    <LayoutScrollProgress />

    <!-- Hero: GradientBlob + SplitText + Reveal -->
    <section class="relative isolate overflow-hidden">
      <MotionGradientBlob color="grape" class="-top-24 -left-16 -z-10 size-80" />
      <MotionGradientBlob color="coral" class="top-10 right-0 -z-10 size-72" :delay="2" :duration="16" />
      <MotionGradientBlob color="sky" class="-bottom-24 left-1/3 -z-10 size-72" :delay="4" :duration="18" />
      <div class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <UiBadge color="mint" dot caps class="mb-4">Playground</UiBadge>
        <MotionSplitText
          as="h1"
          by="char"
          text="Poke the pixels"
          class="block text-5xl font-bold tracking-tight sm:text-7xl"
        />
        <MotionReveal :delay="0.5" class="mt-4 max-w-xl">
          <p class="text-lg text-zinc-600 dark:text-zinc-400">
            Every piece of the motion and UI kits, live. Scroll down: the bar along the top edge is
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

    <div class="mx-auto max-w-7xl space-y-16 px-4 pb-24 sm:px-6 lg:px-8">
      <section v-for="s in sections" :id="s.id" :key="s.id" class="scroll-mt-24" :aria-labelledby="`${s.id}-title`">
        <div class="mb-6">
          <h2 :id="`${s.id}-title`" class="text-3xl font-bold tracking-tight">{{ s.title }}</h2>
          <p class="mt-1 text-zinc-600 dark:text-zinc-400">{{ s.blurb }}</p>
        </div>
        <PlaygroundMotionDemos v-if="s.id === 'motion-kit'" />
        <PlaygroundAiTagline v-else-if="s.id === 'ai-lab'" />
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
