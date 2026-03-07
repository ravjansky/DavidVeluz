<template>
  <div class="layout">
    <BackgroundLiquidBackground
      v-if="!prefersReducedMotion"
      ref="bgRef"
    />
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

const bgRef = ref<{ setShaderColor: (r: number, g: number, b: number, duration?: number, blend?: number) => void; setTheme: (index: number) => void; setSpeed: (speed: number) => void } | null>(null)

provide('setBackgroundColor', (r: number, g: number, b: number, duration?: number, blend?: number) => {
  bgRef.value?.setShaderColor(r, g, b, duration, blend)
})

provide('setBackgroundTheme', (index: number) => {
  bgRef.value?.setTheme(index)
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
