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
}

const sectionColors: SectionColorMap[] = [
  { selector: '.hero',     color: [0.05, 0.05, 0.08], duration: 1.5 },
  { selector: '.who-am-i', color: [0.08, 0.06, 0.12], duration: 1.2 },
  { selector: '.about-me', color: [0.06, 0.10, 0.10], duration: 1.2 },
  { selector: '.skills',   color: [0.10, 0.06, 0.06], duration: 1.2 },
  { selector: '.process',  color: [0.05, 0.05, 0.08], duration: 1.2 },
  { selector: '.footer',   color: [0.02, 0.02, 0.04], duration: 1.0 },
]

onMounted(() => {
  if (!setBackgroundColor) return

  // Respect reduced motion — skip ScrollTrigger color shifts
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  sectionColors.forEach(({ selector, color, duration }) => {
    ScrollTrigger.create({
      trigger: selector,
      start: 'top 60%',
      onEnter: () => setBackgroundColor(color[0], color[1], color[2], duration),
      onEnterBack: () => setBackgroundColor(color[0], color[1], color[2], duration),
    })
  })
})
</script>

<style scoped>
main {
  min-height: 100vh;
}
</style>