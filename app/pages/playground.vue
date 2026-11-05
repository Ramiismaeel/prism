<script setup lang="ts">
useSeoMeta({ title: "Playground" });

// Temporary Phase 2 demos of the motion kit; tidied up in Phase 9.
const features = [
  { name: "Spectrum Design", color: "bg-grape" },
  { name: "Refraction Strategy", color: "bg-coral" },
  { name: "Glow Branding", color: "bg-sun" },
  { name: "Motion Lab", color: "bg-mint" },
  { name: "Color Systems", color: "bg-sky" },
  { name: "Lightspeed Dev", color: "bg-grape" },
];

const stats = [
  { to: 128, suffix: "+", label: "Projects shipped" },
  { to: 42, label: "Happy clients" },
  { to: 99.9, decimals: 1, suffix: "%", label: "Good-vibes uptime" },
  { to: 1500000, label: "Pixels pushed" },
];

const revealCards = [
  { label: "From below", props: { y: 40 } },
  { label: "From the left", props: { y: 0, x: -60, delay: 0.15 } },
  { label: "From the right", props: { y: 0, x: 60, delay: 0.3 } },
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
        <p
          class="mb-4 inline-flex items-center gap-2 rounded-full bg-mint/15 px-3 py-1 text-xs font-semibold tracking-widest uppercase"
        >
          <span class="size-2 rounded-full bg-mint" aria-hidden="true" />Playground
        </p>
        <MotionSplitText
          as="h1"
          by="char"
          text="Poke the pixels"
          class="block text-5xl font-bold tracking-tight sm:text-7xl"
        />
        <MotionReveal :delay="0.5" class="mt-4 max-w-xl">
          <p class="text-lg text-zinc-600 dark:text-zinc-400">
            Every piece of the motion kit, live. Scroll down: the bar along the top edge is
            <code class="font-mono text-sm">ScrollProgress</code>.
          </p>
        </MotionReveal>
      </div>
    </section>

    <div class="mx-auto grid max-w-7xl gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-2 lg:px-8">
      <PlaygroundDemoBlock title="Reveal" description="Fades and slides in when scrolled into view." replay>
        <div class="grid gap-4 sm:grid-cols-3">
          <MotionReveal v-for="card in revealCards" :key="card.label" v-bind="card.props">
            <div class="grid h-28 place-items-center rounded-2xl bg-white text-sm font-medium shadow-sm dark:bg-zinc-800">
              {{ card.label }}
            </div>
          </MotionReveal>
        </div>
      </PlaygroundDemoBlock>

      <PlaygroundDemoBlock title="StaggerList" description="Children pop in one after another." replay>
        <MotionStaggerList
          v-slot="{ item }"
          :items="features"
          :item-key="(f) => f.name"
          class="flex flex-wrap gap-2"
        >
          <span
            class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm dark:bg-zinc-800"
          >
            <span class="size-2.5 rounded-full" :class="item.color" aria-hidden="true" />
            {{ item.name }}
          </span>
        </MotionStaggerList>
      </PlaygroundDemoBlock>

      <PlaygroundDemoBlock title="SplitText" description="Word-by-word or letter-by-letter." replay>
        <MotionSplitText as="p" text="We bend light into ideas." class="block font-display text-3xl font-bold" />
        <MotionSplitText
          as="p"
          by="char"
          text="Refraction, but make it fun."
          :delay="0.4"
          class="mt-3 block font-display text-2xl font-semibold text-coral"
        />
      </PlaygroundDemoBlock>

      <PlaygroundDemoBlock title="CountUp" description="Numbers count up when they come into view." replay>
        <dl class="grid grid-cols-2 gap-4">
          <div v-for="s in stats" :key="s.label" class="rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-800">
            <dt class="text-xs text-zinc-500 dark:text-zinc-400">{{ s.label }}</dt>
            <dd class="mt-1 font-display text-3xl font-bold">
              <MotionCountUp :to="s.to" :decimals="s.decimals" :suffix="s.suffix" />
            </dd>
          </div>
        </dl>
      </PlaygroundDemoBlock>

      <PlaygroundDemoBlock title="Parallax" description="Layers drift at different speeds as you scroll.">
        <div class="relative h-80 overflow-hidden rounded-2xl">
          <MotionParallax :offset="70">
            <NuxtImg
              src="https://picsum.photos/seed/playground-parallax/1200/900"
              alt="Colorful landscape used as a parallax background"
              width="1200"
              height="900"
              loading="lazy"
              class="-mt-[70px] h-[460px] w-full object-cover"
            />
          </MotionParallax>
          <div class="absolute inset-0 grid place-items-center">
            <MotionParallax :offset="-50">
              <span class="rounded-full bg-white/85 px-5 py-2 font-display text-lg font-bold text-zinc-900 shadow-lg backdrop-blur">
                I move the other way
              </span>
            </MotionParallax>
          </div>
        </div>
      </PlaygroundDemoBlock>

      <PlaygroundDemoBlock title="GradientBlob" description="Soft, morphing color blobs for backgrounds.">
        <div class="relative isolate h-80 overflow-hidden rounded-2xl bg-white dark:bg-zinc-950">
          <MotionGradientBlob color="grape" class="top-4 left-4 size-40" />
          <MotionGradientBlob color="coral" class="top-10 right-6 size-36" :delay="1" />
          <MotionGradientBlob color="sun" class="bottom-4 left-1/4 size-36" :delay="2" />
          <MotionGradientBlob color="mint" class="right-1/4 bottom-8 size-32" :delay="3" />
          <MotionGradientBlob color="sky" class="top-1/3 left-1/2 size-32" :delay="4" />
        </div>
      </PlaygroundDemoBlock>
    </div>
  </div>
</template>
