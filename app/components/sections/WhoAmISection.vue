<template>
  <section class="who-am-i">
    <h2 class="who-am-i__heading">Who Am I</h2>
  </section>
</template>

<style scoped>
.who-am-i {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 5vw, 3rem);
}

.who-am-i__heading {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  font-family: var(--font-panchang, sans-serif);
}
</style>