<script setup lang="ts" generic="T extends { id: string; title: string; content?: string }">
import { AnimatePresence, Motion, useReducedMotion } from "motion-v";

const props = withDefaults(
  defineProps<{
    items: T[];
    /** Allow several panels open at once. */
    multiple?: boolean;
    defaultOpen?: string[];
    headingLevel?: 2 | 3 | 4;
  }>(),
  { multiple: false, defaultOpen: () => [], headingLevel: 3 },
);

defineSlots<{ default?: (props: { item: T }) => unknown }>();

const openIds = ref(new Set(props.defaultOpen));
const isOpen = (id: string) => openIds.value.has(id);

function toggle(id: string) {
  const next = new Set(props.multiple ? openIds.value : []);
  if (isOpen(id)) next.delete(id);
  else next.add(id);
  openIds.value = next;
}

const uid = useId();
const headerId = (id: string) => `${uid}-header-${id}`;
const panelId = (id: string) => `${uid}-panel-${id}`;

// Optional WAI-ARIA accordion keys: arrows move between headers, Home/End jump.
const root = ref<HTMLElement | null>(null);
function onKeydown(e: KeyboardEvent, index: number) {
  const headers = Array.from(root.value?.querySelectorAll<HTMLButtonElement>("[data-accordion-header]") ?? []);
  const last = headers.length - 1;
  const next = { ArrowDown: index === last ? 0 : index + 1, ArrowUp: index === 0 ? last : index - 1, Home: 0, End: last }[e.key];
  if (next === undefined) return;
  e.preventDefault();
  headers[next]?.focus();
}

const reduceMotion = useReducedMotion();
const transition = computed(() =>
  reduceMotion.value ? { duration: 0 } : { type: "spring" as const, stiffness: 300, damping: 32 },
);
</script>

<template>
  <div
    ref="root"
    class="divide-y divide-zinc-200 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900"
  >
    <div v-for="(item, i) in items" :key="item.id">
      <component :is="`h${headingLevel}`" class="text-base">
        <button
          :id="headerId(item.id)"
          type="button"
          data-accordion-header
          :aria-expanded="isOpen(item.id)"
          :aria-controls="panelId(item.id)"
          class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          @click="toggle(item.id)"
          @keydown="onKeydown($event, i)"
        >
          <span>{{ item.title }}</span>
          <Motion
            as="span"
            class="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-100 dark:bg-zinc-800"
            :initial="false"
            :animate="{ rotate: isOpen(item.id) ? 180 : 0 }"
            :transition="transition"
            aria-hidden="true"
          >
            <Icon name="lucide:chevron-down" class="size-4" />
          </Motion>
        </button>
      </component>
      <AnimatePresence :initial="false">
        <Motion
          v-if="isOpen(item.id)"
          :id="panelId(item.id)"
          key="panel"
          as="div"
          role="region"
          :aria-labelledby="headerId(item.id)"
          class="overflow-hidden"
          :initial="{ height: 0, opacity: 0 }"
          :animate="{ height: 'auto', opacity: 1 }"
          :exit="{ height: 0, opacity: 0 }"
          :transition="transition"
        >
          <div class="px-6 pb-5 text-zinc-600 dark:text-zinc-400">
            <slot :item="item">{{ item.content }}</slot>
          </div>
        </Motion>
      </AnimatePresence>
    </div>
  </div>
</template>
