<script setup lang="ts">
import { Motion } from "motion-v";

const area = ref<HTMLElement | null>(null);
</script>

<template>
  <PlaygroundTile title="Drag me" how="drag + dragConstraints: the box can't leave its dashed area, and dragElastic lets it stretch a little past the edge.">
    <div ref="area" class="relative grid h-44 w-full place-items-center rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700">
      <Motion
        drag
        :drag-constraints="area ?? undefined"
        :drag-elastic="0.25"
        :while-drag="{ scale: 1.15, rotate: 8 }"
        :while-hover="{ scale: 1.05 }"
        class="grid size-16 cursor-grab touch-none place-items-center rounded-2xl bg-linear-135 from-grape to-coral text-white shadow-lg active:cursor-grabbing"
        aria-hidden="true"
      >
        <Icon name="lucide:grip" class="size-6" />
      </Motion>
    </div>
  </PlaygroundTile>
</template>
