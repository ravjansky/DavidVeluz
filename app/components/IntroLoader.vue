<template>
  <div ref="loaderRef" class="intro-loader">
    <div class="intro-loader__center">
      <svg class="intro-loader__dv" viewBox="0 0 1400 150" xmlns="http://www.w3.org/2000/svg" aria-label="DV">
        <defs>
          <linearGradient id="dv-fill-gradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#a70000" />
            <stop offset="100%" stop-color="#ff5252" />
          </linearGradient>
          <clipPath id="dv-text-clip">
            <text x="700" y="80" style="font-family:'Panchang',sans-serif;font-size:110px;font-weight:700;text-anchor:middle;dominant-baseline:middle;letter-spacing:-.05em">    DV  </text>
          </clipPath>
        </defs>
        
        <text x="700" y="80" class="intro-loader__dv-outline" style="font-family:'Panchang',sans-serif;font-size:110px;font-weight:700;text-anchor:middle;dominant-baseline:middle;letter-spacing:-.05em">    DV  </text>
        
        <rect
          ref="fillRectRef"
          clip-path="url(#dv-text-clip)"
          x="0" y="150" width="1400" height="150"
          fill="url(#dv-fill-gradient)"
        />
      </svg>
    </div>

    <button
      ref="ctaRef"
      class="intro-loader__overlay-btn"
      :class="{ 'intro-loader__overlay-btn--visible': canDismiss }"
      @click="dismiss"
    >
      <span class="intro-loader__overlay-text">Hop Right In</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { gsap } from 'gsap'
import { EASE } from '~/composables/useAnimations'

const emit = defineEmits<{ dismissed: [] }>()

const loaderRef = ref<HTMLElement | null>(null)
const fillRectRef = ref<SVGRectElement | null>(null)
const ctaRef = ref<HTMLButtonElement | null>(null)

const pageReady = ref(false)
const fillComplete = ref(false)
const dismissed = ref(false)
const canDismiss = computed(() => pageReady.value && fillComplete.value)

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
  document.body.classList.add('scroll-locked')

  if (document.fonts?.ready) {
    await document.fonts.ready
  }

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

  await trackPageLoad()
  pageReady.value = true
})

watch(canDismiss, (ready) => {
  if (ready && ctaRef.value) {
    gsap.to(ctaRef.value, { opacity: 1, duration: 0.8, ease: EASE.signature })
  }
})

function dismiss() {
  if (!canDismiss.value || dismissed.value) return
  dismissed.value = true

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
.intro-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
}

.intro-loader__center {
  position: relative;
  z-index: 1;
}

.intro-loader__dv {
  width: clamp(200px, 40vw, 500px);
  height: auto;
}

.intro-loader__dv-outline {
  fill: none;
  stroke: rgba(255, 82, 82, 0.15);
  stroke-width: 1.5;
}

.intro-loader__overlay-btn {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  border: none;
  color: #fff;
  font-family: var(--font-panchang, sans-serif);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.intro-loader__overlay-btn--visible {
  pointer-events: auto;
}

.intro-loader__overlay-text {
  padding: 1rem 2rem;
  border: 1px solid rgba(255, 82, 82, 0.4);
  transition: background-color 0.3s var(--ease-float), border-color 0.3s var(--ease-float);
}

.intro-loader__overlay-btn:hover .intro-loader__overlay-text {
  background: rgba(255, 82, 82, 0.15);
  border-color: #ff5252;
}
</style>