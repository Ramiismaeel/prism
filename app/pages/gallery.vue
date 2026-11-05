<script setup lang="ts">
useSeoMeta({
  title: "Gallery",
  description: "A wall of light: nature, city, people and abstract photography, filtered your way.",
});
</script>

<template>
  <div>
    <SectionsPageHeader
      eyebrow="Gallery"
      title="A wall of light"
      lead="Nature, city, people and abstract shots that inspire our palettes. Filter by mood, then click any photo to take a closer look."
      color="sun"
    />
    <SectionsGalleryGrid />
  </div>
</template>
