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
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

useSeoMeta({
  title: 'David Veluz — Full-Stack Developer & Creative Technologist',
  description: 'Portfolio of David Veluz, a full-stack developer and creative technologist building purposeful, animated web experiences.',
})
</script>

<style scoped>
main {
  min-height: 100vh;
}
</style>
