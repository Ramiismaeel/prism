<script setup lang="ts" generic="T extends { id: string; label: string; icon?: string }">
import { AnimatePresence, Motion, useReducedMotion } from "motion-v";

const props = defineProps<{
  tabs: T[];
  /** Accessible name for the tab list. */
  label: string;
  /** Center the tab row (from md up; below that it spans the full width). */
  center?: boolean;
}>();

/** Active tab id; defaults to the first tab. */
const model = defineModel<string>();

defineSlots<
  Record<string, (props: { tab: T }) => unknown> & { default?: (props: { tab: T }) => unknown }
>();

const activeId = computed(() => model.value ?? props.tabs[0]?.id ?? "");
const activeIndex = computed(() => props.tabs.findIndex((t) => t.id === activeId.value));
const activeTab = computed(() => props.tabs[activeIndex.value] ?? props.tabs[0]!);

const uid = useId();
const tabId = (id: string) => `${uid}-tab-${id}`;
const panelId = (id: string) => `${uid}-panel-${id}`;

// +1 when moving right, -1 when moving left: the panels slide in that direction.
const direction = ref(1);

function select(index: number, focus = false) {
  const tab = props.tabs[index];
  if (!tab) return;
  direction.value = index >= activeIndex.value ? 1 : -1;
  model.value = tab.id;
  if (focus) document.getElementById(tabId(tab.id))?.focus();
}

// WAI-ARIA tabs pattern: arrows move between tabs (wrapping), Home/End jump, selection follows focus.
function onKeydown(e: KeyboardEvent, index: number) {
  const last = props.tabs.length - 1;
  const next = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[e.key];
  if (next === undefined) return;
  e.preventDefault();
  select(next, true);
}

const reduceMotion = useReducedMotion();
const indicatorSpring = computed(() =>
  reduceMotion.value ? { duration: 0 } : { type: "spring" as const, stiffness: 420, damping: 34 },
);
const panelTransition = computed(() => ({ duration: reduceMotion.value ? 0 : 0.25 }));
</script>

<template>
  <div>
    <div :class="center && 'md:text-center'">
      <!-- Below md, tabs with an icon show only the icon (the label stays as screen-reader text), so
           the row fits on one line and every tab is reachable. flex-wrap is only a safety net for
           icon-less tabs; rounded-3xl stays a full pill on a single row. -->
      <div
        role="tablist"
        :aria-label="label"
        class="flex w-full flex-wrap gap-1 rounded-3xl bg-zinc-100 p-1 md:inline-flex md:w-auto dark:bg-zinc-800/80"
        :class="center && 'justify-center'"
      >
        <button
          v-for="(tab, i) in tabs"
          :id="tabId(tab.id)"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="tab.id === activeId"
          :aria-controls="panelId(tab.id)"
          :tabindex="tab.id === activeId ? 0 : -1"
          class="relative grow rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors md:grow-0"
          :class="
            tab.id === activeId
              ? 'text-white'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
          "
          @click="select(i)"
          @keydown="onKeydown($event, i)"
        >
          <!-- One shared layoutId per Tabs instance: the pill slides between tabs. -->
          <Motion
            v-if="tab.id === activeId"
            :layout-id="`${uid}-indicator`"
            class="absolute inset-0 rounded-full bg-grape shadow-md shadow-grape/30"
            :transition="indicatorSpring"
          />
          <span class="relative inline-flex items-center gap-2">
            <Icon v-if="tab.icon" :name="tab.icon" class="size-5 md:size-4" aria-hidden="true" />
            <span :class="tab.icon && 'sr-only md:not-sr-only'">{{ tab.label }}</span>
          </span>
        </button>
      </div>
    </div>

    <AnimatePresence mode="wait" :initial="false">
      <Motion
        :id="panelId(activeId)"
        :key="activeId"
        as="div"
        role="tabpanel"
        :aria-labelledby="tabId(activeId)"
        tabindex="0"
        class="mt-6 rounded-2xl"
        :initial="{ opacity: 0, x: 24 * direction }"
        :animate="{ opacity: 1, x: 0 }"
        :exit="{ opacity: 0, x: -24 * direction }"
        :transition="panelTransition"
      >
        <!-- A slot named after the tab id wins; otherwise the default slot gets the active tab. -->
        <slot :name="activeId" :tab="activeTab">
          <slot :tab="activeTab" />
        </slot>
      </Motion>
    </AnimatePresence>
  </div>
</template>
