<script setup lang="ts">
import { plans } from "~/data/pricing";

const yearly = ref(false);
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="pricing-title">
    <div class="mb-12 text-center">
      <UiBadge color="sun" dot caps>Pricing</UiBadge>
      <h2 id="pricing-title" class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Simple, sparkly pricing</h2>
      <div class="mt-8 flex items-center justify-center gap-3 text-sm font-medium">
        <span :class="yearly ? 'text-zinc-500 dark:text-zinc-400' : ''" aria-hidden="true">Monthly</span>
        <UiToggle v-model="yearly" color="grape" sr-label="Bill yearly (save 20%)" />
        <span :class="yearly ? '' : 'text-zinc-500 dark:text-zinc-400'" aria-hidden="true">Yearly</span>
        <UiBadge color="mint">Save 20%</UiBadge>
      </div>
      <!-- Announce the switch once, rather than every price changing. -->
      <p class="sr-only" aria-live="polite">{{ yearly ? "Showing yearly prices" : "Showing monthly prices" }}</p>
    </div>

    <MotionStaggerList
      v-slot="{ item }"
      :items="plans"
      :item-key="(p) => p.id"
      :stagger="0.12"
      class="grid items-center gap-8 lg:grid-cols-3"
      item-class="h-full"
    >
      <SectionsPricingCard :plan="item" :yearly="yearly" />
    </MotionStaggerList>
  </section>
</template>
