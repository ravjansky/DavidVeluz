<template>
  <Teleport to="body">
    <div v-if="isTransitioning" ref="transitionRef" class="page-transition">
      <div
        v-for="i in COLUMN_COUNT"
        :key="i"
        :ref="(el) => { if (el) columnEls[i - 1] = el as HTMLElement }"
        class="page-transition__column"
      />
      <div ref="labelRef" class="page-transition__label">
        {{ targetPageName }}
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EASE } from '~/composables/useAnimations'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps<{
  isAppReady: boolean
}>()

const COLUMN_COUNT = 5

const isTransitioning = ref(false)
const targetPageName = ref('')
const columnEls = ref<HTMLElement[]>([])
const labelRef = ref<HTMLElement | null>(null)
const transitionRef = ref<HTMLElement | null>(null)
const hasCompletedFirstLoad = ref(false)

const PAGE_NAMES: Record<string, string> = {
  index: 'Home',
  showcase: 'Showcase',
}

// Replace the watch block in the script setup with this:
watch(() => props.isAppReady, (ready) => {
  if (ready) {
    nextTick(() => { hasCompletedFirstLoad.value = true })
  }
}, { immediate: true })

async function playEnter(pageName: string): Promise<void> {
  if (!hasCompletedFirstLoad.value) return

  targetPageName.value = PAGE_NAMES[pageName] || pageName
  isTransitioning.value = true
  columnEls.value = []

  await nextTick()

  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve })

    // Columns slide in from bottom, staggered
    tl.fromTo(columnEls.value,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.5, stagger: 0.08, ease: EASE.signature },
    )

    // Label fades in
    if (labelRef.value) {
      tl.fromTo(labelRef.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: EASE.smooth },
        '-=0.2',
      )
    }
  })
}

async function playLeave(): Promise<void> {
  if (!isTransitioning.value) return

  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioning.value = false
        columnEls.value = []
        resolve()
      },
    })

    // Label fades out
    if (labelRef.value) {
      tl.to(labelRef.value,
        { opacity: 0, duration: 0.3, ease: EASE.smooth },
      )
    }

    // Columns slide out upward, staggered
    tl.to(columnEls.value,
      { yPercent: -100, duration: 0.5, stagger: 0.08, ease: EASE.signature },
      '-=0.1',
    )
  })
}

defineExpose({ playEnter, playLeave })
</script>

<style scoped>
.page-transition {
  position: fixed;
  inset: 0;
  z-index: 9000;
  display: flex;
  pointer-events: all;
}

.page-transition__column {
  flex: 1;
  height: 100%;
  background: #0a0a0c;
  transform: translateY(100%);
}

.page-transition__label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-panchang, sans-serif);
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.05em;
  opacity: 0;
  z-index: 1;
  pointer-events: none;
}
</style>
