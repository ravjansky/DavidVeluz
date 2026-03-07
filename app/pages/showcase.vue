<template>
  <NuxtLayout>
    <main class="showcase">
      <header class="showcase__header">
        <NuxtLink to="/" class="showcase__back">Back</NuxtLink>
      </header>
      <section class="showcase__content">
        <span class="showcase__label">Showcase</span>
        <h1 class="showcase__heading">Selected Work</h1>
        <p class="showcase__sub">
          A curated collection of projects I've designed and built — from web apps to
          creative experiments. More coming soon.
        </p>
      </section>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Showcase — David Veluz',
  description: 'Selected work by David Veluz — web apps, interfaces, and creative experiments.',
})
</script>

<style scoped>
.showcase {
  min-height: 100vh;
  padding: 2rem clamp(1.5rem, 5vw, 3rem);
  color: #fff;
}

.showcase__header {
  margin-bottom: 8rem;
}

.showcase__back {
  font-size: 0.85rem;
  text-decoration: none;
  color: inherit;
  opacity: 0.5;
  letter-spacing: 0.05em;
  transition: opacity 0.3s var(--ease-float);
}

.showcase__back:hover {
  opacity: 1;
}

.showcase__content {
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.showcase__label {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.4;
}

.showcase__heading {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  margin: 0;
  line-height: 1.1;
  font-family: var(--font-panchang, sans-serif);
}

.showcase__sub {
  font-size: 1rem;
  line-height: 1.8;
  opacity: 0.6;
  margin: 0;
  max-width: 480px;
}
</style>