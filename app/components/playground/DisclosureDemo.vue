<script setup lang="ts">
const tabs = [
  { id: "design", label: "Spectrum Design", icon: "lucide:palette" },
  { id: "strategy", label: "Refraction Strategy", icon: "lucide:compass" },
  { id: "motion", label: "Motion Lab", icon: "lucide:wand-sparkles" },
];
const activeTab = ref("design");

const TAB_COPY: Record<string, string> = {
  design: "Interfaces that split one idea into every color it contains. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  strategy: "We find the angle where your story catches the light. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  motion: "Springs, parallax and tiny surprises that make a page feel alive. Ut enim ad minim veniam, quis nostrud exercitation.",
};

const faq = [
  { id: "what", title: "What does Prism actually do?", content: "We design brands, websites and motion systems. Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: "how-long", title: "How long does a project take?", content: "Most projects shine within 4–8 weeks. Sed do eiusmod tempor incididunt ut labore." },
  { id: "colors", title: "Can I pick my own colors?", content: "Of course. We'll just gently suggest a few more. Ut enim ad minim veniam, quis nostrud." },
  { id: "dark", title: "Does everything work in dark mode?", content: "Every component ships in light and dark from day one." },
];
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <PlaygroundDemoBlock title="Tabs" description="Sliding indicator; arrow keys, Home and End move between tabs.">
      <UiTabs v-model="activeTab" :tabs="tabs" label="Services">
        <template #default="{ tab }">
          <div class="rounded-2xl bg-white p-5 shadow-sm dark:bg-zinc-800">
            <h4 class="flex items-center gap-2 font-semibold">
              <Icon :name="tab.icon" class="size-5 text-grape-ink dark:text-grape-glow" aria-hidden="true" />
              {{ tab.label }}
            </h4>
            <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{{ TAB_COPY[tab.id] }}</p>
          </div>
        </template>
      </UiTabs>
    </PlaygroundDemoBlock>

    <PlaygroundDemoBlock title="Accordion" description="Smooth height animation; arrow keys move between questions.">
      <UiAccordion :items="faq" :default-open="['what']" :heading-level="4" />
    </PlaygroundDemoBlock>
  </div>
</template>
