export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  type: ToastType;
  /** Milliseconds before auto-dismiss; 0 keeps it until closed. */
  duration: number;
}

export type ToastInput = Pick<Toast, "title"> & Partial<Omit<Toast, "id" | "title">>;

const MAX_VISIBLE = 4;

// Timers live outside reactive state; they only ever run in the browser.
const timers = new Map<number, { timeout?: ReturnType<typeof setTimeout>; remaining: number; startedAt: number }>();
let nextId = 0;

/**
 * Global toast queue. Render it once with `<UiToast />` (in the default layout),
 * then call `toast({ title, type })` from anywhere.
 */
export function useToast() {
  const toasts = useState<Toast[]>("prism-toasts", () => []);

  function dismiss(id: number) {
    const timer = timers.get(id);
    if (timer?.timeout) clearTimeout(timer.timeout);
    timers.delete(id);
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  function start(id: number, ms: number) {
    if (!import.meta.client || ms <= 0) return;
    timers.set(id, { remaining: ms, startedAt: Date.now(), timeout: setTimeout(() => dismiss(id), ms) });
  }

  function toast(input: ToastInput): number {
    const item: Toast = { id: ++nextId, type: "info", duration: 4000, ...input };
    const overflow = toasts.value.length + 1 - MAX_VISIBLE;
    toasts.value.slice(0, Math.max(overflow, 0)).forEach((t) => dismiss(t.id));
    toasts.value = [...toasts.value, item];
    start(item.id, item.duration);
    return item.id;
  }

  /** Pause auto-dismiss (while hovered or focused). */
  function pause(id: number) {
    const timer = timers.get(id);
    if (!timer?.timeout) return;
    clearTimeout(timer.timeout);
    timer.timeout = undefined;
    timer.remaining -= Date.now() - timer.startedAt;
  }

  function resume(id: number) {
    const timer = timers.get(id);
    if (!timer || timer.timeout) return;
    timer.startedAt = Date.now();
    timer.timeout = setTimeout(() => dismiss(id), Math.max(timer.remaining, 1000));
  }

  return { toasts: readonly(toasts), toast, dismiss, pause, resume };
}
