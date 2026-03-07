<template>
  <section class="hero">
    <div class="hero__content">
      <p ref="taglineRef" class="hero__tagline">Full-Stack Developer & Creative Technologist</p>
      <h1 ref="headingRef" class="hero__heading">
        Crafting digital<br />experiences that matter.
      </h1>
      <p ref="subRef" class="hero__sub">
        I build purposeful, performant, and beautifully animated web products.
      </p>
      <NuxtLink ref="ctaRef" to="/showcase" class="hero__cta">View My Work</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

const taglineRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const ctaRef = ref<ComponentPublicInstance | null>(null)

onMounted(() => {
  const tl = gsap.timeline({ delay: 0.5 })

  tl.from(taglineRef.value, {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  })
    .from(
      headingRef.value,
      {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      },
      '-=0.4',
    )
    .from(
      subRef.value,
      {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.5',
    )
    .from(
      ctaRef.value?.$el ?? ctaRef.value,
      {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.4',
    )
})
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 3rem;
}

.hero__content {
  max-width: 900px;
}

.hero__tagline {
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.5;
  margin-bottom: 1.5rem;
}

.hero__heading {
  font-size: clamp(2.5rem, 7vw, 6rem);
  font-weight: 700;
  line-height: 1.05;
  margin: 0 0 1.5rem;
}

.hero__sub {
  font-size: 1.1rem;
  opacity: 0.6;
  max-width: 480px;
  line-height: 1.7;
  margin-bottom: 2.5rem;
}

.hero__cta {
  display: inline-block;
  padding: 0.9rem 2.2rem;
  border: 1px solid currentColor;
  text-decoration: none;
  color: inherit;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  transition: background 0.3s ease, color 0.3s ease;
}

.hero__cta:hover {
  background: white;
  color: black;
}
</style>
