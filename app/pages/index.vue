<template>
  <main>
    <SectionsNavbar />
    <SectionsHeroSection />
    <SectionsWhoAmISection />
    <SectionsAboutMeSection />
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
  { selector: '.hero',     color: [1.2, 0.3, 0.3],    duration: 1, blend: 0.5 },
  { selector: '.who-am-i', color: [-1.2, 0.6, 1.8],   duration: 1, blend: 0.3 },
  { selector: '.about-me', color: [-1.2, 0.6, 1.8],   duration: 1, blend: 0.5 },
  { selector: '.skills',   color: [5.0, 0.0, 0.0],    duration: 1, blend: 0.5 },
  { selector: '.process',  color: [-1.1, -1.1, -1.1],  duration: 1, blend: 0.5 },
  { selector: '.footer',   color: [-1.1, -1.1, 1.1],   duration: 1, blend: 0.5 },
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