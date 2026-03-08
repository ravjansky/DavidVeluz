<template>
  <section ref="sectionRef" class="who-am-i">
    <!--
      "DIVE IN" — the hook. Visible before reveal starts,
      fades + scales out as the user scrolls.
    -->
    <div
      class="who-am-i__cta"
      :style="{
        opacity: diveInOpacity,
        transform: `scale(${diveInScale})`,
      }"
      aria-hidden="true"
    >
      <span class="who-am-i__cta-label">DIVE IN</span>
    </div>

    <!--
      Glow ring — pink radial gradient overlay sitting at
      the current reveal edge. Fades in as reveal starts,
      fades out as the circle nears full size.
    -->
    <div
      class="who-am-i__glow"
      :style="{
        background: glowGradient,
        opacity: glowOpacity,
      }"
    />

    <!--
      Reveal layer — radial mask-image with ripple-edge bands.
      Desktop: alternating alpha stops create a water-drop distortion feel.
      Mobile/low-end: simple soft edge, same concept, lighter GPU load.
    -->
    <div
      class="who-am-i__reveal"
      :style="{
        maskImage: revealMask,
        WebkitMaskImage: revealMask,
        visibility: progress > 0.005 ? 'visible' : 'hidden',
      }"
    >
      <div class="who-am-i__card">
        <h2 class="who-am-i__heading">
          Hi! I'm David Veluz
        </h2>
        <p class="who-am-i__tagline">
          Creative Developer &amp; Designer
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, inject } from 'vue'
import type { Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePerformanceMetrics } from '~/composables/usePerformanceMetrics'

gsap.registerPlugin(ScrollTrigger)

// ─── Refs ───
const sectionRef = ref<HTMLElement | null>(null)
const progress = ref(0)

// ─── Performance gates ───
const { canRunHeavyAnimations, prefersReducedMotion } = usePerformanceMetrics()

// Loader readiness — pin won't fire until layout is stable
const isAppReady = inject<Ref<boolean>>('isAppReady', ref(true))

let st: ScrollTrigger | null = null

// ─── Derived visuals ───

// "DIVE IN" burns out in the first ~35% of scroll
const diveInOpacity = computed(() => Math.max(0, 1 - progress.value * 3))
const diveInScale = computed(() => 1 + progress.value * 0.12)

// Reveal circle radius — 0 → 58% of radial gradient extent
// 58% is enough to fully uncover the card on all aspect ratios
const radius = computed(() => progress.value * 58)

// Ripple-edge mask — the secret sauce
const revealMask = computed(() => {
  const r = radius.value
  if (r <= 0) return 'none'

  // Full ripple: alternating opacity bands at the mask edge
  // Creates a water-ring distortion without canvas or SVG
  if (canRunHeavyAnimations.value) {
    return `radial-gradient(circle at 50% 50%,
      #000 ${r}%,
      rgba(0,0,0,0.55) ${r + 0.8}%,
      rgba(0,0,0,0.10) ${r + 1.8}%,
      rgba(0,0,0,0.32) ${r + 3.0}%,
      rgba(0,0,0,0.06) ${r + 4.5}%,
      rgba(0,0,0,0.14) ${r + 6.0}%,
      rgba(0,0,0,0.03) ${r + 7.5}%,
      transparent ${r + 9.0}%
    )`
  }

  // Soft fallback — one gentle fade ring
  return `radial-gradient(circle at 50% 50%,
    #000 ${r}%,
    rgba(0,0,0,0.2) ${r + 2.5}%,
    transparent ${r + 5.0}%
  )`
})

// Pink glow ring — radial gradient at the same edge
const glowGradient = computed(() => {
  const r = radius.value
  return `radial-gradient(circle at 50% 50%,
    transparent ${Math.max(0, r - 1.5)}%,
    rgba(255, 20, 147, 0.30) ${r + 0.5}%,
    rgba(255, 20, 147, 0.08) ${r + 4.0}%,
    transparent ${r + 8.0}%
  )`
})

// Glow fades in at start, fades out near the end so it
// doesn't linger after the reveal completes
const glowOpacity = computed(() => {
  if (progress.value < 0.03) return 0
  if (progress.value > 0.82) return Math.max(0, (1 - progress.value) * 5.5)
  return 1
})

// ─── Pin setup ───

function createPin() {
  if (!sectionRef.value || st) return

  if (prefersReducedMotion.value) {
    // No pin, no scroll animation — just show the content
    progress.value = 1
    return
  }

  st = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: '+=100%',      // 1 viewport-height of scroll distance
    pin: true,
    scrub: 0.5,         // smooth link — no jank, slight cinematic lag
    anticipatePin: 1,   // pre-compensates for Lenis inertia jump
    onUpdate: (self) => {
      progress.value = self.progress
    },
  })
}

// Defer pin creation until the intro loader is gone and layout is settled.
// This prevents the pin spacer from miscalculating (which caused the old
// white-space-below-the-section bug and the overshoot on first scroll).
watch(isAppReady, (ready) => {
  if (ready) {
    requestAnimationFrame(() => {
      createPin()
      ScrollTrigger.refresh()
    })
  }
}, { immediate: true })

onMounted(() => {
  // Safety net: return visitors skip the loader, so isAppReady is true
  // before this component mounts. Catch that case.
  if (isAppReady.value && !st) {
    createPin()
  }
})

onUnmounted(() => {
  st?.kill()
  st = null
})
</script>

<style scoped>
/* ─── Section shell ─── */
.who-am-i {
  position: relative;
  width: 100%;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Transparent — liquid BG bleeds through */
  background: transparent;
  overflow: hidden;
}

/* ─── DIVE IN CTA ─── */
.who-am-i__cta {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
  /* Only opacity + transform — GPU-composited, no layout/paint */
  will-change: opacity, transform;
}

.who-am-i__cta-label {
  font-size: clamp(4rem, 10vw, 9rem);
  font-weight: 900;
  font-family: var(--font-panchang, sans-serif);
  letter-spacing: 0.05em;
  color: #fff;
  text-shadow: 0 0 60px rgba(255, 20, 147, 0.25);
}

/* ─── Glow ring overlay ─── */
.who-am-i__glow {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

/* ─── Masked reveal layer ─── */
.who-am-i__reveal {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ─── Content card ─── */
.who-am-i__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: clamp(2rem, 6vw, 5rem);
  /*
    Soft dark radial — gives the card shape and readability
    without a hard border. The liquid BG is still visible
    around the edges.
  */
  background: radial-gradient(
    ellipse at 50% 40%,
    rgba(10, 10, 20, 0.85) 0%,
    rgba(10, 10, 20, 0.55) 55%,
    transparent 100%
  );
  border-radius: 1.5rem;
  max-width: 800px;
  width: 90%;
}

.who-am-i__heading {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  font-family: var(--font-panchang, sans-serif);
  line-height: 1.1;
  margin: 0;
  background: linear-gradient(135deg, #ff1493, #ff69b4, #fff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.who-am-i__tagline {
  font-size: clamp(1rem, 2.2vw, 1.5rem);
  font-family: var(--font-melodrama, serif);
  font-style: italic;
  opacity: 0.55;
  margin: 1rem 0 0;
  letter-spacing: 0.06em;
}

/* ─── Reduced motion — skip the reveal, show content directly ─── */
@media (prefers-reduced-motion: reduce) {
  .who-am-i__cta,
  .who-am-i__glow {
    display: none;
  }

  .who-am-i__reveal {
    mask-image: none !important;
    -webkit-mask-image: none !important;
    visibility: visible !important;
  }
}
</style>