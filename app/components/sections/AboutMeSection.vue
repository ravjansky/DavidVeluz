<template>
  <section class="about-me">
    <h2 class="about-me__heading">About Me</h2>
  </section>
</template>

<style scoped>
.about-me {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 5vw, 3rem);
}

.about-me__heading {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  font-family: var(--font-panchang, sans-serif);
}
</style>