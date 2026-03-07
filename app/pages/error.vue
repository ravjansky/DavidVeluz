<template>
  <main class="error-page">
    <div class="error-page__content">
      <span class="error-page__code">404</span>
      <h1 class="error-page__heading">Page not found.</h1>
      <p class="error-page__sub">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <NuxtLink to="/" class="error-page__link">Back to Home</NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
defineProps<{
  error?: { statusCode?: number; message?: string }
}>()

useSeoMeta({
  title: '404 — Page Not Found | David Veluz',
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background-color: #000;
  color: #fff;
}

.error-page__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.error-page__code {
  font-size: clamp(5rem, 15vw, 10rem);
  font-weight: 700;
  line-height: 1;
  opacity: 0.1;
  letter-spacing: -0.05em;
  font-family: var(--font-panchang, sans-serif);
}

.error-page__heading {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 600;
  margin: 0;
  font-family: var(--font-panchang, sans-serif);
}

.error-page__sub {
  font-size: 1rem;
  opacity: 0.5;
  margin: 0;
  max-width: 340px;
  line-height: 1.6;
}

.error-page__link {
  margin-top: 0.5rem;
  padding: 0.8rem 2rem;
  border: 1px solid currentColor;
  text-decoration: none;
  color: inherit;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  opacity: 0.7;
  transition: opacity 0.3s var(--ease-float);
}

.error-page__link:hover {
  opacity: 1;
}
</style>