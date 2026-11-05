<script setup lang="ts">
import { AnimatePresence, Motion, useReducedMotion } from "motion-v";

interface Piece { id: number; x: number; y: number; rotate: number; color: string; round: boolean }

const COLORS = ["#7c3aed", "#f43f5e", "#f59e0b", "#10b981", "#0ea5e9"];
const pieces = ref<Piece[]>([]);
const reduceMotion = useReducedMotion();
const announcement = ref("");
let nextId = 0;

function celebrate() {
  // Reduced motion: a calm in-place sparkle instead of flying confetti.
  const spread = reduceMotion.value ? 0 : 1;
  const burst = Array.from({ length: 36 }, (): Piece => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 90;
    return {
      id: nextId++,
      x: Math.cos(angle) * distance * spread,
      y: (Math.sin(angle) * distance - 40) * spread,
      rotate: (Math.random() - 0.5) * 720 * spread,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
      round: Math.random() > 0.5,
    };
  });
  pieces.value = [...pieces.value, ...burst];
  announcement.value = "Hooray!";
  const ids = new Set(burst.map((p) => p.id));
  setTimeout(() => (pieces.value = pieces.value.filter((p) => !ids.has(p.id))), 1200);
}
</script>

<template>
  <PlaygroundTile title="Confetti" how="Each click spawns 36 pieces with random angles, distances and spins; AnimatePresence fades them out as they're removed.">
    <div class="relative grid place-items-center">
      <UiBaseButton color="sun" size="lg" icon="lucide:party-popper" @click="celebrate">Celebrate!</UiBaseButton>
      <div class="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
        <AnimatePresence>
          <Motion
            v-for="p in pieces"
            :key="p.id"
            class="absolute size-2.5"
            :class="p.round ? 'rounded-full' : 'rounded-sm'"
            :style="{ backgroundColor: p.color }"
            :initial="{ x: 0, y: 0, opacity: 1, scale: 0.6 }"
            :animate="{ x: p.x, y: [0, p.y, p.y + 60], rotate: p.rotate, scale: 1 }"
            :exit="{ opacity: 0, transition: { duration: 0.25 } }"
            :transition="{ duration: reduceMotion ? 0.3 : 1.1, ease: 'easeOut' }"
          />
        </AnimatePresence>
      </div>
      <p class="sr-only" aria-live="polite">{{ announcement }}</p>
    </div>
  </PlaygroundTile>
</template>
