<script setup lang="ts">
import { clients } from "~/data/clients";
</script>

<template>
  <section class="border-y border-zinc-200/70 py-10 dark:border-zinc-800/70" aria-labelledby="clients-title">
    <h2
      id="clients-title"
      class="mb-6 text-center font-body text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400"
    >
      Trusted by teams who love color
    </h2>
    <UiMarquee :duration="40" :gap="64">
      <span
        v-for="c in clients"
        :key="c.name"
        class="inline-flex items-center gap-2 font-display text-2xl font-bold text-zinc-400 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white"
      >
        <Icon :name="c.icon" class="size-7" aria-hidden="true" />{{ c.name }}
      </span>
    </UiMarquee>
  </section>
</template>
