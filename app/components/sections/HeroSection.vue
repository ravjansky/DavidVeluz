<template>
  <section class="hero">
    <h1 class="hero__heading">David Veluz</h1>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 5vw, 3rem);
}

.hero__heading {
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 700;
  font-family: var(--font-panchang, sans-serif);
  line-height: 1.1;
  text-align: center;
}
</style>