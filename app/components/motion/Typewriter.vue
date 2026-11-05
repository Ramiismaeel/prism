<script setup lang="ts">
import { Motion, animate, useReducedMotion } from "motion-v";

const props = withDefaults(
  defineProps<{
    text: string;
    /** Seconds before typing starts. */
    delay?: number;
    /** Seconds per character. */
    speed?: number;
  }>(),
  { delay: 0, speed: 0.03 },
);

const emit = defineEmits<{ done: [] }>();

const reduceMotion = useReducedMotion();
const shown = ref(0);
const typing = computed(() => shown.value < props.text.length);
let controls: ReturnType<typeof animate> | undefined;

function start() {
  controls?.stop();
  if (reduceMotion.value) {
    shown.value = props.text.length;
    emit("done");
    return;
  }
  shown.value = 0;
  controls = animate(0, props.text.length, {
    duration: props.text.length * props.speed,
    delay: props.delay,
    ease: "linear",
    onUpdate: (v) => (shown.value = Math.round(v)),
    onComplete: () => emit("done"),
  });
}

onMounted(() => watch(() => props.text, start, { immediate: true }));
onBeforeUnmount(() => controls?.stop());
</script>

<template>
  <span>
    <!-- Screen readers get the whole text at once; the typing is visual only. -->
    <span class="sr-only">{{ text }}</span>
    <span aria-hidden="true">
      {{ text.slice(0, shown) }}<Motion
        v-if="typing || shown === 0"
        as="span"
        class="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.15em] bg-current"
        :animate="{ opacity: [1, 0, 1] }"
        :transition="{ duration: 0.9, repeat: Infinity }"
      />
    </span>
  </span>
</template>
