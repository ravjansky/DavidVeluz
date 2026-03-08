<template>
  <main>
    <SectionsNavbar />
    <SectionsHeroSection />
    <SectionsWhoAmISection />
    <SectionsAboutMeSection />
    <SectionsProjectsSection />
    <SectionsSkillsSection />
    <SectionsMyProcessSection />
    <SectionsFooter />
  </main>
</template>

<script setup lang="ts">
import { onMounted, inject } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

useSeoMeta({
  title: 'David Veluz — Full-Stack Developer & Creative Technologist',
  description: 'Portfolio of David Veluz, a full-stack developer and creative technologist building purposeful, animated web experiences.',
})

type SetColorFn = (r: number, g: number, b: number, duration?: number, blend?: number) => void
const setBackgroundColor = inject<SetColorFn | null>('setBackgroundColor', null)

interface SectionColorMap {
  selector: string
  color: [number, number, number]
  duration: number
  blend: number
}

const sectionColors: SectionColorMap[] = [
  // 1. Deepened Hero Pink (Establishes the bold brand entry)
  { selector: '.hero',     color: [0.9, 0.2, 0.2],    duration: 1, blend: 0.6 },

  // 2. Rich Corporate Blue (Hard cut to professional, clear tech blue)
  { selector: '.who-am-i', color: [0.05, 0.25, 0.7],  duration: 1, blend: 0.65 },

  // 3. Deep Royal Violet (A heavy, dark purple. Authoritative and grounded)
  { selector: '.about-me', color: [0.25, 0.05, 0.45], duration: 1, blend: 0.7 },

  // 4. Deep Emerald (High contrast shift to keep the eye engaged)
  { selector: '.skills',   color: [0.05, 0.35, 0.25], duration: 1, blend: 0.65 },

  // 5. Dark Sapphire (Cooling it back down into the blue spectrum)
  { selector: '.projects', color: [0.1, 0.15, 0.5],   duration: 1, blend: 0.7 },

  // 6. Burnished Gold / Dark Orange (Rich, heavy amber for the process breakdown)
  { selector: '.process',  color: [0.65, 0.3, 0.02],  duration: 1, blend: 0.75 },

  // 7. Midnight Blue (Almost black, but keeps the corporate undertone to finish)
  { selector: '.footer',   color: [0.02, 0.04, 0.08], duration: 1, blend: 0.8 },
]

onMounted(() => {
  if (!setBackgroundColor) return

  // Respect reduced motion — skip ScrollTrigger color shifts
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  sectionColors.forEach(({ selector, color, duration, blend }, index) => {
    const prev = sectionColors[index - 1]
    ScrollTrigger.create({
      trigger: selector,
      start: 'top 60%',
      onEnter: () => setBackgroundColor(color[0], color[1], color[2], duration, blend),
      onLeaveBack: () => {
        if (prev) setBackgroundColor(prev.color[0], prev.color[1], prev.color[2], prev.duration, prev.blend)
      },
    })
  })
})
</script>

<style scoped>
main {
  min-height: 100vh;
}
</style>