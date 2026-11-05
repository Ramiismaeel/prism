<script setup lang="ts">
useSeoMeta({
  title: "About",
  description: "Meet Prism: our story, the team of light benders and the values that keep us colorful.",
});
</script>

<template>
  <div>
    <SectionsPageHeader
      eyebrow="About"
      title="Meet the prism"
      lead="We're a small, curious studio that believes color, motion and kindness make the web a brighter place. Here's how we got here and who we are."
    >
      <template #aside>
        <UiIllustration
          name="about"
          alt="A small team high-fiving around a glowing prism"
          :width="520"
          :height="400"
          eager
          class="mx-auto w-full max-w-lg"
        />
      </template>
    </SectionsPageHeader>
    <SectionsTimeline />
    <SectionsTeamGrid />
    <SectionsValuesGrid />
  </div>
</template>
