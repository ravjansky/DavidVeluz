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
   Dual-color system
   ─────────────────────────────────────────────
   Every section carries two palettes:
   • enter / blend       — used when scrolling DOWN into the section
   • enterBack / blendBack — used when scrolling BACK UP into the section

   The "return trip" palette is intentionally different from the
   forward trip — creates a subtle sense that the site evolves as
   you revisit sections, without randomness.

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
  // ── Hero ──
  // Same color both ways — it's the origin, no "return" context
  {
    selector: '.hero',
    enter:     [0.9, 0.2, 0.2],
    enterBack: [0.9, 0.2, 0.2],
    blend: 0.6, blendBack: 0.6,
    duration: 1,
  },

  // ── Who Am I ──
  // Component handles progressive lerp internally (pinned).
  // enter = forward END state (blue), enterBack = reverse START state (teal).
  // These values are used by adjacent sections' onLeaveBack for handoff.
  {
    selector: '.who-am-i',
    enter:     [0.05, 0.25, 0.7],
    enterBack: [0.15, 0.45, 0.5],
    blend: 0.65, blendBack: 0.55,
    duration: 1,
    skipTrigger: true,
  },

  // ── About Me ──
  // Forward: deep violet | Reverse: steel blue
  {
    selector: '.about-me',
    enter:     [0.25, 0.05, 0.45],
    enterBack: [0.1, 0.3, 0.45],
    blend: 0.7, blendBack: 0.65,
    duration: 1,
  },

  // ── Projects ──
  // Forward: dark sapphire | Reverse: warm burgundy
  {
    selector: '.projects',
    enter:     [0.1, 0.15, 0.5],
    enterBack: [0.4, 0.1, 0.25],
    blend: 0.7, blendBack: 0.65,
    duration: 1,
  },

  // ── Skills ──
  // Forward: deep emerald | Reverse: dusty mauve
  {
    selector: '.skills',
    enter:     [0.05, 0.35, 0.25],
    enterBack: [0.35, 0.15, 0.35],
    blend: 0.65, blendBack: 0.65,
    duration: 1,
  },

  // ── Process ──
  // FIX: Darkened significantly so the section is readable
  // without any CSS overlay. The shader itself goes dark here.
  // Forward: deep burnt amber | Reverse: dark navy
  {
    selector: '.process',
    enter:     [0.25, 0.1, 0.01],
    enterBack: [0.08, 0.1, 0.3],
    blend: 0.85, blendBack: 0.8,
    duration: 1,
  },

  // ── Footer ──
  // Forward: midnight | Reverse: deep navy (subtle shift)
  {
    selector: '.footer',
    enter:     [0.02, 0.04, 0.08],
    enterBack: [0.05, 0.08, 0.15],
    blend: 0.8, blendBack: 0.75,
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