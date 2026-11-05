<script setup lang="ts">
const SITE_TITLE = "Prism — Creative Playground";

useHead({
  titleTemplate: (title) =>
    title && title !== SITE_TITLE ? `${title} · Prism` : SITE_TITLE,
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
