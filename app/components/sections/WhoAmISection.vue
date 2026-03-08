<template>
  <section ref="sectionRef" class="who-am-i">
    <!--
      "DIVE IN" — fades + scales out as the user scrolls.
      Text shadow shifts warm/cool based on scroll direction.
    -->
    <div
      class="who-am-i__cta"
      :style="{
        opacity: diveInOpacity,
        transform: `scale(${diveInScale})`,
      }"
      aria-hidden="true"
    >
      <span
        class="who-am-i__cta-label"
        :style="{ textShadow: ctaTextShadow }"
      >DIVE IN</span>
    </div>

    <!--
      Glow ring — radial gradient at the reveal edge.
      Color shifts based on entry direction:
      Forward = blue ring, Reverse = warm amber ring.
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
      Mask is pure alpha — works with any liquid BG color.
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

// ─── Loader readiness ───
const isAppReady = inject<Ref<boolean>>('isAppReady', ref(true))

// ─── Liquid BG control ───
type SetColorFn = (r: number, g: number, b: number, duration?: number, blend?: number) => void
const setBackgroundColor = inject<SetColorFn | null>('setBackgroundColor', null)

let st: ScrollTrigger | null = null

// ─── Direction tracking ───
// Locked on entry — doesn't flip on momentary scroll jitter mid-pin.
// Only changes when entering/re-entering the pin zone.
const entryDirection = ref<'forward' | 'reverse'>('forward')
const isForward = computed(() => entryDirection.value === 'forward')

// ─── Color systems ───
// Forward: warm pink (hero handoff) → corporate blue
const FWD_FROM  = [0.9, 0.2, 0.2] as const
const FWD_TO    = [0.05, 0.25, 0.7] as const
const FWD_BLEND = [0.6, 0.65] as const  // [from, to]

// Reverse: teal (entered from below) → warm amber (exiting up)
const REV_FROM  = [0.15, 0.45, 0.5] as const   // at progress=1
const REV_TO    = [0.6, 0.3, 0.12] as const     // at progress=0
const REV_BLEND = [0.55, 0.6] as const

/*
  Color dead zone threshold.

  FIX: The original code changed shader color at progress=0, which
  caused a visible snap the instant the section pinned — even before
  the mask opened. Now we hold the hero's color until the mask has
  visibly opened (~3% progress). This makes the pin feel seamless.
*/
const COLOR_START_THRESHOLD = 0.03

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// ─── Derived visuals ───
const diveInOpacity = computed(() => Math.max(0, 1 - progress.value * 3))
const diveInScale = computed(() => 1 + progress.value * 0.12)

const ctaTextShadow = computed(() =>
  isForward.value
    ? '0 0 60px rgba(40, 120, 255, 0.3)'
    : '0 0 60px rgba(255, 165, 60, 0.3)',
)

const radius = computed(() => progress.value * 58)

// Ripple mask — pure alpha, no color dependency
const revealMask = computed(() => {
  const r = radius.value
  if (r <= 0) return 'none'

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

  return `radial-gradient(circle at 50% 50%,
    #000 ${r}%,
    rgba(0,0,0,0.2) ${r + 2.5}%,
    transparent ${r + 5.0}%
  )`
})

// Glow ring — direction-aware color
const glowGradient = computed(() => {
  const r = radius.value

  const glowColor = isForward.value
    ? { main: 'rgba(40, 120, 255, 0.35)', fade: 'rgba(30, 80, 200, 0.10)' }
    : { main: 'rgba(255, 165, 60, 0.35)', fade: 'rgba(200, 120, 30, 0.10)' }

  return `radial-gradient(circle at 50% 50%,
    transparent ${Math.max(0, r - 1.5)}%,
    ${glowColor.main} ${r + 0.5}%,
    ${glowColor.fade} ${r + 4.0}%,
    transparent ${r + 8.0}%
  )`
})

const glowOpacity = computed(() => {
  if (progress.value < 0.03) return 0
  if (progress.value > 0.82) return Math.max(0, (1 - progress.value) * 5.5)
  return 1
})

// ─── Progressive BG color shift ───
// FIX: Remap progress so color lerp only starts AFTER the mask opens.
// Below the threshold, shader stays at whatever color the hero left it.
watch(progress, (p) => {
  if (!setBackgroundColor || prefersReducedMotion.value) return

  // Dead zone — don't touch the shader color during initial pin.
  // The mask isn't open yet so any color change is visible and jarring.
  if (p < COLOR_START_THRESHOLD) return

  // Remap p so that COLOR_START_THRESHOLD..1 → 0..1
  const remapped = (p - COLOR_START_THRESHOLD) / (1 - COLOR_START_THRESHOLD)

  const startColor = isForward.value ? FWD_FROM : REV_TO
  const endColor   = isForward.value ? FWD_TO : REV_FROM
  const startBlend = isForward.value ? FWD_BLEND[0] : REV_BLEND[1]
  const endBlend   = isForward.value ? FWD_BLEND[1] : REV_BLEND[0]

  setBackgroundColor(
    lerp(startColor[0], endColor[0], remapped),
    lerp(startColor[1], endColor[1], remapped),
    lerp(startColor[2], endColor[2], remapped),
    0,
    lerp(startBlend, endBlend, remapped),
  )
})

// ─── Pin setup ───
function createPin() {
  if (!sectionRef.value || st) return

  if (prefersReducedMotion.value) {
    progress.value = 1
    return
  }

  st = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: '+=100%',
    pin: true,
    scrub: 0.5,
    anticipatePin: 1,
    // Lock direction on entry — stable through the entire pin
    onEnter: () => { entryDirection.value = 'forward' },
    onEnterBack: () => { entryDirection.value = 'reverse' },
    onUpdate: (self) => {
      progress.value = self.progress
    },
  })
}

watch(isAppReady, (ready) => {
  if (ready) {
    requestAnimationFrame(() => {
      createPin()
      ScrollTrigger.refresh()
    })
  }
}, { immediate: true })

onMounted(() => {
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
}

.who-am-i__cta-label {
  font-size: clamp(4rem, 10vw, 9rem);
  font-weight: 900;
  font-family: var(--font-panchang, sans-serif);
  letter-spacing: 0.05em;
  color: #fff;
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
  background: radial-gradient(
    ellipse at 50% 40%,
    rgba(10, 10, 30, 0.85) 0%,
    rgba(10, 15, 40, 0.55) 55%,
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
  background: linear-gradient(135deg, #2878ff, #60a5fa, #e0e8ff);
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

/* ─── Reduced motion ─── */
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