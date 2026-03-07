<template>
  <section ref="sectionRef" class="who-am-i">
    <div class="who-am-i__inner">
      <span class="who-am-i__label">Who Am I</span>
      <p class="who-am-i__text">
        I'm David Veluz — a developer with a passion for turning complex ideas into clean,
        intuitive digital products. I work at the intersection of design and engineering,
        where attention to detail and a love for motion drive everything I build.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  gsap.from(sectionRef.value!.children, {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.15,
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
    },
  })
})
</script>

<style scoped>
.who-am-i {
  padding: 10rem 3rem;
  max-width: 800px;
  margin: 0 auto;
}

.who-am-i__inner {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.who-am-i__label {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.4;
}

.who-am-i__text {
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  line-height: 1.6;
  font-weight: 300;
}
</style>
