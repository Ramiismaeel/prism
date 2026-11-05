<script setup lang="ts">
import { services } from "~/data/services";

const active = ref(services[0]!.id);
const byId = computed(() => Object.fromEntries(services.map((s) => [s.id, s])));
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="services-title">
    <div class="mb-10 text-center">
      <UiBadge color="grape" dot caps>What we do</UiBadge>
      <h2 id="services-title" class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Pick a color</h2>
    </div>

    <UiTabs v-model="active" :tabs="services" label="Services" center>
      <template #default="{ tab }">
        <div
          class="grid items-center gap-10 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div>
            <h3 class="text-3xl font-bold tracking-tight">{{ byId[tab.id]!.title }}</h3>
            <p class="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{{ byId[tab.id]!.description }}</p>
            <ul class="mt-6 space-y-3">
              <li v-for="b in byId[tab.id]!.bullets" :key="b" class="flex items-center gap-3">
                <span class="grid size-6 place-items-center rounded-full bg-mint/15 text-mint-ink dark:text-mint-glow">
                  <Icon name="lucide:check" class="size-4" aria-hidden="true" />
                </span>
                {{ b }}
              </li>
            </ul>
            <UiBaseButton to="/contact" class="mt-8" icon-right="lucide:arrow-right">Start with {{ tab.label }}</UiBaseButton>
          </div>
          <UiIllustration
            :name="byId[tab.id]!.illustration"
            :alt="byId[tab.id]!.illustrationAlt"
            :width="480"
            :height="360"
            class="mx-auto w-full max-w-md"
          />
        </div>
      </template>
    </UiTabs>
  </section>
</template>
