<script setup lang="ts">
import type { ComponentSpec } from "#shared/utils/componentSpec";
import { COLOR_CLASSES, type ThemeColor } from "~/utils/themeColors";

// Renders an AI recipe with Prism's real components. Only known types and props reach here
// (validated by Zod on the server), so no generated markup or code is ever executed.
const props = defineProps<{ spec: ComponentSpec }>();

const checked = ref(props.spec.type === "toggle" ? props.spec.checked : false);
const modalOpen = ref(false);
const { toast } = useToast();

const icon = (name?: string) => (name ? `lucide:${name}` : undefined);
const MARQUEE_SECONDS = { slow: 40, normal: 25, fast: 12 } as const;
// Full class names so Tailwind generates them.
const FROM: Record<ThemeColor, string> = { grape: "from-grape", coral: "from-coral", sun: "from-sun", mint: "from-mint", sky: "from-sky" };
const TO: Record<ThemeColor, string> = { grape: "to-grape", coral: "to-coral", sun: "to-sun", mint: "to-mint", sky: "to-sky" };
</script>

<template>
  <div class="grid w-full place-items-center">
    <template v-if="spec.type === 'button'">
      <UiMagneticButton v-if="spec.magnetic">
        <UiBaseButton :variant="spec.variant" :color="spec.color" :size="spec.size" :icon="icon(spec.icon)">{{ spec.label }}</UiBaseButton>
      </UiMagneticButton>
      <UiBaseButton v-else :variant="spec.variant" :color="spec.color" :size="spec.size" :icon="icon(spec.icon)">{{ spec.label }}</UiBaseButton>
    </template>

    <UiToggle v-else-if="spec.type === 'toggle'" v-model="checked" :label="spec.label" :color="spec.color" />

    <UiBadge v-else-if="spec.type === 'badge'" :color="spec.color" :variant="spec.variant" :dot="spec.dot" :icon="icon(spec.icon)" class="text-sm">
      {{ spec.label }}
    </UiBadge>

    <UiCard v-else-if="spec.type === 'card'" :accent="spec.accent" :interactive="spec.interactive" class="w-full max-w-sm">
      <span v-if="spec.icon" class="mb-4 grid size-11 place-items-center rounded-2xl" :class="COLOR_CLASSES[spec.accent].soft">
        <Icon :name="icon(spec.icon)!" class="size-5" aria-hidden="true" />
      </span>
      <h4 class="text-lg font-semibold">{{ spec.title }}</h4>
      <p class="mt-2 text-zinc-600 dark:text-zinc-400">{{ spec.body }}</p>
    </UiCard>

    <UiTiltCard v-else-if="spec.type === 'tilt-card'" class="w-full max-w-xs">
      <div class="relative flex h-52 flex-col justify-end overflow-hidden rounded-3xl bg-linear-135 p-5 text-white" :class="[FROM[spec.from], TO[spec.to]]">
        <div class="absolute inset-0 bg-linear-to-t from-zinc-950/60 to-transparent" aria-hidden="true" />
        <Icon v-if="spec.icon" :name="icon(spec.icon)!" class="relative mb-auto size-7" aria-hidden="true" />
        <p class="relative font-display text-xl font-bold">{{ spec.title }}</p>
        <p class="relative text-sm text-white/90">{{ spec.subtitle }}</p>
      </div>
    </UiTiltCard>

    <UiTooltip v-else-if="spec.type === 'tooltip'" :text="spec.text" :placement="spec.placement">
      <UiBaseButton variant="outline">{{ spec.buttonLabel }}</UiBaseButton>
    </UiTooltip>

    <UiTabs
      v-else-if="spec.type === 'tabs'"
      :tabs="spec.tabs.map((t, i) => ({ id: `tab-${i}`, label: t.label }))"
      label="Generated tabs"
      class="w-full"
    >
      <template #default="{ tab }">
        <p class="rounded-2xl bg-white p-5 text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-300">
          {{ spec.tabs[Number(tab.id.slice(4))]?.content }}
        </p>
      </template>
    </UiTabs>

    <UiAccordion
      v-else-if="spec.type === 'accordion'"
      :items="spec.items.map((it, i) => ({ id: `item-${i}`, title: it.title, content: it.content }))"
      :default-open="['item-0']"
      :heading-level="4"
      class="w-full"
    />

    <UiMarquee v-else-if="spec.type === 'marquee'" :duration="MARQUEE_SECONDS[spec.speed]" class="w-full">
      <span v-for="item in spec.items" :key="item" class="font-display text-2xl font-bold text-zinc-500 dark:text-zinc-300">{{ item }}</span>
    </UiMarquee>

    <div v-else-if="spec.type === 'stat'" class="text-center">
      <p class="font-display text-5xl font-bold tracking-tight">
        <MotionCountUp :to="spec.value" :prefix="spec.prefix" :suffix="spec.suffix" :decimals="spec.decimals" />
      </p>
      <p class="mt-1 text-zinc-600 dark:text-zinc-400">{{ spec.label }}</p>
    </div>

    <MotionSplitText
      v-else-if="spec.type === 'split-text'"
      as="p"
      :text="spec.text"
      :by="spec.by"
      class="block text-center font-display text-4xl font-bold tracking-tight"
      :class="COLOR_CLASSES[spec.color].text"
    />

    <template v-else-if="spec.type === 'modal'">
      <UiBaseButton :color="spec.color" @click="modalOpen = true">{{ spec.buttonLabel }}</UiBaseButton>
      <UiModal v-model:open="modalOpen" :title="spec.title">
        <p class="text-zinc-600 dark:text-zinc-400">{{ spec.body }}</p>
      </UiModal>
    </template>

    <UiBaseButton
      v-else-if="spec.type === 'toast'"
      variant="outline"
      @click="toast({ type: spec.toastType, title: spec.title, description: spec.description })"
    >
      {{ spec.buttonLabel }}
    </UiBaseButton>
  </div>
</template>
