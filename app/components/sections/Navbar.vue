<template>
  <nav ref="navRef" class="navbar">
    <div class="navbar__logo">
      <svg class="navbar__logo-svg" viewBox="0 0 1400 150" xmlns="http://www.w3.org/2000/svg" aria-label="DV">
        <defs>
          <linearGradient id="nav-dv-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#a70000" />
            <stop offset="100%" stop-color="#ff5252" />
          </linearGradient>
        </defs>
        <text x="700" y="80" fill="url(#nav-dv-grad)" style="font-family:'Panchang',sans-serif;font-size:110px;font-weight:700;text-anchor:middle;dominant-baseline:middle;letter-spacing:-.05em">    DV  </text>
      </svg>
    </div>
    <ul class="navbar__links">
      <li><NuxtLink to="/">Home</NuxtLink></li>
      <li><NuxtLink to="/showcase">Showcase</NuxtLink></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { EASE } from '~/composables/useAnimations'

const navRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!navRef.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.from(navRef.value, {
    y: -60,
    opacity: 0,
    duration: 1,
    ease: EASE.signature,
    delay: 0.2,
  })
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem clamp(1.5rem, 5vw, 3rem);
}

.navbar__logo {
  display: flex;
  align-items: center;
}

.navbar__logo-svg {
  width: 100%;
  height: auto;
}

.navbar__links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar__links a {
  text-decoration: none;
  color: inherit;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  opacity: 0.7;
  transition: opacity 0.3s var(--ease-float);
}

.navbar__links a:hover {
  opacity: 1;
}
</style>