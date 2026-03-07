<template>
  <section ref="sectionRef" class="about-me">
    <div class="about-me__inner">
      <span class="about-me__label">About Me</span>
      <h2 class="about-me__heading">A bit more about the person behind the screen.</h2>
      <div class="about-me__body">
        <p>
          Based in the Philippines, I've spent the last few years honing my craft across
          front-end development, UI design, and creative coding. I thrive on building things
          that feel alive — where every scroll, click, and transition has intention.
        </p>
        <p>
          When I'm not in front of a screen, you'll find me exploring photography, dissecting
          films, or chasing the perfect cup of coffee. These experiences feed directly into
          how I approach design — with a human, story-driven lens.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  gsap.from(sectionRef.value!.querySelectorAll('.about-me__label, .about-me__heading, .about-me__body p'), {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.15,
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 75%',
    },
  })
})
</script>

<style scoped>
.about-me {
  padding: 10rem 3rem;
  background: rgba(255, 255, 255, 0.03);
}

.about-me__inner {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.about-me__label {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.4;
}

.about-me__heading {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
}

.about-me__body {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.about-me__body p {
  font-size: 1rem;
  line-height: 1.8;
  opacity: 0.7;
  margin: 0;
}
</style>
