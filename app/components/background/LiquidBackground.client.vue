<template>
  <div ref="ctnDom" class="liquid-bg">
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed, nextTick } from 'vue'
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl'
import type { OGLRenderingContext } from 'ogl'
import { gsap } from 'gsap'
import { EASE } from '~/composables/useAnimations'
import { usePerformanceMetrics } from '~/composables/usePerformanceMetrics'

const ctnDom = ref<HTMLDivElement | null>(null)

let animateId = 0
let renderer: Renderer | null = null
let gl: OGLRenderingContext | null = null
let mesh: Mesh | null = null
let rafClickTime = -1
let pendingClick: { x: number, y: number } | null = null
let lastTouchTime = 0


// Mouse/touch tracking for ripple distortion
const mouseState = {
  x: 0.5,
  y: 0.5,
  prevX: 0.5,
  prevY: 0.5,
  velocity: 0,
  lastMoveTime: 0,
  clickX: 0.5,
  clickY: 0.5,
  clickTime: -10.0,
}

const vert = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`

const frag = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uSpeed;
  uniform vec3 uColor;
  uniform float uColorBlend;
  uniform vec3 uResolution;
  uniform int uTheme;

  uniform vec2 uMouse;
  uniform float uMouseVelocity;
  uniform vec2 uClickPos;
  uniform float uClickTime;

  varying vec2 vUv;

  vec4 auroraWarp(vec2 u, float t) {
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 12.0; i++) {
      d += sin(i * u.y + a);
      a += sin(i - d + 0.1 * t - a * u.x);
    }
    vec4 o;
    o.r = 0.5 + 0.5 * cos(a + d);
    o.g = 0.5 + 0.5 * cos(a + d + 2.09);
    o.b = 0.5 + 0.5 * cos(a + d + 4.18);
    o.a = 1.0;
    return cos(0.5 + 0.5 * cos(vec4(d, a, 2.5, 0.0)) * o);
  }

  vec4 moltenGold(vec2 u, float t) {
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 10.0; i++) {
      d += cos(i * u.y * 0.8 + a);
      a += cos(i - d + 0.1 * t - a * u.x + length(u));
    }
    vec3 c = mix(vec3(0.0), vec3(0.6, 0.1, 0.0), smoothstep(-1.0, 1.0, cos(d)));
    c = mix(c, vec3(1.0, 0.5, 0.0), smoothstep(-0.5, 0.5, sin(a)));
    c = mix(c, vec3(1.0, 0.9, 0.3), smoothstep(0.8, 1.0, cos(a + d)));
    return vec4(pow(c, vec3(1.5)), 1.0);
  }

  vec4 darkBloom(vec2 u, float t) {
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
      d += sin(i * u.y + a);
      a += cos(i - d + t - a * u.x);
    }
    float w = (a + d) * 0.05 * 0.2;
    vec2 off = vec2(cos(w), sin(w)) * 0.1;
    float a2 = 0.0, d2 = 0.0;
    vec2 u2 = u + off;
    for (float i = 0.0; i < 5.0; i++) {
      d2 += sin(i * u2.y + a2);
      a2 += cos(i - d2 + t * 0.1 - a2 * u2.x);
    }
    float f = 0.5 + 0.5 * cos(a2 + d2);
    vec3 c = vec3(0.05);
    c = mix(c, vec3(0.25), smoothstep(0.5, 0.8, f));
    return vec4(c, 1.0);
  }

  vec4 cosmicOcean(vec2 u, float t) {
    vec2 p = vec2(u.x * 0.2, u.y);
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
      d += sin(i * p.y + a + t * 0.08);
      a += cos(i - d + 0.1 * t - a * p.x);
    }
    vec3 c = mix(vec3(0.0, 0.05, 0.2), vec3(0.1, 0.2, 0.7), smoothstep(-1.0, 1.0, cos(a)));
    c = mix(c, vec3(0.8, 0.8, 1.0), pow(smoothstep(0.5, 1.0, sin(d * 2.0)), 4.0));
    return vec4(c, 1.0);
  }

  vec4 getGradientColor(vec2 u, float t, int theme) {
    if (theme == 0) return auroraWarp(u, t);
    if (theme == 1) return moltenGold(u, t);
    if (theme == 2) return darkBloom(u, t);
    return cosmicOcean(u, t);
  }

  void main() {
    float mr = min(uResolution.x, uResolution.y);
    vec2 uv = (vUv * 2.0 - 1.0) * uResolution.xy / mr;
    float t = uTime * uSpeed;

    // Mouse distortion
    vec2 mouseNorm = (uMouse * 2.0 - 1.0) * uResolution.xy / mr;
    vec2 delta = uv - mouseNorm;
    float dist = length(delta);
    float influence = smoothstep(1.2, 0.0, dist) * uMouseVelocity * 0.15;
    uv += normalize(delta + 0.001) * influence;

    // Click ripple
    float rippleAge = uTime - uClickTime;
    if (rippleAge > 0.0 && rippleAge < 4.0) {
      vec2 clickNorm = (uClickPos * 2.0 - 1.0) * uResolution.xy / mr;
      vec2 clickDelta = uv - clickNorm;
      float clickDist = length(clickDelta);
      float rippleRadius = rippleAge * 0.75;
      float rippleWidth = 0.25;
      float rippleDecay = 1.0 - rippleAge / 4.0;
      float ripple = exp(-abs(clickDist - rippleRadius) / rippleWidth) * rippleDecay * 0.15;
      uv += normalize(clickDelta + 0.001) * ripple;
    }

    vec4 gradientColor = getGradientColor(uv, t, uTheme);
    vec3 finalColor = mix(gradientColor.rgb, uColor, uColorBlend);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

const isMobileDevice = computed(() => {
  if (typeof navigator === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
})

const computedDPR = computed(() => {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  return isMobileDevice.value ? Math.min(dpr, 1.5) : Math.min(dpr, 2)
})

function resizeCanvas() {
  if (!ctnDom.value || !gl || !renderer) {
    return
  }
  const dpr = computedDPR.value
  const width = window.innerWidth
  const height = window.innerHeight

  renderer.setSize(Math.floor(width * dpr), Math.floor(height * dpr))

  const canvas = gl.canvas as HTMLCanvasElement
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.style.display = 'block'
  canvas.style.position = 'absolute'
  canvas.style.inset = '0'
  canvas.style.pointerEvents = 'none'

  if (mesh?.program?.uniforms?.uResolution?.value) {
    mesh.program.uniforms.uResolution.value = [width, height, width / height]
  }
}

function onPointerMove(x: number, y: number) {
  const now = performance.now()
  if (now - mouseState.lastMoveTime < 8) return
  mouseState.lastMoveTime = now

  const normX = x / window.innerWidth
  const normY = 1.0 - y / window.innerHeight

  const dx = normX - mouseState.prevX
  const dy = normY - mouseState.prevY
  const dist = Math.sqrt(dx * dx + dy * dy)

  mouseState.velocity = Math.min(dist * 15, 3.0)
  mouseState.prevX = mouseState.x
  mouseState.prevY = mouseState.y
  mouseState.x = normX
  mouseState.y = normY
}

function onPointerClick(x: number, y: number) {
  pendingClick = {
    x: x / window.innerWidth,
    y: 1.0 - y / window.innerHeight,
  }
}

function handleMouseMove(e: MouseEvent) { onPointerMove(e.clientX, e.clientY) }
function handleMouseClick(e: MouseEvent) {
  // Skip if recently triggered by touch to prevent dual-fire jitter
  if (performance.now() - lastTouchTime < 500) return
  onPointerClick(e.clientX, e.clientY)
}
function handleTouchMove(e: TouchEvent) {
  const touch = e.touches[0]
  if (touch) onPointerMove(touch.clientX, touch.clientY)
}
function handleTouchStart(e: TouchEvent) {
  lastTouchTime = performance.now()
  const touch = e.touches[0]
  if (touch) onPointerClick(touch.clientX, touch.clientY)
}

function update(t: number) {
  animateId = requestAnimationFrame(update)
  if (!mesh || !renderer) {
    console.warn('[LiquidBackground] update: mesh or renderer missing', { mesh: !!mesh, renderer: !!renderer })
    return
  }

  // Process pending click with rAF-synced timing
  if (pendingClick) {
    mouseState.clickX = pendingClick.x
    mouseState.clickY = pendingClick.y
    rafClickTime = t
    pendingClick = null
  }

  const elapsed = t * 0.005
  mesh.program.uniforms.uTime.value = elapsed

  mouseState.velocity *= 0.65
  mesh.program.uniforms.uMouse.value = [mouseState.x, mouseState.y]
  mesh.program.uniforms.uMouseVelocity.value = mouseState.velocity
  mesh.program.uniforms.uClickPos.value = [mouseState.clickX, mouseState.clickY]

  // Handle click ripple timing — convert rAF time to shader time only once
  if (rafClickTime >= 0) {
    const clickShaderTime = rafClickTime * 0.005
    mesh.program.uniforms.uClickTime.value = clickShaderTime
    
    // Reset after ripple finishes (4.0s duration)
    if (elapsed - clickShaderTime > 4.0) {
      rafClickTime = -1
    }
  } else {
    mesh.program.uniforms.uClickTime.value = -10.0
  }

  renderer.render({ scene: mesh })
}

onMounted(async () => {
  
  // Wait for DOM to be fully ready
  await nextTick()
  
  if (!ctnDom.value) {
    return
  }

  try {
    renderer = new Renderer({ alpha: true, antialias: false })
    
    gl = renderer.gl as OGLRenderingContext
    
    gl.clearColor(0, 0, 0, 1)

    const geometry = new Triangle(gl)
    
    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 1.3 },
        uColor: { value: new Color(1.2, 0.3, 0.3) },
        uColorBlend: { value: 0.5 },
        uResolution: { value: [window.innerWidth, window.innerHeight, window.innerWidth / window.innerHeight] },
        uTheme: { value: 0 },
        uMouse: { value: [0.5, 0.5] },
        uMouseVelocity: { value: 0 },
        uClickPos: { value: [0.5, 0.5] },
        uClickTime: { value: -10.0 },
      },
    })

    mesh = new Mesh(gl, { geometry, program })

    const canvas = gl.canvas as HTMLCanvasElement
    ctnDom.value.appendChild(canvas)
    
    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)

    animateId = requestAnimationFrame(update)

    // Only enable mouse/touch move interactions on non-mobile devices
    const { isMobile } = usePerformanceMetrics()
    
    if (!isMobile.value) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('touchmove', handleTouchMove, { passive: true })
    }

    // Always keep click/tap interactions for ripple effect
    window.addEventListener('click', handleMouseClick)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
  } catch (error) {
    console.error('[LiquidBackground] Init error:', error)
    console.error('[LiquidBackground] Error stack:', error instanceof Error ? error.stack : 'no stack')
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('click', handleMouseClick)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchstart', handleTouchStart)
  cancelAnimationFrame(animateId)

  if (ctnDom.value && gl?.canvas) {
    try {
      ctnDom.value.removeChild(gl.canvas as HTMLCanvasElement)
    } catch (e) {
      console.warn('Error removing canvas:', e)
    }
  }

  try {
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch (e) { 
    console.warn('Error losing context:', e)
  }

  renderer = null
  gl = null
  mesh = null
})

/* ─── Exposed API for parent components ─── */
defineExpose({
  setShaderColor: (r: number, g: number, b: number, duration = 0, blend = 0.35) => {
    if (!mesh?.program?.uniforms?.uColor?.value || !mesh?.program?.uniforms?.uColorBlend) return

    const color = mesh.program.uniforms.uColor.value
    const blendUniform = mesh.program.uniforms.uColorBlend

    if (duration > 0) {
      // ✅ Uses approved ease token, not power2.out
      gsap.to(color, { r, g, b, duration, ease: EASE.smooth })
      gsap.to(blendUniform, { value: blend, duration, ease: EASE.smooth })
    } else {
      color.set(r, g, b)
      blendUniform.value = blend
    }
  },

  setTheme: (index: number) => {
    const themeUniform = mesh?.program?.uniforms?.uTheme
    if (!themeUniform) return
    themeUniform.value = Math.max(0, Math.min(3, Math.floor(index)))
  },

  setSpeed: (speed: number) => {
    const speedUniform = mesh?.program?.uniforms?.uSpeed
    if (!speedUniform) return
    speedUniform.value = speed
  },
})
</script>

<style scoped>
.liquid-bg {
  position: fixed;
  inset: 0;
  width: 100dvw;
  height: 100dvh;
  overflow: hidden;
  z-index: 0;
  background-color: black;
  pointer-events: none;
}
</style>