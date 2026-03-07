<template>
  <IntroLoader v-if="showLoader" @dismissed="onLoaderDismissed" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, provide, readonly, onMounted } from 'vue'

const showLoader = ref(true)
const isAppReady = ref(false)

function onLoaderDismissed() {
  showLoader.value = false
  isAppReady.value = true
}

provide('isAppReady', readonly(isAppReady))

onMounted(() => {
  if (localStorage.getItem('dv_visited')) {
    showLoader.value = false
    isAppReady.value = true
  }
})
</script>
