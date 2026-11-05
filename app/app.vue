<script setup lang="ts">
import { MotionConfig } from "motion-v";

const SITE_TITLE = "Prism — Creative Playground";

useHead({
  titleTemplate: (title) =>
    title && title !== SITE_TITLE ? `${title} · Prism` : SITE_TITLE,
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <!-- Safety net: Motion skips transform/layout animations for users who prefer reduced motion. -->
  <MotionConfig reduced-motion="user">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </MotionConfig>
</template>
