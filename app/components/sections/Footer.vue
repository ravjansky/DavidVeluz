<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__left">
        <span class="footer__name">David Veluz</span>
        <span class="footer__year">&copy; {{ currentYear }}</span>
      </div>
      <div class="footer__links">
        <a href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="#" target="_blank" rel="noopener noreferrer">Dribbble</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  height: 60dvh;
  padding: clamp(1.5rem, 5vw, 3rem);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.footer__left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer__name {
  font-size: 0.9rem;
  font-weight: 600;
  font-family: var(--font-panchang, sans-serif);
}

.footer__year {
  font-size: 0.8rem;
  opacity: 0.4;
}

.footer__links {
  display: flex;
  gap: 2rem;
}

.footer__links a {
  font-size: 0.8rem;
  text-decoration: none;
  color: inherit;
  opacity: 0.4;
  letter-spacing: 0.05em;
  transition: opacity 0.3s var(--ease-float);
}

.footer__links a:hover {
  opacity: 1;
}
</style>