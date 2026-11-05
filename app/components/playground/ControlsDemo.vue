<script setup lang="ts">
import { THEME_COLORS } from "~/utils/themeColors";

const variants = ["solid", "outline", "ghost"] as const;
const loading = ref(false);
const notifications = ref(true);
const yearly = ref(false);

function fakeSave() {
  loading.value = true;
  setTimeout(() => (loading.value = false), 1800);
}

const tooltips = [
  { placement: "top", icon: "lucide:arrow-up", label: "Tooltip on top" },
  { placement: "right", icon: "lucide:arrow-right", label: "Tooltip on the right" },
  { placement: "bottom", icon: "lucide:arrow-down", label: "Tooltip on the bottom" },
  { placement: "left", icon: "lucide:arrow-left", label: "Tooltip on the left" },
] as const;
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <PlaygroundDemoBlock title="BaseButton" description="3 variants × 5 colors × 3 sizes, spring hover and tap." class="lg:col-span-2">
      <div class="space-y-4">
        <div v-for="v in variants" :key="v" class="flex flex-wrap items-center gap-3">
          <span class="w-16 text-xs font-medium text-zinc-500 dark:text-zinc-400">{{ v }}</span>
          <UiBaseButton v-for="c in THEME_COLORS" :key="c" :variant="v" :color="c">{{ c }}</UiBaseButton>
        </div>
        <div class="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <UiBaseButton size="sm" icon="lucide:sparkles">Small</UiBaseButton>
          <UiBaseButton icon="lucide:sparkles">Medium</UiBaseButton>
          <UiBaseButton size="lg" icon-right="lucide:arrow-right">Large</UiBaseButton>
          <UiBaseButton color="mint" :loading="loading" @click="fakeSave">
            {{ loading ? "Saving…" : "Save (loading)" }}
          </UiBaseButton>
          <UiBaseButton color="coral" disabled>Disabled</UiBaseButton>
          <UiBaseButton to="/about" variant="outline" color="sky" icon-right="lucide:arrow-up-right">
            Link to About
          </UiBaseButton>
        </div>
      </div>
    </PlaygroundDemoBlock>

    <PlaygroundDemoBlock title="MagneticButton" description="Gets pulled toward your cursor.">
      <div class="grid h-40 place-items-center">
        <UiMagneticButton>
          <UiBaseButton size="lg" icon="lucide:magnet">Come closer</UiBaseButton>
        </UiMagneticButton>
      </div>
    </PlaygroundDemoBlock>

    <PlaygroundDemoBlock title="Badge" description="Soft, solid and outline, with optional dot or icon.">
      <div class="space-y-3">
        <div class="flex flex-wrap gap-2">
          <UiBadge v-for="c in THEME_COLORS" :key="c" :color="c" dot>{{ c }}</UiBadge>
        </div>
        <div class="flex flex-wrap gap-2">
          <UiBadge v-for="c in THEME_COLORS" :key="c" :color="c" variant="solid">{{ c }}</UiBadge>
        </div>
        <div class="flex flex-wrap gap-2">
          <UiBadge v-for="c in THEME_COLORS" :key="c" :color="c" variant="outline">{{ c }}</UiBadge>
        </div>
        <div class="flex flex-wrap gap-2">
          <UiBadge color="sun" icon="lucide:star" caps>Featured</UiBadge>
          <UiBadge color="mint" icon="lucide:check" caps>Shipped</UiBadge>
        </div>
      </div>
    </PlaygroundDemoBlock>

    <PlaygroundDemoBlock title="Toggle" description="An accessible switch (role=&quot;switch&quot;) with a spring knob.">
      <div class="flex flex-col gap-4">
        <UiToggle v-model="notifications" label="Email me about new colors" />
        <UiToggle v-model="yearly" color="mint">
          Yearly billing <UiBadge color="mint" class="ml-1">-20%</UiBadge>
        </UiToggle>
        <UiToggle :model-value="true" disabled label="Locked on" />
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          State: notifications {{ notifications ? "on" : "off" }}, billing {{ yearly ? "yearly" : "monthly" }}
        </p>
      </div>
    </PlaygroundDemoBlock>

    <PlaygroundDemoBlock title="Tooltip" description="On hover and keyboard focus; ESC dismisses.">
      <div class="flex h-32 flex-wrap items-center justify-center gap-4">
        <UiTooltip v-for="t in tooltips" :key="t.placement" :text="t.label" :placement="t.placement">
          <button
            type="button"
            class="grid size-11 place-items-center rounded-full bg-white shadow-sm transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            :aria-label="`Show ${t.placement} tooltip`"
          >
            <Icon :name="t.icon" class="size-5" />
          </button>
        </UiTooltip>
      </div>
    </PlaygroundDemoBlock>
  </div>
</template>
