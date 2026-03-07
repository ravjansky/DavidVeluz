<template>
  <section ref="sectionRef" class="process">
    <div class="process__inner">
      <span class="process__label">My Process</span>
      <h2 class="process__heading">How I work, from idea to launch.</h2>
      <div class="process__steps">
        <div v-for="step in steps" :key="step.number" class="process__step">
          <span class="process__step-number">{{ step.number }}</span>
          <div class="process__step-content">
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const steps = [
  {
    number: '01',
    title: 'Discover',
    description: 'Understanding the problem, the users, and the goals before writing a single line of code.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Translating ideas into wireframes and high-fidelity prototypes with a focus on clarity and feel.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Developing the product with clean, maintainable code and smooth, intentional interactions.',
  },
  {
    number: '04',
    title: 'Refine',
    description: 'Iterating based on feedback, polishing details, and ensuring performance across all devices.',
  },
]

const sectionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  gsap.from(sectionRef.value!.querySelectorAll('.process__label, .process__heading'), {
    y: 30,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 78%',
    },
  })

  gsap.from(sectionRef.value!.querySelectorAll('.process__step'), {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.15,
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
    },
  })
})
</script>

<style scoped>
.process {
  padding: 10rem 3rem;
  background: rgba(255, 255, 255, 0.03);
}

.process__inner {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.process__label {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.4;
}

.process__heading {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
}

.process__steps {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.process__step {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.process__step-number {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0.3;
  padding-top: 0.3rem;
  flex-shrink: 0;
}

.process__step-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.process__step-content p {
  font-size: 0.95rem;
  line-height: 1.7;
  opacity: 0.6;
  margin: 0;
}
</style>
