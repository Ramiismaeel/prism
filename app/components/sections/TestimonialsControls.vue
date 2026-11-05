<script setup lang="ts">
import { Motion } from "motion-v";

defineProps<{
  count: number;
  index: number;
  playing: boolean;
  /** False for reduced-motion users: auto-play is off, so hide the pause button. */
  canAutoplay: boolean;
}>();

defineEmits<{ prev: []; next: []; go: [index: number]; togglePlay: [] }>();

const arrowClass =
  "grid size-11 place-items-center rounded-full border border-zinc-300 text-zinc-700 transition-colors hover:border-grape hover:bg-grape hover:text-white dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-grape dark:hover:bg-grape dark:hover:text-white";
</script>

<template>
  <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
    <button type="button" :class="arrowClass" aria-label="Previous testimonial" @click="$emit('prev')">
      <Icon name="lucide:chevron-left" class="size-5" />
    </button>

    <div class="flex items-center gap-1">
      <!-- 24px hit area around each small dot. -->
      <button
        v-for="i in count"
        :key="i"
        type="button"
        class="grid h-6 min-w-6 place-items-center px-1"
        :aria-label="`Show testimonial ${i}`"
        :aria-current="i - 1 === index ? 'true' : undefined"
        @click="$emit('go', i - 1)"
      >
        <Motion
          as="span"
          class="block h-2.5 rounded-full"
          :class="i - 1 === index ? 'bg-grape' : 'bg-zinc-300 dark:bg-zinc-700'"
          :initial="false"
          :animate="{ width: i - 1 === index ? 28 : 10 }"
          :transition="{ type: 'spring', stiffness: 400, damping: 30 }"
        />
      </button>
    </div>

    <button type="button" :class="arrowClass" aria-label="Next testimonial" @click="$emit('next')">
      <Icon name="lucide:chevron-right" class="size-5" />
    </button>

    <button
      v-if="canAutoplay"
      type="button"
      :class="arrowClass"
      :aria-label="playing ? 'Pause auto-play' : 'Start auto-play'"
      @click="$emit('togglePlay')"
    >
      <Icon :name="playing ? 'lucide:pause' : 'lucide:play'" class="size-4" />
    </button>
  </div>
</template>
