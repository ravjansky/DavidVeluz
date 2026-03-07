<template>
  <IntroLoader v-if="showLoader" @dismissed="onLoaderDismissed" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showLoader = ref(true)
const isAppReady = ref(false)

function onLoaderDismissed() {
  showLoader.value = false
  isAppReady.value = true
}

provide('isAppReady', readonly(isAppReady))

onMounted(() => {
  // Check for return visitor — skip loader immediately
  let hasVisited = false
  try {
    hasVisited = localStorage.getItem('dv_visited') === 'true'
  } catch {
    // Storage blocked
  }

  if (hasVisited) {
    showLoader.value = false
    isAppReady.value = true
  }
})
</script>