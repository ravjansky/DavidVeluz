<template>
  <nav ref="navRef" class="navbar">
    <div class="navbar__logo">DV</div>
    <ul class="navbar__links">
      <li><NuxtLink to="/">Home</NuxtLink></li>
      <li><NuxtLink to="/showcase">Showcase</NuxtLink></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

const navRef = ref<HTMLElement | null>(null)

onMounted(() => {
  gsap.from(navRef.value, {
    y: -60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
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
  padding: 1.5rem 3rem;
}

.navbar__logo {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
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
  transition: opacity 0.3s ease;
}

.navbar__links a:hover {
  opacity: 1;
}
</style>
