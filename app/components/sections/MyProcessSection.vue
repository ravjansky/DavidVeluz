<template>
  <section class="process">
    <h2 class="process__heading">My Process</h2>
  </section>
</template>

<style scoped>
.process {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 5vw, 3rem);
}

.process__heading {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  font-family: var(--font-panchang, sans-serif);
}
</style>