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

/* ─────────────────────────────────────────────
   Single-color system
   ─────────────────────────────────────────────
   Every section has ONE color — the same whether scrolling
   into it from above or returning from below.

   skipTrigger: true → the component drives its own progressive
   color shift via its pinned ScrollTrigger. The entry still exists
   in the array so adjacent sections can reference it as `prev`.
   ───────────────────────────────────────────── */

interface SectionColorMap {
  selector: string
  enter: [number, number, number]
  enterBack: [number, number, number]
  blend: number
  blendBack: number
  duration: number
  skipTrigger?: boolean
}

const sectionColors: SectionColorMap[] = [
  // ── Hero — pink ──
  {
    selector: '.hero',
    enter:     [0.9, 0.2, 0.2],
    enterBack: [0.9, 0.2, 0.2],
    blend: 0.6, blendBack: 0.6,
    duration: 1,
  },

  // ── Who Am I — blue (component handles progressive lerp internally) ──
  {
    selector: '.who-am-i',
    enter:     [0.05, 0.25, 0.7],
    enterBack: [0.05, 0.25, 0.7],
    blend: 0.65, blendBack: 0.65,
    duration: 1,
    skipTrigger: true,
  },

  // ── About Me — yellow gold ──
  {
    selector: '.about-me',
    enter:     [0.8, 0.6, 0.1],
    enterBack: [0.8, 0.6, 0.1],
    blend: 0.7, blendBack: 0.7,
    duration: 1,
  },

  // ── Projects — purple ──
  {
    selector: '.projects',
    enter:     [0.4, 0.1, 0.6],
    enterBack: [0.4, 0.1, 0.6],
    blend: 0.7, blendBack: 0.7,
    duration: 1,
  },

  // ── Skills — green ──
  {
    selector: '.skills',
    enter:     [0.1, 0.5, 0.2],
    enterBack: [0.1, 0.5, 0.2],
    blend: 0.65, blendBack: 0.65,
    duration: 1,
  },

  // ── Process — dark orange ──
  {
    selector: '.process',
    enter:     [0.25, 0.1, 0.01],
    enterBack: [0.25, 0.1, 0.01],
    blend: 0.85, blendBack: 0.85,
    duration: 1,
  },

  // ── Footer — midnight ──
  {
    selector: '.footer',
    enter:     [0.02, 0.04, 0.08],
    enterBack: [0.02, 0.04, 0.08],
    blend: 0.8, blendBack: 0.8,
    duration: 1,
  },
]

onMounted(() => {
  if (!setBackgroundColor) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  sectionColors.forEach((section, index) => {
    // Who-am-i handles its own — skip creating a trigger for it
    if (section.skipTrigger) return

    const prev = sectionColors[index - 1]

    ScrollTrigger.create({
      trigger: section.selector,
      start: 'top 60%',

      // Scrolling DOWN into this section → forward palette
      onEnter: () => {
        setBackgroundColor(
          section.enter[0], section.enter[1], section.enter[2],
          section.duration, section.blend,
        )
      },

      // Scrolling BACK UP into this section → reverse palette
      onEnterBack: () => {
        setBackgroundColor(
          section.enterBack[0], section.enterBack[1], section.enterBack[2],
          section.duration, section.blendBack,
        )
      },

      // Scrolling BACK UP past this section → restore previous
      // section's reverse palette (since we're entering it from below)
      onLeaveBack: () => {
        if (prev) {
          setBackgroundColor(
            prev.enterBack[0], prev.enterBack[1], prev.enterBack[2],
            prev.duration, prev.blendBack,
          )
        }
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