<template>
  <div ref="loaderRef" class="intro-loader" @click="dismiss">
    <!-- OrganicSilkBackground — CSS gradients + SVG bezier folds -->
    <div class="intro-loader__silk">
      <svg class="intro-loader__lines" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M-80 320 C 200 180, 500 520, 760 340 S 1100 160, 1520 380" stroke="hsla(0, 50%, 35%, 0.8)" stroke-width="1.2" />
        <path d="M-40 400 C 180 280, 420 580, 700 420 S 1020 240, 1500 460" stroke="hsla(350, 45%, 30%, 0.7)" stroke-width="0.8" />
        <path d="M-100 500 C 250 340, 480 640, 780 480 S 1080 300, 1540 540" stroke="hsla(5, 50%, 38%, 0.9)" stroke-width="1.5" />
        <path d="M-60 260 C 300 140, 550 460, 820 300 S 1140 120, 1560 320" stroke="hsla(345, 40%, 28%, 0.6)" stroke-width="0.6" />
        <path d="M-20 580 C 220 440, 460 720, 740 560 S 1060 380, 1480 600" stroke="hsla(10, 45%, 40%, 0.7)" stroke-width="1.0" />
        <path d="M-90 180 C 280 80, 530 380, 800 220 S 1120 60, 1520 240" stroke="hsla(355, 42%, 32%, 0.6)" stroke-width="0.7" />
        <path d="M-50 650 C 200 520, 490 780, 760 620 S 1090 440, 1500 680" stroke="hsla(0, 48%, 36%, 0.8)" stroke-width="1.3" />
        <path d="M-70 440 C 240 320, 510 600, 790 440 S 1110 260, 1540 480" stroke="hsla(340, 38%, 26%, 0.6)" stroke-width="0.9" />
        <path d="M-30 360 C 190 240, 440 540, 720 380 S 1050 200, 1480 420" stroke="hsla(8, 52%, 37%, 0.5)" stroke-width="0.5" />
        <path d="M-80 420 C 210 300, 460 580, 740 420 S 1070 240, 1500 460" stroke="hsla(352, 44%, 30%, 0.7)" stroke-width="1.1" />
      </svg>
      <svg class="intro-loader__lines intro-loader__lines--deep" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M-80 320 C 200 180, 500 520, 760 340 S 1100 160, 1520 380" stroke="hsla(0, 50%, 35%, 0.8)" stroke-width="1.2" />
        <path d="M-40 400 C 180 280, 420 580, 700 420 S 1020 240, 1500 460" stroke="hsla(350, 45%, 30%, 0.7)" stroke-width="0.8" />
        <path d="M-100 500 C 250 340, 480 640, 780 480 S 1080 300, 1540 540" stroke="hsla(5, 50%, 38%, 0.9)" stroke-width="1.5" />
        <path d="M-60 260 C 300 140, 550 460, 820 300 S 1140 120, 1560 320" stroke="hsla(345, 40%, 28%, 0.6)" stroke-width="0.6" />
        <path d="M-20 580 C 220 440, 460 720, 740 560 S 1060 380, 1480 600" stroke="hsla(10, 45%, 40%, 0.7)" stroke-width="1.0" />
        <path d="M-90 180 C 280 80, 530 380, 800 220 S 1120 60, 1520 240" stroke="hsla(355, 42%, 32%, 0.6)" stroke-width="0.7" />
        <path d="M-50 650 C 200 520, 490 780, 760 620 S 1090 440, 1500 680" stroke="hsla(0, 48%, 36%, 0.8)" stroke-width="1.3" />
        <path d="M-70 440 C 240 320, 510 600, 790 440 S 1110 260, 1540 480" stroke="hsla(340, 38%, 26%, 0.6)" stroke-width="0.9" />
        <path d="M-30 360 C 190 240, 440 540, 720 380 S 1050 200, 1480 420" stroke="hsla(8, 52%, 37%, 0.5)" stroke-width="0.5" />
        <path d="M-80 420 C 210 300, 460 580, 740 420 S 1070 240, 1500 460" stroke="hsla(352, 44%, 30%, 0.7)" stroke-width="1.1" />
      </svg>
    </div>

    <!-- Iridescent sheen overlays -->
    <div class="intro-loader__sheen intro-loader__sheen--warm" />
    <div class="intro-loader__sheen intro-loader__sheen--cool" />

    <!-- Center content -->
    <div class="intro-loader__center">
      <!-- DV monogram with rising fill -->
      <svg
        class="intro-loader__dv"
        viewBox="0 0 1400 150"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="DV"
      >
        <defs>
          <linearGradient id="dv-fill-gradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#a70000" />
            <stop offset="100%" stop-color="#ff5252" />
          </linearGradient>
          <clipPath id="dv-text-clip">
            <text
              x="700" y="80"
              style="font-family:'Panchang',sans-serif;font-size:110px;font-weight:700;text-anchor:middle;dominant-baseline:middle;letter-spacing:-.05em"
            >DV</text>
          </clipPath>
        </defs>
        <!-- Subtle outline visible before fill -->
        <text
          x="700" y="80"
          class="intro-loader__dv-outline"
          style="font-family:'Panchang',sans-serif;font-size:110px;font-weight:700;text-anchor:middle;dominant-baseline:middle;letter-spacing:-.05em"
        >DV</text>
        <!-- Rising fill rect clipped to DV shape -->
        <rect
          ref="fillRectRef"
          clip-path="url(#dv-text-clip)"
          x="0" y="150" width="1400" height="150"
          fill="url(#dv-fill-gradient)"
        />
      </svg>

      <!-- Hop Right In button -->
      <button
        ref="ctaRef"
        class="intro-loader__cta"
        :class="{ 'intro-loader__cta--visible': canDismiss }"
        @click.stop="dismiss"
      >
        Hop Right In
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { gsap } from 'gsap'
import { EASE } from '~/composables/useAnimations'

const emit = defineEmits<{ dismissed: [] }>()

// ─── Refs ───
const loaderRef = ref<HTMLElement | null>(null)
const fillRectRef = ref<SVGRectElement | null>(null)
const ctaRef = ref<HTMLButtonElement | null>(null)

// ─── State ───
const pageReady = ref(false)
const fillComplete = ref(false)
const dismissed = ref(false)
const canDismiss = computed(() => pageReady.value && fillComplete.value)

// ─── Page load tracking ───
function trackPageLoad(): Promise<void> {
  return new Promise((resolve) => {
    const finish = () => {
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => resolve())
      } else {
        resolve()
      }
    }

    if (document.readyState === 'complete') {
      finish()
      return
    }

    const check = () => {
      if (document.readyState === 'complete') {
        document.removeEventListener('readystatechange', check)
        finish()
      }
    }
    document.addEventListener('readystatechange', check)
  })
}

onMounted(async () => {
  // Lock scroll during loading
  document.body.classList.add('scroll-locked')

  // Wait for fonts before starting fill (Panchang needed for SVG clipPath)
  if (document.fonts?.ready) {
    await document.fonts.ready
  }

  // Start fill animation
  if (fillRectRef.value) {
    gsap.to(fillRectRef.value, {
      attr: { y: 0 },
      duration: 2.5,
      ease: EASE.smooth,
      onComplete: () => {
        fillComplete.value = true
      },
    })
  }

  // Track page readiness in parallel
  await trackPageLoad()
  pageReady.value = true
})

// Show CTA when ready
watch(canDismiss, (ready) => {
  if (ready && ctaRef.value) {
    gsap.fromTo(ctaRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: EASE.signature },
    )
  }
})

function dismiss() {
  if (!canDismiss.value || dismissed.value) return
  dismissed.value = true

  // Set visited flag
  try {
    localStorage.setItem('dv_visited', 'true')
  } catch { /* silent */ }

  // Animate out
  gsap.to(loaderRef.value, {
    opacity: 0,
    duration: 0.6,
    ease: EASE.smooth,
    onComplete: () => {
      document.body.classList.remove('scroll-locked')
      emit('dismissed')
    },
  })
}
</script>

<style scoped>
/* ─── Fullscreen overlay ─── */
.intro-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  background:
    radial-gradient(ellipse 80% 60% at 30% 40%, hsla(0, 45%, 20%, 1) 0%, transparent 70%),
    radial-gradient(ellipse 70% 50% at 75% 55%, hsla(350, 35%, 18%, 0.8) 0%, transparent 65%),
    radial-gradient(ellipse 90% 70% at 50% 50%, hsla(5, 40%, 22%, 0.6) 0%, transparent 80%),
    linear-gradient(160deg, hsl(0, 35%, 14%) 0%, hsl(350, 30%, 12%) 50%, hsl(5, 30%, 16%) 100%);
}

/* ─── SVG line layers (silk folds) ─── */
.intro-loader__silk {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.intro-loader__lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.38;
  mix-blend-mode: soft-light;
}

.intro-loader__lines--deep {
  opacity: 0.25;
  mix-blend-mode: overlay;
  transform: scaleX(-1) scaleY(-1);
}

/* ─── Iridescent sheens ─── */
.intro-loader__sheen {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.intro-loader__sheen--warm {
  background: radial-gradient(
    ellipse 50% 30% at 25% 35%,
    hsla(10, 50%, 30%, 0.25) 0%,
    transparent 70%
  );
}

.intro-loader__sheen--cool {
  background: radial-gradient(
    ellipse 45% 35% at 70% 60%,
    hsla(340, 40%, 25%, 0.2) 0%,
    transparent 65%
  );
}

/* ─── Center content ─── */
.intro-loader__center {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

/* ─── DV monogram SVG ─── */
.intro-loader__dv {
  width: clamp(200px, 40vw, 500px);
  height: auto;
}

.intro-loader__dv-outline {
  fill: none;
  stroke: rgba(255, 82, 82, 0.15);
  stroke-width: 1.5;
}

/* ─── CTA button ─── */
.intro-loader__cta {
  padding: 0.9rem 2.5rem;
  border: 1px solid rgba(255, 82, 82, 0.4);
  border-radius: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  font-family: var(--font-panchang, sans-serif);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition:
    border-color 0.3s var(--ease-float),
    background-color 0.3s var(--ease-float),
    color 0.3s var(--ease-float);
}

.intro-loader__cta--visible {
  pointer-events: auto;
}

.intro-loader__cta:hover {
  border-color: #ff5252;
  background: rgba(255, 82, 82, 0.12);
  color: #fff;
}

.intro-loader__cta:active {
  background: rgba(255, 82, 82, 0.2);
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .intro-loader__lines,
  .intro-loader__lines--deep {
    display: none;
  }
}
</style>
