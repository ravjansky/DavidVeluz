<template>
  <div class="layout">
    <!-- Liquid BG — renders on client only (.client.vue), skipped on reduced motion -->
    <BackgroundLiquidBackground
      v-if="!prefersReducedMotion"
      ref="bgRef"
    />

    <!-- Fluid cursor — desktop only, skipped on reduced motion -->
    <CursorFluidCursor
      v-if="!isMobile && !prefersReducedMotion"
    />

    <div class="layout__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { isMobile, prefersReducedMotion } = usePerformanceMetrics()
const { init: initLenis, destroy: destroyLenis } = useLenis()

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

onMounted(() => {
  const lenis = initLenis()
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update)
  }
})

onUnmounted(() => {
  destroyLenis()
})
</script>

<style scoped>
.layout__content {
  position: relative;
  z-index: 1;
}
</style>