<script setup lang="ts">
import { stats } from "~/data/stats";
</script>

<template>
  <section class="px-4 sm:px-6 lg:px-8" aria-labelledby="stats-title">
    <!-- Darker grape → coral shades keep white text above 4.5:1 across the whole gradient. -->
    <div
      class="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-linear-to-r from-grape-ink via-grape to-coral-ink px-6 py-14 text-white shadow-2xl shadow-grape/25 sm:px-12"
    >
      <MotionGradientBlob color="sky" class="-top-24 right-1/4 -z-10 size-72 opacity-40! dark:opacity-40!" :drift="60" />
      <MotionGradientBlob color="sun" class="-bottom-28 -left-10 -z-10 size-72 opacity-30! dark:opacity-30!" :delay="3" />
      <h2 id="stats-title" class="sr-only">Prism in numbers</h2>
      <dl class="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        <div v-for="s in stats" :key="s.label" class="flex flex-col text-center">
          <dt class="order-last mt-2 text-sm font-medium text-white">{{ s.label }}</dt>
          <dd class="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            <MotionCountUp :to="s.value" :prefix="s.prefix" :suffix="s.suffix" :decimals="s.decimals" />
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
