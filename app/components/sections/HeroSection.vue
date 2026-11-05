<script setup lang="ts">
import { picsum } from "~/utils/picsum";

const avatars = ["avatar-ada", "avatar-kenji", "avatar-priya", "avatar-mateo"];
</script>

<template>
  <section class="relative isolate overflow-hidden" aria-labelledby="hero-title">
    <MotionGradientBlob color="grape" class="-top-32 -left-24 -z-10 size-[26rem]" />
    <MotionGradientBlob color="coral" class="top-1/4 -right-24 -z-10 size-96" :delay="2" :duration="16" />
    <MotionGradientBlob color="sky" class="-bottom-32 left-1/4 -z-10 size-96" :delay="4" :duration="18" />

    <div
      class="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-16 pb-20 sm:px-6 md:pt-24 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:pb-28"
    >
      <div>
        <MotionReveal :y="12">
          <UiBadge color="grape" dot caps class="mb-6">Creative studio</UiBadge>
        </MotionReveal>
        <h1 id="hero-title" class="text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl xl:text-7xl">
          <MotionSplitText text="We bend light" class="block" />
          <!-- Not split: .text-prism needs one unbroken text run (see CLAUDE.md). -->
          <MotionReveal as="span" :delay="0.35" :y="20" class="block">
            <span class="text-prism">into ideas.</span>
          </MotionReveal>
        </h1>
        <MotionReveal :delay="0.55">
          <p class="mt-6 max-w-xl text-lg text-zinc-600 sm:text-xl dark:text-zinc-400">
            Prism is a tiny studio with a big box of crayons. We design brands, websites and motion
            systems that make people stop scrolling and start smiling.
          </p>
        </MotionReveal>
        <MotionReveal :delay="0.7" class="mt-10 flex flex-wrap items-center gap-4">
          <UiMagneticButton>
            <UiBaseButton to="/contact" size="lg" icon-right="lucide:arrow-right">Start a project</UiBaseButton>
          </UiMagneticButton>
          <UiBaseButton to="/gallery" size="lg" variant="outline" color="grape">See our work</UiBaseButton>
        </MotionReveal>
        <MotionReveal :delay="0.85" class="mt-10 flex items-center gap-4">
          <div class="flex -space-x-3">
            <NuxtImg
              v-for="seed in avatars"
              :key="seed"
              format="webp"
              :src="picsum(seed, 96, 96)"
              alt=""
              width="40"
              height="40"
              class="size-10 rounded-full object-cover ring-2 ring-white dark:ring-zinc-950"
            />
          </div>
          <p class="text-sm text-zinc-600 dark:text-zinc-400">
            <span class="font-semibold text-zinc-900 dark:text-white">42 happy teams</span>
            and counting
          </p>
        </MotionReveal>
      </div>

      <!-- Image column: the photo drifts slower than the page; the floating chips drift faster. -->
      <MotionReveal :delay="0.2" :y="40" class="relative">
        <div class="relative h-[22rem] overflow-hidden rounded-[2.5rem] shadow-2xl shadow-grape/20 sm:h-[30rem]">
          <MotionParallax :offset="60">
            <NuxtImg
              format="webp"
              :src="picsum('prism-hero', 1200, 1400)"
              alt="Colorful abstract scene full of light"
              width="1200"
              height="1400"
              sizes="100vw lg:600px"
              loading="eager"
              fetchpriority="high"
              preload
              class="-mt-[60px] h-[calc(22rem+120px)] w-full object-cover sm:h-[calc(30rem+120px)]"
            />
          </MotionParallax>
          <div class="absolute inset-0 bg-linear-to-t from-grape/40 via-transparent to-transparent" aria-hidden="true" />
        </div>
        <div class="absolute -bottom-6 -left-2 sm:-left-8">
          <MotionParallax :offset="-40">
            <div class="flex items-center gap-3 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur dark:bg-zinc-900/90">
              <span class="grid size-10 place-items-center rounded-xl bg-mint/15 text-mint-ink dark:text-mint-glow">
                <Icon name="lucide:sparkles" class="size-5" aria-hidden="true" />
              </span>
              <div>
                <p class="text-sm font-semibold">128+ projects</p>
                <p class="text-xs text-zinc-600 dark:text-zinc-400">shipped with sparkle</p>
              </div>
            </div>
          </MotionParallax>
        </div>
        <!-- Inside the photo on small screens (above it, it would collide with the text above). -->
        <div class="absolute top-6 right-4 lg:-top-5 lg:-right-4">
          <MotionParallax :offset="-50">
            <UiBadge color="sun" variant="solid" icon="lucide:star" class="px-4 py-2 text-sm shadow-lg">
              Award-winning glow
            </UiBadge>
          </MotionParallax>
        </div>
      </MotionReveal>
    </div>
  </section>
</template>
