<template>
  <IntroLoader v-if="showLoader" @dismissed="onLoaderDismissed" />
  <PageTransition ref="pageTransitionRef" :is-app-ready="isAppReady" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, provide, readonly, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const showLoader = ref(true)
const isAppReady = ref(false)

interface PageTransitionExposed {
  playEnter: (pageName: string) => Promise<void>
  playLeave: () => Promise<void>
}

const pageTransitionRef = ref<PageTransitionExposed | null>(null)

const router = useRouter()

function onLoaderDismissed() {
  showLoader.value = false
  isAppReady.value = true
}

provide('isAppReady', readonly(isAppReady))

router.beforeEach(async (to, from) => {
  if (!isAppReady.value) return true
  if (from.name === to.name) return true

  await pageTransitionRef.value?.playEnter(to.name as string)
  return true
})

router.afterEach(async () => {
  if (!isAppReady.value) return

  await nextTick()
  await pageTransitionRef.value?.playLeave()

  ScrollTrigger.refresh()
})
</script>