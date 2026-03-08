<template>
  <section class="projects">
    <h2 class="projects__heading">My Projects</h2>
  </section>
</template>

<style scoped>
.projects {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 5vw, 3rem);
}

.projects__heading {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  font-family: var(--font-panchang, sans-serif);
}
</style>