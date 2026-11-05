<script setup lang="ts">
import { animate, useReducedMotion } from "motion-v";

const props = withDefaults(
  defineProps<{
    /** Seconds for one full loop. */
    duration?: number;
    /** Scroll left-to-right instead. */
    reverse?: boolean;
    /** Gap between items in px. */
    gap?: number;
    /** Ease to a stop on hover/focus (WCAG 2.2.2: moving content can be paused). */
    pauseOnHover?: boolean;
  }>(),
  { duration: 30, reverse: false, gap: 48, pauseOnHover: true },
);

type Controls = ReturnType<typeof animate>;

const track = ref<HTMLElement | null>(null);
let loop: Controls | undefined;
let easing: Controls | undefined;
const reduceMotion = useReducedMotion();

function stop() {
  easing?.stop();
  loop?.stop();
  loop = undefined;
  if (track.value) track.value.style.transform = "";
}

// The track holds two identical copies, so sliding by -50% loops seamlessly.
function start() {
  stop();
  if (!track.value || reduceMotion.value) return;
  loop = animate(
    track.value,
    { x: props.reverse ? ["-50%", "0%"] : ["0%", "-50%"] },
    { duration: props.duration, ease: "linear", repeat: Infinity },
  );
}

// Tween the playback speed instead of pausing abruptly.
function setSpeed(target: number) {
  if (!loop || !props.pauseOnHover) return;
  const controls = loop;
  easing?.stop();
  // Never exactly 0: at speed 0 motion "holds" the animation, and raising the speed again
  // either leaves it frozen or (after play()) jumps it back to the loop start.
  // 0.001 is visually stopped (a few px per minute).
  easing = animate(controls.speed, Math.max(target, 0.001), {
    duration: 0.6,
    onUpdate: (v) => (controls.speed = v),
  });
}

onMounted(() => watch(reduceMotion, start, { immediate: true }));
onBeforeUnmount(stop);

const copyStyle = computed(() => ({ gap: `${props.gap}px`, paddingRight: `${props.gap}px` }));
</script>

<template>
  <div
    class="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
    @pointerenter="setSpeed(0)"
    @pointerleave="setSpeed(1)"
    @focusin="setSpeed(0)"
    @focusout="setSpeed(1)"
  >
    <div ref="track" class="flex w-max">
      <div class="flex shrink-0 items-center" :style="copyStyle">
        <slot />
      </div>
      <!-- Visual duplicate for the seamless loop: hidden from assistive tech and keyboard. -->
      <div class="flex shrink-0 items-center" :style="copyStyle" aria-hidden="true" inert>
        <slot />
      </div>
    </div>
  </div>
</template>
