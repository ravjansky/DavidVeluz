<template>
  <section ref="sectionRef" class="process">
    <div class="process__inner">
      <!-- Header -->
      <div class="process__header" ref="headerRef">
        <h2 class="process__title">My Process</h2>
        <p class="process__subtitle">
          Every project starts with curiosity and ends with motion.
          Here's how I build digital stories.
        </p>
      </div>

      <!-- Timeline — cards + SVG line live here -->
      <div class="process__timeline" ref="timelineRef">
        <!--
          SVG line — absolutely positioned over the card stack.
          Draws itself via stroke-dashoffset as the user scrolls.

          Key fix: viewBox now tightly wraps the path's actual bounds
          so preserveAspectRatio="none" stretches the line from
          first card to last card — not floating in dead space.
        -->
        <svg
          class="process__svg"
          viewBox="-200 -200 2000 1600"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            ref="pathRef"
            d="M 400 -150 C 300 50 647 391 1047 187 C 1639 -128 1190 493 397 588 C -157 689 463 34 547 416 C 758 1285 1544 297 1098 482 C -119 1013 1756 1074 941 1350"
            stroke="url(#processLineGrad)"
            stroke-width="3"
            stroke-linecap="round"
            fill="none"
            pathLength="100"
          />
          <defs>
            <linearGradient id="processLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffa500" stop-opacity="1" />
              <stop offset="50%" stop-color="#ff6b35" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#ff4500" stop-opacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        <!-- Step cards -->
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="process__step"
        >
          <!--
            Inner — holds bg + content. Clipped via clip-path
            to create the left→right wipe reveal.
          -->
          <div
            class="process__step-inner"
            :ref="el => stepInnerRefs[i] = el as HTMLElement"
          >
            <div class="process__step-content">
              <span class="process__step-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="process__step-title">{{ step.title }}</h3>
              <p class="process__step-desc">{{ step.desc }}</p>
            </div>
          </div>

          <!--
            Glow edge — amber vertical light line. Sits OUTSIDE the
            clipped inner so it's always visible.

            Fix: edge now uses the SAME duration + ease as the clip-path
            so it tracks the reveal boundary exactly. No more running
            ahead of the content it's supposed to be revealing.
          -->
          <div
            class="process__step-edge"
            :ref="el => stepEdgeRefs[i] = el as HTMLElement"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EASE } from '~/composables/useAnimations'
import { usePerformanceMetrics } from '~/composables/usePerformanceMetrics'

gsap.registerPlugin(ScrollTrigger)

// ─── Refs ───
const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const timelineRef = ref<HTMLElement | null>(null)
const pathRef = ref<SVGPathElement | null>(null)
const stepInnerRefs = ref<(HTMLElement | null)[]>([])
const stepEdgeRefs = ref<(HTMLElement | null)[]>([])

const { prefersReducedMotion } = usePerformanceMetrics()

let ctx: gsap.Context | null = null

// ─── Step data ───
const steps = [
  {
    title: 'The \'Why\' & The \'Feel\'',
    desc: 'This is the foundation. I explore the core story, the audience, and the key emotion I want to evoke. This guiding star informs every creative decision, whether it\'s for a website, an animation, or an illustration.',
  },
  {
    title: 'Ideation & Experimentation',
    desc: 'This is where the magic happens. Sometimes I map out a clear plan. Other times, I dive straight in and experiment. This is my \'play\' phase — using illustration, 3D, or design to find the perfect visual and emotional direction.',
  },
  {
    title: 'Creation & Production',
    desc: 'This is the \'how.\' I bring the concept to life. Whether it\'s developing in Vue and GSAP, animating in Blender, or editing in CapCut, this is where the static idea becomes a living, moving experience.',
  },
  {
    title: 'Polish & Launch',
    desc: 'The final 10% that makes all the difference. I focus on polishing the small details, optimizing performance, and ensuring the final piece feels cohesive, impactful, and emotionally resonant across all devices.',
  },
]

// ─── Reduced motion fallback ───
function showAll() {
  stepInnerRefs.value.forEach((el) => {
    if (el) el.style.clipPath = 'inset(0 0% 0 0)'
  })
  stepEdgeRefs.value.forEach((el) => {
    if (el) el.style.opacity = '0'
  })
  if (pathRef.value) {
    pathRef.value.style.strokeDasharray = '100'
    pathRef.value.style.strokeDashoffset = '0'
  }
}

// ─── Animation setup ───
onMounted(() => {
  if (prefersReducedMotion.value) {
    showAll()
    return
  }

  if (!sectionRef.value) return

  ctx = gsap.context(() => {
    /* ── Header entrance ── */
    if (headerRef.value) {
      gsap.from(headerRef.value, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: EASE.signature,
        scrollTrigger: {
          trigger: headerRef.value,
          start: 'top 88%',
          end: 'top 55%',
          scrub: 0.5,
        },
      })
    }

    /* ── SVG line draw ──
       stroke-dashoffset 100→0 over the full timeline scroll.
       Signature ease: fast start that decelerates —
       pen drawing with natural hand momentum.
    */
    if (pathRef.value && timelineRef.value) {
      gsap.set(pathRef.value, {
        strokeDasharray: 100,
        strokeDashoffset: 100,
      })

      gsap.to(pathRef.value, {
        strokeDashoffset: 0,
        ease: EASE.signature,
        scrollTrigger: {
          trigger: timelineRef.value,
          start: 'top 75%',
          end: 'bottom 20%',
          scrub: 0.5,
        },
      })
    }

    /* ── Card glow-wipe reveals ──
       FIX: The glow edge now uses the SAME duration and ease as the
       clip-path reveal. This means the edge sits exactly at the
       boundary of the wipe — never running ahead of the content.

       Old behavior: edge at 50% left when clip was only 30% open.
       New behavior: edge left% === clip reveal% at every frame.
    */
    stepInnerRefs.value.forEach((inner, i) => {
      if (!inner) return
      const edge = stepEdgeRefs.value[i]
      const wrapper = inner.parentElement

      // Start clipped — fully hidden from the right
      gsap.set(inner, { clipPath: 'inset(0 100% 0 0)' })

      // Edge starts invisible at left=0
      if (edge) {
        gsap.set(edge, { left: '0%', opacity: 0 })
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 0.3,
        },
      })

      // Wipe reveal — clip opens left to right
      tl.to(inner, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1,
        ease: EASE.signature,
      }, 0)

      if (edge) {
        // Edge sweeps in perfect sync with the clip boundary
        // Same duration + ease = same position at every frame
        tl.to(edge, {
          left: '100%',
          duration: 1,
          ease: EASE.signature,
        }, 0)

        // Quick fade in — edge appears as the wipe starts
        tl.to(edge, {
          opacity: 0.9,
          duration: 0.08,
          ease: EASE.smooth,
        }, 0)

        // Fade out at the tail — edge dissolves as the card is fully revealed
        tl.to(edge, {
          opacity: 0,
          duration: 0.12,
          ease: EASE.smooth,
        }, 0.88)
      }
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  ctx = null
})
</script>

<style scoped>
/* ─── Section ───
   No overlay anymore — the shader itself handles
   the darkened color for this section via index.vue.
*/
.process {
  position: relative;
  width: 100%;
  min-height: 100dvh;
  padding: clamp(5rem, 10vw, 9rem) clamp(1.5rem, 5vw, 3rem);
  display: flex;
  justify-content: center;
  background: transparent;
  z-index: 1;
}

/* ─── Inner layout ─── */
.process__inner {
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(3rem, 6vw, 5rem);
  position: relative;
  z-index: 2;
}

/* ─── Header ─── */
.process__header {
  text-align: center;
  max-width: 700px;
}

.process__title {
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 900;
  font-family: var(--font-panchang, sans-serif);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 1rem;
  /* Gold gradient heading */
  background: linear-gradient(135deg, #ffae00, #ff6b35, #ffae00);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: processGradShift 6s var(--ease-float) infinite;
}

@keyframes processGradShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.process__subtitle {
  font-size: clamp(0.95rem, 1.8vw, 1.1rem);
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.8;
  margin: 0;
}

/* ─── Timeline container ─── */
.process__timeline {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(3rem, 5vw, 5rem);
}

/* ─── SVG line overlay ─── */
.process__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  overflow: visible;
  /* Soft amber glow around the drawn line */
  filter: drop-shadow(0 0 6px rgba(255, 165, 0, 0.4))
          drop-shadow(0 0 14px rgba(255, 69, 0, 0.15));
  opacity: 0.6;
}

/* ─── Step card wrapper ─── */
.process__step {
  position: relative;
  width: 100%;
  /* Cards above SVG where they overlap */
  z-index: 5;
}

/* ─── Inner (clipped content) ─── */
.process__step-inner {
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(255, 174, 0, 0.06) 0%,
    rgba(255, 69, 0, 0.02) 100%
  );
  border: 1px solid rgba(255, 174, 0, 0.12);
  border-radius: 12px;
  overflow: hidden;
  /* Initial state — fully clipped. GSAP overrides. */
  clip-path: inset(0 100% 0 0);
  transition: border-color 0.4s var(--ease-float);
}

.process__step-inner:hover {
  border-color: rgba(255, 174, 0, 0.3);
}

/* ─── Content inside the card ─── */
.process__step-content {
  position: relative;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  padding-right: clamp(4rem, 8vw, 6rem);
}

.process__step-num {
  position: absolute;
  top: clamp(1rem, 2vw, 1.5rem);
  right: clamp(1rem, 2vw, 1.5rem);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 900;
  font-family: var(--font-panchang, sans-serif);
  background: linear-gradient(135deg, #ffae00, #ff4500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.15;
  line-height: 1;
  pointer-events: none;
  transition: opacity 0.4s var(--ease-float);
}

.process__step:hover .process__step-num {
  opacity: 0.35;
}

.process__step-title {
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  font-weight: 700;
  margin: 0 0 0.75rem;
  color: rgba(255, 255, 255, 0.92);
}

.process__step-desc {
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
  margin: 0;
  max-width: 600px;
}

/* ─── Glow edge — sweeps in sync with clip reveal ─── */
.process__step-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  /* Vertical amber glow line */
  background: linear-gradient(
    to bottom,
    transparent 5%,
    rgba(255, 165, 0, 0.8) 25%,
    rgba(255, 200, 60, 0.95) 50%,
    rgba(255, 165, 0, 0.8) 75%,
    transparent 95%
  );
  box-shadow:
    0 0 12px rgba(255, 165, 0, 0.6),
    0 0 28px rgba(255, 100, 0, 0.3),
    0 0 50px rgba(255, 69, 0, 0.12);
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .process__step-content {
    padding-right: clamp(3rem, 6vw, 4rem);
  }

  .process__svg {
    opacity: 0.35;
  }
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .process__step-inner {
    clip-path: none !important;
  }

  .process__step-edge {
    display: none;
  }

  .process__svg path {
    stroke-dasharray: none !important;
    stroke-dashoffset: 0 !important;
  }

  .process__title {
    animation: none;
  }
}
</style>