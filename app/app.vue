<template>
  <IntroLoader v-if="showLoader" @dismissed="onLoaderDismissed" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, readonly } from 'vue'

console.log('[App] Setup started')
const showLoader = ref(true)
const isAppReady = ref(false)

function onLoaderDismissed() {
  console.log('[App] Loader dismissed')
  showLoader.value = false
  isAppReady.value = true
  console.log('[App] isAppReady set to true')
}

provide('isAppReady', readonly(isAppReady))

onMounted(() => {
  console.log('[App] onMounted fired')
  // Check for return visitor — skip loader immediately
  let hasVisited = false
  try {
    hasVisited = localStorage.getItem('dv_visited') === 'true'
    console.log('[App] localStorage check - hasVisited:', hasVisited)
  } catch (e) {
    // Storage blocked
    console.warn('[App] localStorage unavailable:', e)
  }

  if (hasVisited) {
    console.log('[App] Returning visitor detected, skipping loader')
    showLoader.value = false
    isAppReady.value = true
  } else {
    console.log('[App] First time visitor, showing loader')
  }
})
</script>