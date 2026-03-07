import { ref, computed, onMounted, onUnmounted } from 'vue'

/* ─────────────────────────────────────────────
   Performance detection — evaluates eagerly on
   first call (client only). No `any` types.
   ───────────────────────────────────────────── */

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number
  connection?: { effectiveType?: string }
}

const isMobile = ref(false)
const isLowEnd = ref(false)
const prefersReducedMotion = ref(false)

let evaluated = false
let motionQuery: MediaQueryList | null = null
let motionHandler: ((e: MediaQueryListEvent) => void) | null = null

function evaluate() {
  if (evaluated || typeof window === 'undefined') return
  evaluated = true

  const nav = navigator as NavigatorWithMemory
  const ua = nav.userAgent

  // Mobile: UA sniff + narrow viewport
  const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const narrowViewport = window.innerWidth < 768
  isMobile.value = mobileUA || narrowViewport

  // Low-end: core count + device memory + slow network
  const cores = nav.hardwareConcurrency ?? 8
  const memory = nav.deviceMemory ?? 8
  const effectiveType = nav.connection?.effectiveType
  const slowNetwork = effectiveType === '2g' || effectiveType === 'slow-2g'
  isLowEnd.value = (cores <= 2 && memory <= 2) || (cores <= 2 && slowNetwork)

  // Reduced motion preference
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = motionQuery.matches
  motionHandler = (e: MediaQueryListEvent) => {
    prefersReducedMotion.value = e.matches
  }
  motionQuery.addEventListener('change', motionHandler)
}

// Eagerly evaluate on import (client-side only)
if (import.meta.client) {
  evaluate()
}

export function usePerformanceMetrics() {
  const canRunHeavyAnimations = computed(
    () => !isMobile.value && !isLowEnd.value && !prefersReducedMotion.value
  )

  // Re-evaluate if somehow missed (SSR → client hydration)
  onMounted(evaluate)

  onUnmounted(() => {
    if (motionQuery && motionHandler) {
      motionQuery.removeEventListener('change', motionHandler)
    }
  })

  return {
    isMobile,
    isLowEnd,
    prefersReducedMotion,
    canRunHeavyAnimations,
  }
}