<script setup lang="ts">
import { AnimatePresence, Motion, useReducedMotion } from "motion-v";
import type { Plan } from "~/data/pricing";

const props = defineProps<{ plan: Plan; yearly: boolean }>();

const price = computed(() => (props.yearly ? props.plan.yearly : props.plan.monthly));

const reduceMotion = useReducedMotion();
// New price rolls in from below while the old one leaves upward.
const roll = computed(() =>
  reduceMotion.value ? { duration: 0 } : { type: "spring" as const, stiffness: 400, damping: 30 },
);
</script>

<template>
  <!-- The highlighted plan gets a 2px gradient border: a gradient shell around a solid card. -->
  <div
    class="h-full rounded-[2rem]"
    :class="
      plan.highlighted
        ? 'bg-linear-to-br from-grape via-coral to-sun p-[2px] shadow-2xl shadow-grape/25 lg:scale-105'
        : 'border border-zinc-200 dark:border-zinc-800'
    "
  >
    <article
      class="relative flex h-full flex-col rounded-[calc(2rem-2px)] bg-white p-8 dark:bg-zinc-900"
      :aria-labelledby="`plan-${plan.id}`"
    >
      <UiBadge v-if="plan.highlighted" color="grape" variant="solid" icon="lucide:star" class="absolute -top-3 left-8">
        Most popular
      </UiBadge>
      <h3 :id="`plan-${plan.id}`" class="text-2xl font-bold">{{ plan.name }}</h3>
      <p class="mt-1 text-zinc-600 dark:text-zinc-400">{{ plan.tagline }}</p>

      <p class="mt-6 flex items-end gap-1">
        <span class="font-display text-5xl font-bold tracking-tight">$</span>
        <span class="relative inline-flex h-[3.25rem] overflow-hidden">
          <AnimatePresence mode="popLayout" :initial="false">
            <Motion
              :key="price"
              as="span"
              class="font-display text-5xl leading-none font-bold tracking-tight tabular-nums"
              :initial="{ y: '100%', opacity: 0 }"
              :animate="{ y: '0%', opacity: 1 }"
              :exit="{ y: '-100%', opacity: 0 }"
              :transition="roll"
            >
              {{ price }}
            </Motion>
          </AnimatePresence>
        </span>
        <span class="mb-1 text-zinc-600 dark:text-zinc-400">/ month</span>
      </p>
      <p class="mt-1 h-5 text-sm text-zinc-600 dark:text-zinc-400">
        {{ yearly ? `$${(plan.yearly * 12).toLocaleString("en-US")} billed yearly` : "billed monthly" }}
      </p>

      <ul class="mt-8 flex-1 space-y-3">
        <li v-for="f in plan.features" :key="f" class="flex items-start gap-3">
          <Icon name="lucide:check" class="mt-0.5 size-5 shrink-0 text-mint-ink dark:text-mint-glow" aria-hidden="true" />
          <span>{{ f }}</span>
        </li>
      </ul>

      <UiBaseButton
        to="/contact"
        class="mt-8"
        block
        :variant="plan.highlighted ? 'solid' : 'outline'"
      >
        Choose {{ plan.name }}
      </UiBaseButton>
    </article>
  </div>
</template>
