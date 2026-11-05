<script setup lang="ts">
import { faq } from "~/data/faq";
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="faq-title">
    <div class="mb-10 text-center">
      <UiBadge color="sky" dot caps>FAQ</UiBadge>
      <h2 id="faq-title" class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Questions, answered</h2>
    </div>
    <MotionReveal>
      <UiAccordion :items="faq" :default-open="[faq[0]!.id]" />
    </MotionReveal>
  </section>
</template>
