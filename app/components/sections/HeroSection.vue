<template>
  <section class="hero" ref="heroRef">
    <!-- 
      SEO: Descriptive h1 for crawlers + screen readers.
      sr-only keeps it visually hidden without display:none (which crawlers might skip).
    -->
    <h1 class="sr-only">David Veluz ~ Creative Developer &amp; Designer based in the Philippines</h1>

    <!-- 
      aria-hidden: tells assistive tech + crawlers this is decorative,
      not indexable content. Prevents repeated text from being read as spam.
    -->
    <div class="marquee-wrapper" aria-hidden="true" role="presentation">
      <!-- Row 1: Name — moves left by default -->
      <div class="marquee-track">
        <div class="marquee-content" ref="trackTop">
          <span class="marquee-item" v-for="n in 8" :key="'name-' + n"> DAVID ~ VELUZ ~</span>
        </div>
      </div>

      <!-- Row 2: Role — moves right by default -->
      <div class="marquee-track">
        <div class="marquee-content" ref="trackBottom">
          <span class="marquee-item" v-for="n in 8" :key="'role-' + n"> CREATIVE + DEVELOPER + DESIGNER +</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const heroRef = ref<HTMLElement | null>(null)
const trackTop = ref<HTMLElement | null>(null)
const trackBottom = ref<HTMLElement | null>(null)

let ctx: gsap.Context

onMounted(() => {
  if (!heroRef.value) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  ctx = gsap.context(() => {

    // Row 1 — left by default
    const topTween = gsap.to(trackTop.value, {
      xPercent: -50,
      repeat: -1,
      yoyo: true,
      duration: 60,       // Slow, cinematic pace
      ease: "none",       // Linear for continuous marquee — easing would cause pulsing
    })

    // Row 2 — right by default (start offset, animate to 0)
    gsap.set(trackBottom.value, { xPercent: -50 })
    const bottomTween = gsap.to(trackBottom.value, {
      xPercent: 0,
      repeat: -1,
      yoyo: true,
      duration: 45,
      ease: "none",
    })

    // Scroll-direction reversal
    ScrollTrigger.create({
      trigger: heroRef.value,
      start: "top bottom",
      end: "bottom top",
      // Pause when out of view — saves GPU cycles
      onEnter: () => { topTween.play(); bottomTween.play() },
      onLeave: () => { topTween.pause(); bottomTween.pause() },
      onEnterBack: () => { topTween.play(); bottomTween.play() },
      onLeaveBack: () => { topTween.pause(); bottomTween.pause() },

      onUpdate: (self) => {
        // Flip direction: scroll down = normal, scroll up = reversed
        const targetTimeScale = self.direction === 1 ? 1 : -1

        gsap.to(topTween, {
          timeScale: targetTimeScale,
          duration: 0.8,
          ease: "power2.inOut",
          overwrite: "auto"
        })

        gsap.to(bottomTween, {
          timeScale: targetTimeScale,
          duration: 0.8,
          ease: "power2.inOut",
          overwrite: "auto"
        })
      }
    })

    // Entrance reveal — rows slide + fade in
    gsap.from('.marquee-track', {
      opacity: 0,
      yPercent: 30,
      duration: 1.4,
      stagger: 0.2,
      ease: EASE.signature,
    })

  }, heroRef.value)
})

onUnmounted(() => {
  // Kill everything — prevents mobile memory leaks
  ctx?.revert()
})
</script>

<style scoped>
/* ── Hero ── */
.hero {
  position: relative;
  min-height: 100dvh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Transparent so your WebGL/fluid canvas shows through */
  background: transparent;
  mix-blend-mode: difference;
}

/* ── Marquee layout ── */
.marquee-wrapper {
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1.5vw, 1.5rem);
  /* Angled, oversized to bleed off all edges */
  transform: rotate(-12deg) scale(1.15) translateY(20%);
  transform-origin: center center;
  width: 200vw;
  margin-left: -50vw;
  mix-blend-mode: difference;
}

@media (max-width: 768px) {
  .marquee-wrapper {
    transform: rotate(-50deg) scale(1.4);
    width: 300vw;
    margin-left: -10vw;
    gap: clamp(0.25rem, 1vw, 0.75rem);
  }
}

/* ── Track ── */
.marquee-track {
  display: flex;
  width: 100%;
  overflow: visible;
}

/* ── Sliding content strip ── */
.marquee-content {
  display: flex;
  flex-shrink: 0;
  flex-wrap: nowrap;
  width: max-content;
}

/* ── Text ── */
.marquee-item {
  font-style: italic;
  line-height: 0.8;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  /* White for the blend mode math to work */
  color: #ffffff;
  white-space: nowrap;
  padding-right: 0.5em;
  user-select: none;
  -webkit-user-select: none;
  font-size: clamp(4rem, 12vw, 15rem);
}

/* Row 1 — Panchang */
.marquee-track:nth-child(1) .marquee-item {
  font-family: var(--font-panchang);
  font-weight: 500;
}

/* Row 2 — Melodrama */
.marquee-track:nth-child(2) .marquee-item {
  font-family: var(--font-melodrama);
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .marquee-content {
    animation: none !important;
  }
}

/* ── SR-only ── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>