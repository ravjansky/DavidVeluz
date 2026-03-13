<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(DrawSVGPlugin)

const overlay = ref<HTMLDivElement | null>(null)
const svgContainer = ref<SVGSVGElement | null>(null)
const pathElement = ref<SVGPathElement | null>(null)
const svgPaths = ref<(SVGPathElement | null)[]>([])

let isAnimating = false

onMounted(() => {
  if (pathElement.value) {
    svgPaths.value[0] = pathElement.value
  }

  // Initialize overlay as completely hidden
  gsap.set(overlay.value, {
    display: 'none',
    opacity: 0
  })

  gsap.set(svgPaths.value, {
    drawSVG: "0%",
    strokeWidth: 2
  })

  gsap.set(svgContainer.value, {
    scale: 1,
    '--blur': '0px'
  })
})

function playEnter(_pageName: string): Promise<void> {
  return new Promise((resolve) => {
    if (isAnimating) {
      resolve()
      return
    }

    isAnimating = true

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating = false
        resolve()
      }
    })

    // Ensure overlay is visible before animation starts
    if (overlay.value) {
      overlay.value.classList.remove('hidden')
      gsap.set(overlay.value, { display: 'flex', opacity: 0 })
    }

    tl.to(overlay.value, {
      opacity: 1,
      duration: 0.35,
      ease: "power2.inOut"
    })
      .to(svgContainer.value, {
        scale: 1.15,
        '--blur': '12px',
        duration: 1.2,
        ease: "power2.out"
      }, 0)
      .to(svgPaths.value, {
        drawSVG: "100%",
        strokeWidth: 300,
        duration: 1.4,
        ease: "power2.inOut",
        stagger: 0.08
      }, 0)
  })
}

function playLeave(): Promise<void> {
  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Properly hide overlay after animation
        if (overlay.value) {
          gsap.set(overlay.value, { display: 'none' })
          overlay.value.classList.add('hidden')
        }
        resolve()
      }
    })

    tl.to(svgPaths.value, {
      drawSVG: "100% 100%",
      strokeWidth: 2,
      duration: 1.2,
      ease: "power2.inOut",
      stagger: 0.08
    })
      .to(svgContainer.value, {
        scale: 1,
        '--blur': '0px',
        duration: 1,
        ease: "power2.out"
      }, 0)
      .to(overlay.value, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      }, 0.7)
      .set(svgPaths.value, {
        drawSVG: "0%",
        strokeWidth: 2
      })
  })
}

defineExpose({
  playEnter,
  playLeave
})
</script>

<template>

<div
  ref="overlay"
  class="fixed inset-0 pointer-events-none z-[999] flex items-center justify-center"
>

<svg
  ref="svgContainer"
  width="100%"
  height="100%"
  viewBox="0 0 1316 664"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class="w-full h-full scale-[1.3]"
  preserveAspectRatio="xMidYMid slice"
  style="filter: blur(var(--blur, 0px))"
>

<defs>
<linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#5B8DEE"/>
<stop offset="50%" stop-color="#8B5CF6"/>
<stop offset="100%" stop-color="#D946EF"/>
</linearGradient>
</defs>

<path
  ref="pathElement"
  d="M 13.4746 291.27 C 13.4746 291.27 100.646 -18.6724 255.617 16.8418 C 410.588 52.356 61.0296 431.197 233.017 546.326 C 505 663 498 87 338 173 C 283 195 211 299 282 391 C 426 567 444.494 21.0125 618 57 C 710 81 801 462 665 464 C 492 421 401 398 536 285 C 1378 -368 276 573 589 559 C 930 572 819.097 48.2722 988.501 120.156 C 1101 194 994 420 843 305 C 290 -153 883 765 1094 545 C 1165 457 994 97 139 255 C -245 366 1364 508 1187 156"
  stroke="url(#pathGradient)"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
/>

</svg>

</div>

</template>