<script setup lang="ts">
import { picsum } from "~/utils/picsum";
</script>

<template>
  <!-- One animation per tile; each tile's info tooltip explains the technique. -->
  <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    <PlaygroundTileDrag />
    <PlaygroundTileSpring />
    <PlaygroundTile title="Magnetic button" how="The button follows your cursor inside an invisible field, smoothed by springs. Mouse only, and off with reduced motion.">
      <UiMagneticButton :strength="0.5">
        <UiBaseButton size="lg" icon="lucide:magnet">Come closer</UiBaseButton>
      </UiMagneticButton>
    </PlaygroundTile>
    <PlaygroundTile title="Tilt card" how="Pointer position maps to rotateX/rotateY with springs, plus a glare that follows the cursor (useMotionTemplate).">
      <UiTiltCard class="w-full max-w-56">
        <NuxtImg
          format="webp"
          :src="picsum('tilt-tile', 600, 600)"
          alt=""
          width="300"
          height="300"
          loading="lazy"
          class="aspect-square w-full rounded-3xl object-cover"
        />
      </UiTiltCard>
    </PlaygroundTile>
    <PlaygroundTileMorph />
    <PlaygroundTileConfetti />
    <PlaygroundTileScrollRotate />
    <PlaygroundTileToast />
  </div>
</template>
