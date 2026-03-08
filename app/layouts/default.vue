<template>
  <div class="layout">
    <!--
      Liquid BG — client only, skipped on reduced motion.

      FIX: Also killed entirely on showcase page.
      v-if destroys the component + WebGL context = zero GPU cost.
      Remounting on navigation back is a ~50ms one-time hit,
      far cheaper than bleeding GPU frames on a page that doesn't need it.
    -->
    <ClientOnly>
      <BackgroundLiquidBackground
        v-if="!prefersReducedMotion && shouldRenderBackground"
        ref="bgRef"
      />
    </ClientOnly>

    <!-- Fluid cursor — desktop only, skipped on reduced motion -->
    <ClientOnly>
      <CursorFluidCursor
        v-if="!isMobile && !prefersReducedMotion"
      />
    </ClientOnly>

    <div class="layout__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const route = useRoute()

const { isMobile, prefersReducedMotion } = usePerformanceMetrics()

const { init: initLenis, destroy: destroyLenis } = useLenis()

// Only enable Lenis on index page, not on showcase
const shouldInitLenis = computed(() => route.name === 'index')

/*
  Route-aware background control.
  Showcase doesn't need the shader — killing the component
  frees the WebGL context entirely. On mobile this is a
  meaningful battery/thermal win.
*/
const shouldRenderBackground = computed(() => {
  return route.name !== 'showcase' && route.path !== '/showcase'
})

/* ─── Background ref + exposed API ─── */
interface BgExposed {
  setShaderColor: (r: number, g: number, b: number, duration?: number, blend?: number) => void
  setTheme: (index: number) => void
  setSpeed: (speed: number) => void
}

const bgRef = ref<BgExposed | null>(null)

provide('setBackgroundColor', (r: number, g: number, b: number, duration?: number, blend?: number) => {
  bgRef.value?.setShaderColor(r, g, b, duration, blend)
})

provide('setBackgroundTheme', (index: number) => {
  bgRef.value?.setTheme(index)
})

provide('setBackgroundSpeed', (speed: number) => {
  bgRef.value?.setSpeed(speed)
})

/* ─── Lenis lifecycle — reactive to route changes ─── */
let lenisInitialized = false

function setupLenis() {
  if (shouldInitLenis.value && !lenisInitialized) {
    const lenis = initLenis()
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
    }
    lenisInitialized = true
  } else if (!shouldInitLenis.value && lenisInitialized) {
    destroyLenis()
    lenisInitialized = false
  }
}

watch(shouldInitLenis, setupLenis)

onMounted(setupLenis)

onUnmounted(() => {
  if (lenisInitialized) {
    destroyLenis()
    lenisInitialized = false
  }
})
</script>

<style scoped>
.layout__content {
  position: relative;
  z-index: 1;
}
</style>