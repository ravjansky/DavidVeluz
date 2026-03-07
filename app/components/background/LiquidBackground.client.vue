<template>
  <div ref="ctnDom" class="liquid-bg"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { Renderer, Program, Mesh, Color, Triangle, type OGLRenderingContext } from 'ogl'
import gsap from 'gsap'

const ctnDom = ref<HTMLDivElement | null>(null)

let animateId = 0
let renderer: Renderer | null = null
let gl: OGLRenderingContext | null = null
let mesh: Mesh | null = null

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

const vert = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`

const frag = `
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

  vec4 electricPlasma(vec2 u, float t) {
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
      d += sin(i * u.y + a);
      a += sin(i - d + 0.15 * t - a * u.x);
    }
    vec3 c = mix(vec3(0.1, 0.0, 0.8), vec3(0.5, 0.2, 1.0), 0.5 + 0.5 * cos(a));
    c = mix(c, vec3(1.0), 0.5 + 0.5 * sin(d));
    return vec4(c, 1.0);
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

  vec4 emeraldMist(vec2 u, float t) {
    float angle = t * 0.05;
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    u = rot * u;
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 5.0; i++) {
      d += sin(i * u.y + a) * 0.5;
      a += cos(i - d + 0.1 * t - a * u.x);
    }
    vec3 c = mix(vec3(0.0, 0.1, 0.1), vec3(0.1, 0.8, 0.6), 0.5 + 0.5 * cos(a));
    c = mix(c, vec3(0.9, 1.0, 0.9), 0.5 + 0.5 * sin(d));
    return vec4(c, 1.0);
  }

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

  float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec4 staticInterference(vec2 u, float t) {
    u += (random(u + t * 0.5) - 0.5) * 0.02;
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
      d += sin(i * u.y + a);
      a += cos(i - d + 0.3 * t - a * u.x);
    }
    float grey = 0.5 + 0.5 * cos(a + d);
    grey += (random(u * 150.0) - 0.5) * 0.15;
    return vec4(vec3(grey), 1.0);
  }

  vec4 liquidCrystal(vec2 u, float t) {
    u *= 1.2;
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 9.0; i++) {
      d += cos(i * u.y + a);
      a += sin(i * 0.5 - d + 0.1 * t - a * u.x);
    }
    vec3 c = 0.6 + 0.4 * cos(vec3(0.0, 2.1, 4.2) + a + d);
    float gloss = pow(smoothstep(0.6, 1.0, sin(d * 2.0 + a)), 10.0);
    c += vec3(0.8) * gloss;
    return vec4(clamp(c, 0.0, 1.0), 1.0);
  }

  vec4 solarFlare(vec2 u, float t) {
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 9.0; i++) {
      d += sin(i * u.y + a);
      a += cos(i - d + 0.05 * t - a * u.x);
    }
    float v = 0.5 + 0.5 * cos(a + d);
    vec3 c = mix(vec3(0.0), vec3(1.0, 0.1, 0.0), smoothstep(0.6, 0.7, v));
    c = mix(c, vec3(1.0, 0.8, 0.2), smoothstep(0.85, 0.9, v));
    c = mix(c, vec3(1.0), smoothstep(0.98, 0.99, v));
    return vec4(c, 1.0);
  }

  vec4 dreamscapePastel(vec2 u, float t) {
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 6.0; i++) {
      d += sin(i * u.y + a);
      a += cos(i - d + 0.04 * t - a * u.x);
    }
    vec3 c1 = vec3(1.0, 0.8, 0.9);
    vec3 c2 = vec3(0.8, 0.9, 1.0);
    vec3 c3 = vec3(0.9, 0.8, 1.0);
    vec3 c = mix(c1, c2, 0.5 + 0.5 * cos(a + d));
    c = mix(c, c3, 0.5 + 0.5 * sin(d));
    return vec4(c, 1.0);
  }

  vec4 dataStream(vec2 u, float t) {
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
      d += sin(i * u.y + a);
      a += cos(i - d + 0.1 * t - a * u.x);
    }
    float g = 0.0;
    for (float i = 0.0; i < 4.0; i++) {
      g += cos(i * u.x + a);
      a += sin(i - d + 2.0 * t - g * u.y);
    }
    vec3 color = 0.5 + 0.5 * cos(vec3(0.0, 1.0, 2.0) + d);
    vec2 grid_uv = u * 8.0;
    vec2 grid = abs(fract(grid_uv) - 0.5);
    float lines = pow(1.0 - (grid.x + grid.y), 40.0);
    float glitch = pow(fract(g * 4.0), 20.0);
    return vec4(color * (lines * 0.5 + glitch * 2.0), 1.0);
  }

  float gradientPattern(vec2 u, float t) {
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
      d += sin(i * u.y + a);
      a += cos(i - d + 0.2 * t - a * u.x);
    }
    return 0.5 + 0.5 * cos(a + d);
  }

  vec4 chromaticFlow(vec2 u, float t) {
    vec2 oR = vec2(cos(t * 0.2), sin(t * 0.2)) * 0.015;
    vec2 oG = vec2(cos(t * 0.25), sin(t * 0.25)) * 0.015;
    vec2 oB = vec2(cos(t * 0.3), sin(t * 0.3)) * 0.015;
    float r = gradientPattern(u + oR, t);
    float g = gradientPattern(u - oG, t);
    float b = gradientPattern(u + oB, t);
    return vec4(pow(r, 2.0), pow(g, 2.0), pow(b, 2.0), 1.0);
  }

  vec4 wovenDimensions(vec2 u, float t) {
    float a1 = 0.0, d1 = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
      d1 += sin(i * u.y + a1);
      a1 += cos(i - d1 + 0.1 * t - a1 * u.x);
    }
    float a2 = 0.0, d2 = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
      d2 += sin(i * u.x + a2);
      a2 += cos(i - d2 + 0.12 * t - a2 * u.y);
    }
    float v1 = 0.5 + 0.5 * sin(a1 + d1);
    float v2 = 0.5 + 0.5 * cos(a2 + d2);
    vec3 c = vec3(0.6, 0.7, 0.8) * v1 * v2 * 2.5;
    return vec4(pow(c, vec3(1.2)), 1.0);
  }

  vec2 hash2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
  }

  vec4 cellularMatrix(vec2 u, float t) {
    u *= 2.0;
    vec2 i_u = floor(u);
    vec2 f_u = fract(u);
    float m_dist = 1.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 n = vec2(float(x), float(y));
        vec2 p = hash2(i_u + n);
        p = 0.5 + 0.5 * sin(t * 0.2 + 6.2831 * p);
        m_dist = min(m_dist, length(n + p - f_u));
      }
    }
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 5.0; i++) {
      d += sin(i * u.y + a);
      a += cos(i - d + 0.1 * t - a * u.x);
    }
    vec3 c = 0.5 + 0.5 * cos(vec3(0.0, 2.0, 4.0) + a + d);
    return vec4(c * (1.0 - m_dist) + pow(m_dist, 5.0) * c, 1.0);
  }

  float cellNoise(vec2 u, float t) {
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 5.0; i++) {
      d += sin(i * u.y + a);
      a += cos(i - d + t - a * u.x);
    }
    return a + d;
  }

  vec4 pearlBloom(vec2 u, float t) {
    float w = cellNoise(u, t * 0.05) * 0.2;
    vec2 off = vec2(cos(w), sin(w)) * 0.1;
    float f = 0.5 + 0.5 * cellNoise(u + off, t * 0.1);
    vec3 base = vec3(0.85 + f * 0.15);
    float edge = smoothstep(0.1, 0.0, abs(f * 5.0 - 0.5));
    vec3 spec = 0.5 + 0.5 * cos(f * 10.0 + vec3(0.0, 2.0, 4.0));
    return vec4(mix(base, spec, pow(edge, 2.0)), 1.0);
  }

  vec4 darkBloom(vec2 u, float t) {
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
      d += sin(i * u.y + a);
      a += cos(i - d + t - a * u.x);
    }
    float w = (a + d) * 0.05 * 0.2;
    vec2 off = vec2(cos(w), sin(w)) * 0.1;
    float f = 0.5 + 0.5 * cos(cellNoise(u + off, t * 0.1));
    vec3 c = vec3(0.05);
    c = mix(c, vec3(0.25), smoothstep(0.5, 0.8, f));
    return vec4(c, 1.0);
  }

  vec4 voxelSunset(vec2 u, float t) {
    vec2 b = floor(u * 25.0) / 25.0;
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
      d += sin(i * b.y + a);
      a += cos(i - d + 0.15 * t - a * b.x);
    }
    vec3 c = 0.5 + 0.5 * cos(vec3(0.0, 1.0, 2.0) + d * 2.0);
    float l = dot(normalize(vec2(1.0, 1.0)), u);
    return vec4(c * (0.8 + l * 0.4), 1.0);
  }

  vec4 inkBloom(vec2 u, float t) {
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
      d += sin(i * u.y + a);
      a += cos(i - d + t - a * u.x);
    }
    float w = (a + d) * 0.05 * 0.2;
    vec2 off = vec2(cos(w), sin(w)) * 0.1;
    float f = cellNoise(u + off, t * 0.1);
    return vec4(vec3(0.5 + 0.5 * cos(f)), 1.0);
  }

  vec4 etherealStrata(vec2 u, float t) {
    vec3 pos = vec3(u * 1.5, t * 0.1);
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 5.0; i++) {
      d += sin(i * pos.y + a);
      a += cos(i - d + pos.z - a * pos.x);
    }
    float v = a + d;
    return vec4(0.6 + 0.4 * cos(v + vec3(0.0, 2.0, 4.0)), 1.0);
  }

  vec4 solarPlasma(vec2 u, float t) {
    float a = 0.0, d = 0.0;
    vec2 p = u * 1.5;
    for (float i = 0.0; i < 5.0; i++) {
      d += sin(i * p.y + a);
      a += cos(i - d + t * 0.1 - a * p.x);
    }
    float f = 0.5 + 0.5 * cos(a + d);
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    p = m * p;
    float a2 = 0.0, d2 = 0.0;
    for (float i = 0.0; i < 5.0; i++) {
      d2 += sin(i * p.y + a2);
      a2 += cos(i - d2 + t * 0.1 - a2 * p.x);
    }
    f = f * 0.5 + (0.5 + 0.5 * cos(a2 + d2)) * 0.25;
    vec3 c = mix(vec3(0.1, 0.0, 0.0), vec3(1.0, 0.2, 0.0), smoothstep(0.4, 0.7, f));
    c = mix(c, vec3(1.0, 0.9, 0.5), pow(smoothstep(0.8, 0.85, f), 10.0));
    return vec4(c, 1.0);
  }

  vec4 warpedSilk(vec2 u, float t) {
    vec2 p = u;
    p.y *= 5.0;
    p.x += sin(p.y * 0.5 + t) * 0.2;
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 5.0; i++) {
      d += sin(i * p.y + a);
      a += cos(i - d + t * 0.1 - a * p.x);
    }
    float n = 0.5 + 0.5 * cos(a + d);
    vec3 base_color = vec3(0.2, 0.1, 0.5);
    float sheen = pow(smoothstep(0.5, -0.5, u.x + n * 0.2), 2.0);
    return vec4(base_color + sheen, 1.0);
  }

  vec4 livingCells(vec2 u, float t) {
    float a = 0.0, d = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
      d += sin(i * u.y + a);
      a += cos(i - d + t * 0.05 - a * u.x);
    }
    float w = (a + d) * 0.2 * 6.28;
    vec2 off = vec2(cos(w), sin(w)) * 0.1;
    float a2 = 0.0, d2 = 0.0;
    vec2 u2 = u + off;
    for (float i = 0.0; i < 8.0; i++) {
      d2 += sin(i * u2.y + a2);
      a2 += cos(i - d2 + t * 0.1 - a2 * u2.x);
    }
    float cell_shape = 0.5 + 0.5 * cos(a2 + d2);
    float mask = smoothstep(0.4, 0.6, cell_shape);
    float a3 = 0.0, d3 = 0.0;
    vec2 u3 = u * 3.0;
    for (float i = 0.0; i < 8.0; i++) {
      d3 += sin(i * u3.y + a3);
      a3 += cos(i - d3 + t * 0.2 - a3 * u3.x);
    }
    float internal_noise = 0.5 + 0.5 * cos(a3 + d3);
    vec3 c1 = vec3(0.2, 0.8, 0.5);
    vec3 c2 = vec3(0.8, 0.5, 0.2);
    vec3 internal_color = mix(c1, c2, internal_noise);
    return vec4(mix(vec3(0.05), internal_color, mask), 1.0);
  }

  vec4 getGradientColor(vec2 u, float t, int theme) {
    if (theme == 0) return electricPlasma(u, t);
    else if (theme == 1) return moltenGold(u, t);
    else if (theme == 2) return emeraldMist(u, t);
    else if (theme == 3) return auroraWarp(u, t);
    else if (theme == 4) return cosmicOcean(u, t);
    else if (theme == 5) return staticInterference(u, t);
    else if (theme == 6) return liquidCrystal(u, t);
    else if (theme == 7) return solarFlare(u, t);
    else if (theme == 8) return dreamscapePastel(u, t);
    else if (theme == 9) return dataStream(u, t);
    else if (theme == 10) return chromaticFlow(u, t);
    else if (theme == 11) return wovenDimensions(u, t);
    else if (theme == 12) return cellularMatrix(u, t);
    else if (theme == 13) return pearlBloom(u, t);
    else if (theme == 14) return darkBloom(u, t);
    else if (theme == 15) return voxelSunset(u, t);
    else if (theme == 16) return inkBloom(u, t);
    else if (theme == 17) return etherealStrata(u, t);
    else if (theme == 18) return solarPlasma(u, t);
    else if (theme == 19) return warpedSilk(u, t);
    else return livingCells(u, t);
  }

  void main() {
    float mr = min(uResolution.x, uResolution.y);
    vec2 uv = (vUv * 2.0 - 1.0) * uResolution.xy / mr;
    float t = uTime * uSpeed;

    vec2 mouseNorm = (uMouse * 2.0 - 1.0) * uResolution.xy / mr;
    vec2 delta = uv - mouseNorm;
    float dist = length(delta);
    float influence = smoothstep(1.2, 0.0, dist) * uMouseVelocity * 0.15;
    uv += normalize(delta + 0.001) * influence;

    float rippleAge = uTime - uClickTime;
    if (rippleAge > 0.0 && rippleAge < 2.5) {
      vec2 clickNorm = (uClickPos * 2.0 - 1.0) * uResolution.xy / mr;
      vec2 clickDelta = uv - clickNorm;
      float clickDist = length(clickDelta);
      float rippleRadius = rippleAge * 1.5;
      float rippleWidth = 0.25;
      float rippleDecay = 1.0 - rippleAge / 2.5;
      float ripple = exp(-abs(clickDist - rippleRadius) / rippleWidth) * rippleDecay * 0.15;
      uv += normalize(clickDelta + 0.001) * ripple;
    }

    vec4 gradientColor = getGradientColor(uv, t, uTheme);
    vec3 finalColor = mix(gradientColor.rgb, uColor, uColorBlend);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

const isMobile = computed(() => {
  if (typeof navigator === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
})

const computedDPR = computed(() => {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  return isMobile.value ? Math.min(dpr, 1.5) : Math.min(dpr, 2)
})

function resizeCanvas() {
  if (!ctnDom.value || !gl || !renderer) return
  const dpr = computedDPR.value
  const width = window.innerWidth
  const height = window.innerHeight

  renderer.setSize(Math.floor(width * dpr), Math.floor(height * dpr))
  gl.canvas.style.width = `${width}px`
  gl.canvas.style.height = `${height}px`
  gl.canvas.style.display = 'block'
  gl.canvas.style.position = 'absolute'
  gl.canvas.style.inset = '0'
  gl.canvas.style.pointerEvents = 'none'

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

  mouseState.velocity = Math.min(dist * 50, 3.0)
  mouseState.prevX = mouseState.x
  mouseState.prevY = mouseState.y
  mouseState.x = normX
  mouseState.y = normY
}

function onPointerClick(x: number, y: number) {
  mouseState.clickX = x / window.innerWidth
  mouseState.clickY = 1.0 - y / window.innerHeight
  mouseState.clickTime = performance.now() / 1000
}

function handleMouseMove(e: MouseEvent) {
  onPointerMove(e.clientX, e.clientY)
}

function handleMouseClick(e: MouseEvent) {
  onPointerClick(e.clientX, e.clientY)
}

function handleTouchMove(e: TouchEvent) {
  if (e.touches.length > 0) {
    onPointerMove(e.touches[0].clientX, e.touches[0].clientY)
  }
}

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length > 0) {
    onPointerClick(e.touches[0].clientX, e.touches[0].clientY)
  }
}

function update(t: number) {
  animateId = requestAnimationFrame(update)
  if (!mesh || !renderer) return

  const elapsed = t * 0.001

  mesh.program.uniforms.uTime.value = elapsed

  mouseState.velocity *= 0.32
  mesh.program.uniforms.uMouse.value = [mouseState.x, mouseState.y]
  mesh.program.uniforms.uMouseVelocity.value = mouseState.velocity
  mesh.program.uniforms.uClickPos.value = [mouseState.clickX, mouseState.clickY]

  if (mouseState.clickTime > 0) {
    const realElapsed = performance.now() / 1000
    const timeSinceClick = realElapsed - mouseState.clickTime
    mesh.program.uniforms.uClickTime.value = elapsed - timeSinceClick
  } else {
    mesh.program.uniforms.uClickTime.value = -10.0
  }

  renderer.render({ scene: mesh })
}

onMounted(() => {
  if (!ctnDom.value) return

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
        uColor: { value: new Color(0.3, 0.2, 0.5) },
        uColorBlend: { value: 0.0 },
        uResolution: {
          value: [window.innerWidth, window.innerHeight, window.innerWidth / window.innerHeight],
        },
        uTheme: { value: 3 },
        uMouse: { value: [0.5, 0.5] },
        uMouseVelocity: { value: 0 },
        uClickPos: { value: [0.5, 0.5] },
        uClickTime: { value: -10.0 },
      },
    })

    mesh = new Mesh(gl, { geometry, program })

    ctnDom.value.appendChild(gl.canvas)
    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleMouseClick)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })

    animateId = requestAnimationFrame(update)
  } catch (error) {
    console.error('[LiquidBackground] Init error:', error)
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
    try { ctnDom.value.removeChild(gl.canvas) } catch { /* ignore */ }
  }
  try { gl?.getExtension('WEBGL_lose_context')?.loseContext() } catch { /* ignore */ }

  renderer = null
  gl = null
  mesh = null
})

defineExpose({
  setShaderColor: (r: number, g: number, b: number, duration = 0, blend = 0.35) => {
    if (!mesh?.program?.uniforms?.uColor?.value || !mesh?.program?.uniforms?.uColorBlend) return

    const color = mesh.program.uniforms.uColor.value
    const blendUniform = mesh.program.uniforms.uColorBlend

    if (duration > 0) {
      gsap.to(color, {
        r, g, b,
        duration,
        ease: 'power2.out',
      })
      gsap.to(blendUniform, {
        value: blend,
        duration,
        ease: 'power2.out',
      })
    } else {
      color.set(r, g, b)
      blendUniform.value = blend
    }
  },

  setTheme: (index: number) => {
    const themeUniform = mesh?.program?.uniforms?.uTheme
    if (!themeUniform) return
    themeUniform.value = Math.max(0, Math.min(20, Math.floor(index)))
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
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 0;
  background-color: black;
  pointer-events: none;
}
</style>
