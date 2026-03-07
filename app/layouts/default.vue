<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

onMounted(() => {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  })

  gsap.ticker.add((time) => {
    lenis!.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  lenis.on('scroll', ScrollTrigger.update)
})

onUnmounted(() => {
  lenis?.destroy()
  gsap.ticker.remove((time) => {
    lenis?.raf(time * 1000)
  })
})
</script>
