<script setup lang="ts">
import { Motion, useReducedMotion } from "motion-v";

defineProps<{
  /** Accessible label for the flip button, e.g. "Show Iris's bio". */
  flipLabel: string;
}>();

defineSlots<{ front(): unknown; back(): unknown }>();

// Mouse: flips on hover. Touch and keyboard: the full-card button toggles it.
// The hidden face is `inert`, so it can't be focused or read while it faces away.
const hovered = ref(false);
const toggled = ref(false);
const flipped = computed(() => hovered.value || toggled.value);

const frontButton = ref<HTMLButtonElement | null>(null);
const backButton = ref<HTMLButtonElement | null>(null);

function onPointerEnter(e: PointerEvent) {
  if (e.pointerType === "mouse") hovered.value = true;
}

async function setToggled(value: boolean) {
  toggled.value = value;
  if (!value) hovered.value = false;
  await nextTick();
  // Keep keyboard focus on the visible face.
  (value ? backButton : frontButton).value?.focus();
}

const reduceMotion = useReducedMotion();
const transition = computed(() =>
  reduceMotion.value ? { duration: 0 } : { type: "spring" as const, stiffness: 180, damping: 22 },
);
</script>

<template>
  <div class="perspective-[1200px]" @pointerenter="onPointerEnter" @pointerleave="hovered = false">
    <Motion
      as="div"
      class="relative h-full w-full transform-3d"
      :initial="false"
      :animate="{ rotateY: flipped ? 180 : 0 }"
      :transition="transition"
    >
      <!-- Front: in normal flow so it sets the card's size. -->
      <div class="h-full backface-hidden" :inert="flipped">
        <slot name="front" />
        <button
          ref="frontButton"
          type="button"
          class="absolute inset-0 rounded-3xl"
          :aria-label="flipLabel"
          :aria-expanded="flipped"
          @click="setToggled(true)"
        />
      </div>
      <!-- Back: stacked on top and pre-rotated, so it faces the viewer once the card turns. -->
      <div class="absolute inset-0 rotate-y-180 backface-hidden" :inert="!flipped">
        <slot name="back" />
        <button
          ref="backButton"
          type="button"
          class="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/35"
          aria-label="Flip back"
          @click="setToggled(false)"
        >
          <Icon name="lucide:rotate-ccw" class="size-4" />
        </button>
      </div>
    </Motion>
  </div>
</template>
