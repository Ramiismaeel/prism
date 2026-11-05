<script setup lang="ts">
import { values } from "~/data/about";
import { COLOR_CLASSES } from "~/utils/themeColors";
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8" aria-labelledby="values-title">
    <div class="mb-14 text-center">
      <UiBadge color="mint" dot caps>What we believe</UiBadge>
      <h2 id="values-title" class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Our values</h2>
    </div>
    <MotionStaggerList
      v-slot="{ item }"
      :items="values"
      :item-key="(v) => v.title"
      :stagger="0.15"
      class="grid gap-6 md:grid-cols-3"
      item-class="h-full"
    >
      <UiCard interactive class="h-full text-center">
        <span class="mx-auto mb-5 grid size-14 place-items-center rounded-2xl" :class="COLOR_CLASSES[item.color].soft">
          <Icon :name="item.icon" class="size-7" aria-hidden="true" />
        </span>
        <h3 class="text-xl font-semibold">{{ item.title }}</h3>
        <p class="mt-2 text-zinc-600 dark:text-zinc-400">{{ item.text }}</p>
      </UiCard>
    </MotionStaggerList>
  </section>
</template>
