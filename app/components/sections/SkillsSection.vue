<template>
  <section ref="sectionRef" class="skills">
    <div class="skills__inner">
      <span class="skills__label">Skills</span>
      <h2 class="skills__heading">What I bring to the table.</h2>
      <div class="skills__grid">
        <div v-for="skill in skills" :key="skill" class="skills__tag">{{ skill }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const skills = [
  'Vue / Nuxt',
  'React / Next.js',
  'TypeScript',
  'GSAP',
  'Tailwind CSS',
  'Node.js',
  'Figma',
  'PostgreSQL',
  'REST APIs',
  'Git',
  'Docker',
  'Cloudinary',
]

const sectionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  gsap.from(sectionRef.value!.querySelectorAll('.skills__label, .skills__heading'), {
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

  gsap.from(sectionRef.value!.querySelectorAll('.skills__tag'), {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.06,
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 70%',
    },
  })
})
</script>

<style scoped>
.skills {
  padding: 10rem 3rem;
}

.skills__inner {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.skills__label {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.4;
}

.skills__heading {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
}

.skills__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skills__tag {
  padding: 0.5rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  opacity: 0.8;
}
</style>
