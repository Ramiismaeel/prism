import type { Ref } from "vue";

// Shared across every overlay, so when two overlays are stacked (e.g. a modal over the
// mobile menu), closing the first one doesn't unlock the page.
let activeLocks = 0;

/** Locks page scroll while `active` is true. */
export function useScrollLock(active: Ref<boolean>) {
  let holding = false;

  function set(lock: boolean) {
    if (!import.meta.client || lock === holding) return;
    holding = lock;
    activeLocks += lock ? 1 : -1;
    document.documentElement.style.overflow = activeLocks > 0 ? "hidden" : "";
  }

  watch(active, set, { immediate: true });
  onBeforeUnmount(() => set(false));
}
