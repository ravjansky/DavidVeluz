<template>
  <div
    v-if="isVisible"
    class="intro-loader"
    :class="{ 'intro-loader--exiting': isExiting }"
  >
    <button
      class="intro-loader__trigger"
      :disabled="!isReady"
      :aria-label="isReady ? 'Click anywhere to enter the site' : 'Loading site...'"
      @click="dismiss"
    >
      <!-- Side accent lines -->
      <div class="intro-loader__line intro-loader__line--left" />
      <div class="intro-loader__line intro-loader__line--right" />

      <!-- 2×2 Grid -->
      <div class="intro-loader__grid">
        <!-- Top-left: Name ticker -->
        <div class="intro-loader__cell intro-loader__cell--name">
          <h1 class="intro-loader__h1">
            <span class="intro-loader__ticker">
              <span
                v-for="(letter, i) in nameLetters"
                :key="i"
                class="intro-loader__letter"
                :style="{ animationDelay: `${i * 0.3}s` }"
              >{{ letter }}</span>
            </span>
            <span class="sr-only">David Veluz</span>
          </h1>
        </div>

        <!-- Top-right: empty -->
        <div class="intro-loader__cell" />

        <!-- Bottom-left: empty -->
        <div class="intro-loader__cell" />

        <!-- Bottom-right: Progress counter -->
        <div class="intro-loader__cell intro-loader__cell--progress">
          <div class="intro-loader__progress-wrap">
            <span class="intro-loader__percent">{{ displayProgress }}</span>
          </div>
        </div>
      </div>

      <!-- Click prompt — fades in when ready -->
      <p v-if="isReady" class="intro-loader__prompt">
        Click anywhere to enter
      </p>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{ dismissed: [] }>()

const nameLetters = ['D', 'A', 'V', 'I', 'D', '\u00A0', 'V', 'E', 'L', 'U', 'Z']

const isVisible = ref(true)
const isReady = ref(false)
const isExiting = ref(false)
const displayProgress = ref(0)

let progressInterval: ReturnType<typeof setInterval> | null = null
let minTimerDone = false
let loadDone = false

function checkReady() {
  if (minTimerDone && loadDone && displayProgress.value >= 100) {
    isReady.value = true
  }
}

function dismiss() {
  if (!isReady.value) return

  isExiting.value = true

  // Exit animation duration matches CSS
  setTimeout(() => {
    document.body.classList.remove('scroll-locked')
    isVisible.value = false

    try {
      localStorage.setItem('dv_visited', 'true')
    } catch {
      // Storage blocked — no-op
    }

    emit('dismissed')
  }, 900)
}

onMounted(() => {
  // Skip loader on return visits
  let hasVisited = false
  try {
    hasVisited = localStorage.getItem('dv_visited') === 'true'
  } catch {
    // Storage blocked — treat as first visit
  }

  if (hasVisited) {
    isVisible.value = false
    emit('dismissed')
    return
  }

  // Lock scroll during loader
  document.body.classList.add('scroll-locked')

  // Minimum display time — gives the ticker animation time to land
  setTimeout(() => {
    minTimerDone = true
    checkReady()
  }, 2000)

  // Track page load state
  if (document.readyState === 'complete') {
    loadDone = true
  } else {
    window.addEventListener('load', () => {
      loadDone = true
      checkReady()
    }, { once: true })
  }

  // Simulated progress counter
  let target = 0
  progressInterval = setInterval(() => {
    if (loadDone) {
      target = 100
    } else if (document.readyState === 'interactive') {
      target = Math.max(target, 70)
    } else {
      target = Math.max(target, 30)
    }

    const diff = target - displayProgress.value
    const step = Math.max(1, Math.ceil(diff * 0.15))
    displayProgress.value = Math.min(100, displayProgress.value + step)

    if (displayProgress.value >= 100) {
      if (progressInterval) clearInterval(progressInterval)
      checkReady()
    }
  }, 40)
})

onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval)
  document.body.classList.remove('scroll-locked')
})
</script>

<style scoped>
/* ─── Container ─── */
.intro-loader {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background-color: #C5A55A;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-loader--exiting {
  animation: loaderFadeOut 0.9s var(--ease-signature) forwards;
}

@keyframes loaderFadeOut {
  to { opacity: 0; }
}

/* ─── Full-screen trigger button ─── */
.intro-loader__trigger {
  all: unset;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-loader__trigger:disabled {
  cursor: wait;
}

/* ─── Grid ─── */
.intro-loader__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: min(80vw, 600px);
  height: min(60vh, 400px);
}

.intro-loader__cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-loader__cell--name {
  align-items: flex-end;
  justify-content: flex-start;
  padding-bottom: 1.5rem;
}

.intro-loader__cell--progress {
  align-items: flex-start;
  justify-content: flex-end;
  padding-top: 1.5rem;
}

/* ─── Ticker ─── */
.intro-loader__h1 {
  margin: 0;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  color: #1a1400;
  line-height: 1;
  font-family: var(--font-panchang, sans-serif);
}

.intro-loader__ticker {
  display: block;
  position: relative;
  height: 1.2em;
  width: 0.8em;
  overflow: hidden;
}

.intro-loader__letter {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset: 0;
  animation: tickerCycle 3.3s var(--ease-signature) infinite;
  opacity: 0;
}

@keyframes tickerCycle {
  0%    { transform: translateY(110%); opacity: 0; }
  2%    { opacity: 1; }
  3.5%  { transform: translateY(0%);   opacity: 1; }
  5.5%  { transform: translateY(0%);   opacity: 1; }
  8%    { opacity: 1; }
  9.09% { transform: translateY(-110%); opacity: 0; }
  100%  { transform: translateY(-110%); opacity: 0; }
}

/* ─── Progress number ─── */
.intro-loader__progress-wrap {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  color: #1a1400;
  font-family: var(--font-panchang, sans-serif);
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  height: 1.2em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 3ch;
}

/* ─── Side lines ─── */
.intro-loader__line {
  position: absolute;
  top: 10%;
  bottom: 10%;
  width: 1px;
  background-color: #1a1400;
  transform-origin: center top;
  animation: lineIn 0.8s var(--ease-signature) forwards;
}

.intro-loader__line--left  { left: min(8vw, 80px); }
.intro-loader__line--right { right: min(8vw, 80px); }

@keyframes lineIn {
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
}

.intro-loader--exiting .intro-loader__line {
  animation: lineOut 0.6s var(--ease-signature) forwards;
}

@keyframes lineOut {
  from { transform: scaleY(1); }
  to   { transform: scaleY(0); }
}

/* ─── Enter prompt ─── */
.intro-loader__prompt {
  position: absolute;
  bottom: min(10vh, 60px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #1a1400;
  opacity: 0;
  animation: promptFadeIn 0.8s var(--ease-signature) 0.2s forwards;
  font-family: var(--font-satoshi, sans-serif);
}

@keyframes promptFadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to   { opacity: 0.6; transform: translateX(-50%) translateY(0); }
}

/* ─── SR-only ─── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>