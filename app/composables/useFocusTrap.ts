import type { Ref } from "vue";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * While `active` is true: keeps Tab focus inside `container`, calls `onEscape` on ESC,
 * and focuses the first focusable element. Restores the previous focus when deactivated.
 */
export function useFocusTrap(
  container: Ref<HTMLElement | null>,
  active: Ref<boolean>,
  onEscape?: () => void,
) {
  let previouslyFocused: HTMLElement | null = null;

  const getFocusable = () =>
    container.value
      ? Array.from(container.value.querySelectorAll<HTMLElement>(FOCUSABLE))
      : [];

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onEscape?.();
      return;
    }
    if (e.key !== "Tab") return;

    const items = getFocusable();
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  watch(active, async (isActive) => {
    if (!import.meta.client) return;
    if (isActive) {
      previouslyFocused = document.activeElement as HTMLElement | null;
      document.addEventListener("keydown", onKeydown);
      await nextTick();
      getFocusable()[0]?.focus();
    } else {
      document.removeEventListener("keydown", onKeydown);
      previouslyFocused?.focus();
      previouslyFocused = null;
    }
  });

  onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));
}
