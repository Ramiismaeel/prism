<script setup lang="ts">
useSeoMeta({
  title: "Services",
  description: "Design, strategy, branding and motion from Prism, with simple pricing and answers to common questions.",
});
</script>

<template>
  <div>
    <SectionsPageHeader
      eyebrow="Services"
      title="What we refract"
      lead="Design, strategy, branding and motion: one studio, split into every color. Pick one, or take the whole rainbow."
      color="coral"
    >
      <template #aside>
        <UiIllustration
          name="services"
          alt="A designer at work surrounded by floating color swatches"
          :width="520"
          :height="400"
          eager
          class="mx-auto w-full max-w-lg"
        />
      </template>
    </SectionsPageHeader>
    <SectionsServicesTabs />
    <SectionsPricingTable />
    <SectionsFaqSection />
    <SectionsCtaBand />
  </div>
</template>
