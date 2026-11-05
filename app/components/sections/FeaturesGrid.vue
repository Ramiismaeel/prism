<script setup lang="ts">
import { features } from "~/data/features";
import { COLOR_CLASSES } from "~/utils/themeColors";
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="features-title">
    <div class="mx-auto mb-14 max-w-2xl text-center">
      <MotionReveal :y="12">
        <UiBadge color="coral" dot caps>What we do</UiBadge>
      </MotionReveal>
      <MotionSplitText
        id="features-title"
        as="h2"
        text="Six ways we bend light"
        class="mt-4 block text-4xl font-bold tracking-tight sm:text-5xl"
      />
      <MotionReveal :delay="0.3">
        <p class="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          One studio, a full spectrum of skills. Pick a color or take the whole rainbow.
        </p>
      </MotionReveal>
    </div>

    <MotionStaggerList
      v-slot="{ item }"
      :items="features"
      :item-key="(f) => f.title"
      :stagger="0.1"
      class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      item-class="h-full"
    >
      <UiCard as="article" interactive :accent="item.color" class="h-full">
        <span
          class="mb-5 grid size-12 place-items-center rounded-2xl"
          :class="COLOR_CLASSES[item.color].soft"
        >
          <Icon :name="item.icon" class="size-6" aria-hidden="true" />
        </span>
        <h3 class="text-xl font-semibold">{{ item.title }}</h3>
        <p class="mt-2 text-zinc-600 dark:text-zinc-400">{{ item.description }}</p>
      </UiCard>
    </MotionStaggerList>
  </section>
</template>
