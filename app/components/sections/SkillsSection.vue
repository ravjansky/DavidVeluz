<template>
  <section class="skills">
    <h2 class="skills__heading">Skills</h2>
  </section>
</template>

<style scoped>
.skills {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 5vw, 3rem);
}

.skills__heading {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  font-family: var(--font-panchang, sans-serif);
}
</style>