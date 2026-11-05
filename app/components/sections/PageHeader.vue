<script setup lang="ts">
import type { ThemeColor } from "~/utils/themeColors";

defineProps<{
  eyebrow: string;
  title: string;
  lead: string;
  color?: ThemeColor;
}>();
</script>

<template>
  <!-- Shared top-of-page header. Optional #aside slot (e.g. an illustration) slides in from the right. -->
  <section class="relative isolate overflow-hidden" aria-labelledby="page-title">
    <MotionGradientBlob :color="color ?? 'grape'" class="-top-32 -left-24 -z-10 size-96" />
    <MotionGradientBlob color="sky" class="-top-20 right-0 -z-10 size-80" :delay="3" :duration="18" />
    <div
      class="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-16 pb-16 sm:px-6 md:pt-24 lg:px-8"
      :class="$slots.aside && 'lg:grid-cols-[1.2fr_1fr]'"
    >
      <div>
        <MotionReveal :y="12">
          <UiBadge :color="color ?? 'grape'" dot caps class="mb-5">{{ eyebrow }}</UiBadge>
        </MotionReveal>
        <MotionSplitText
          id="page-title"
          as="h1"
          :text="title"
          class="block text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl"
        />
        <MotionReveal :delay="0.35">
          <p class="mt-6 max-w-xl text-lg text-zinc-600 sm:text-xl dark:text-zinc-400">{{ lead }}</p>
        </MotionReveal>
        <slot />
      </div>
      <MotionReveal v-if="$slots.aside" :x="80" :y="0" :delay="0.2" :amount="0.2">
        <slot name="aside" />
      </MotionReveal>
    </div>
  </section>
</template>
