<script setup lang="ts">
import { animate, useInView, useReducedMotion } from "motion-v";

const props = withDefaults(
  defineProps<{
    to: number;
    from?: number;
    /** Seconds. */
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    once?: boolean;
  }>(),
  { from: 0, duration: 2, decimals: 0, prefix: "", suffix: "", once: true },
);

const el = ref<HTMLElement | null>(null);
const inView = useInView(el, { once: props.once, amount: 0.6 });
const reduceMotion = useReducedMotion();

const formatter = computed(
  () =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: props.decimals,
      maximumFractionDigits: props.decimals,
    }),
);
const format = (n: number) => `${props.prefix}${formatter.value.format(n)}${props.suffix}`;

// Starts at `from` on both server and client, so hydration matches.
const display = ref(format(props.from));
let controls: { stop: () => void } | undefined;

watch(inView, (visible) => {
  controls?.stop();
  if (!visible) {
    if (!props.once) display.value = format(props.from);
    return;
  }
  if (reduceMotion.value) {
    display.value = format(props.to);
    return;
  }
  controls = animate(props.from, props.to, {
    duration: props.duration,
    ease: [0.16, 1, 0.3, 1], // fast start, gentle landing
    onUpdate: (v) => (display.value = format(v)),
  });
});

onBeforeUnmount(() => controls?.stop());
</script>

<template>
  <span ref="el" class="tabular-nums">
    <span aria-hidden="true">{{ display }}</span>
    <span class="sr-only">{{ format(to) }}</span>
  </span>
</template>
