import { ref, computed, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)
const isLowEnd = ref(false)
const prefersReducedMotion = ref(false)

let evaluated = false
let motionQuery: MediaQueryList | null = null
let motionHandler: ((e: MediaQueryListEvent) => void) | null = null

function evaluate() {
  if (evaluated || !import.meta.client) return
  evaluated = true

  // Mobile: UA + viewport width
  const ua = navigator.userAgent
  const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const narrowViewport = window.innerWidth < 768
  isMobile.value = mobileUA || narrowViewport

  // Low-end: CPU cores + device memory
  const cores = navigator.hardwareConcurrency ?? 8
  const memory = (navigator as any).deviceMemory ?? 8
  const connection = (navigator as any).connection?.effectiveType
  const slowNetwork = connection === '2g' || connection === 'slow-2g'
  isLowEnd.value = (cores <= 2 && memory <= 2) || (cores <= 2 && slowNetwork)

  // Reduced motion
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = motionQuery.matches
  motionHandler = (e: MediaQueryListEvent) => {
    prefersReducedMotion.value = e.matches
  }
  motionQuery.addEventListener('change', motionHandler)
}

export function usePerformanceMetrics() {
  const canRunHeavyAnimations = computed(
    () => !isMobile.value && !isLowEnd.value && !prefersReducedMotion.value
  )

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
