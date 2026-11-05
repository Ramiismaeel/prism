import { useReducedMotion } from "motion-v";

/**
 * `true` once mounted on the client and the user does NOT prefer reduced motion.
 *
 * Safe to use in rendered output (v-if, attributes, text): it is `false` during SSR *and*
 * during hydration, so server and client markup always match. `useReducedMotion()` alone can
 * already be `true` on the first client render, which causes hydration mismatches.
 */
export function useMotionEnabled() {
  const reduceMotion = useReducedMotion();
  const enabled = ref(false);
  onMounted(() => {
    watch(reduceMotion, (reduce) => (enabled.value = !reduce), { immediate: true });
  });
  return readonly(enabled);
}
