<template>
  <canvas
    ref="canvasRef"
    class="fluid-cursor"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  friction?: number
  trails?: number
  size?: number
  dampening?: number
  tension?: number
}

const props = withDefaults(defineProps<Props>(), {
  friction: 0.5,
  trails: 12,
  size: 30,
  dampening: 0.25,
  tension: 0.98,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

interface NodeType {
  x: number
  y: number
  vx: number
  vy: number
}

class Wave {
  phase = 0
  offset = 0
  frequency = 0.001
  amplitude = 1
  private val = 0

  constructor(opts: { phase?: number; offset?: number; frequency?: number; amplitude?: number } = {}) {
    this.phase = opts.phase ?? 0
    this.offset = opts.offset ?? 0
    this.frequency = opts.frequency ?? 0.001
    this.amplitude = opts.amplitude ?? 1
  }

  update(): number {
    this.phase += this.frequency
    this.val = this.offset + Math.sin(this.phase) * this.amplitude
    return this.val
  }

  value(): number {
    return this.val
  }
}

function createNode(x: number, y: number): NodeType {
  return { x, y, vx: 0, vy: 0 }
}

class Line {
  spring: number
  friction: number
  nodes: NodeType[]

  constructor(spring: number, friction: number, size: number, x: number, y: number) {
    this.spring = spring + 0.1 * Math.random() - 0.02
    this.friction = friction + 0.01 * Math.random() - 0.002
    this.nodes = []
    for (let i = 0; i < size; i++) {
      this.nodes.push(createNode(x, y))
    }
  }

  update(targetX: number, targetY: number, dampening: number, tension: number): void {
    let e = this.spring
    const firstNode = this.nodes[0]
    if (!firstNode) return

    firstNode.vx += (targetX - firstNode.x) * e
    firstNode.vy += (targetY - firstNode.y) * e

    for (let i = 0, len = this.nodes.length; i < len; i++) {
      const t = this.nodes[i]
      if (!t) continue

      if (i > 0) {
        const prev = this.nodes[i - 1]
        if (!prev) continue
        t.vx += (prev.x - t.x) * e
        t.vy += (prev.y - t.y) * e
        t.vx += prev.vx * dampening
        t.vy += prev.vy * dampening
      }

      t.vx *= this.friction
      t.vy *= this.friction
      t.x += t.vx
      t.y += t.vy
      e *= tension
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const nodes = this.nodes
    const firstNode = nodes[0]
    if (!firstNode) return
    
    let nx = firstNode.x
    let ny = firstNode.y

    ctx.moveTo(nx, ny)

    for (let a = 1, end = nodes.length - 2; a < end; a++) {
      const curr = nodes[a]
      const next = nodes[a + 1]
      if (!curr || !next) continue
      nx = 0.5 * (curr.x + next.x)
      ny = 0.5 * (curr.y + next.y)
      ctx.quadraticCurveTo(curr.x, curr.y, nx, ny)
    }

    const pen = nodes[nodes.length - 2]
    const last = nodes[nodes.length - 1]
    if (!pen || !last) return
    ctx.quadraticCurveTo(pen.x, pen.y, last.x, last.y)
  }
}

let ctx: CanvasRenderingContext2D | null = null
let wave: Wave
let lines: Line[] = []
let rafId: number | null = null
let running = false

const pos = { x: 0, y: 0 }
let initialized = false

const VELOCITY_THRESHOLD = 0.15
const FADE_SPEED = 0.012
let strokeAlpha = 0.2
const BASE_ALPHA = 0.2
let isSettled = false
let isFading = false

function createLines(): void {
  lines = []
  for (let i = 0; i < props.trails; i++) {
    lines.push(
      new Line(
        0.4 + (i / props.trails) * 0.025,
        props.friction,
        props.size,
        pos.x,
        pos.y,
      ),
    )
  }
}

function resizeCanvas(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function getTotalVelocity(): number {
  let total = 0
  for (const line of lines) {
    for (const n of line.nodes) {
      total += Math.abs(n.vx) + Math.abs(n.vy)
    }
  }
  return total
}

function render(): void {
  if (!running || !ctx) return
  const canvas = ctx.canvas

  ctx.globalCompositeOperation = 'source-over'
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.globalCompositeOperation = 'lighter'

  if (!isSettled && getTotalVelocity() < VELOCITY_THRESHOLD) {
    isSettled = true
    isFading = true
  }

  if (isFading) {
    strokeAlpha -= FADE_SPEED
    if (strokeAlpha <= 0) {
      strokeAlpha = 0
      running = false
      rafId = null
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }
  }

  ctx.strokeStyle = `hsla(${Math.round(wave.update())},50%,50%,${strokeAlpha})`
  ctx.lineWidth = 1

  ctx.beginPath()
  for (const line of lines) {
    line.update(pos.x, pos.y, props.dampening, props.tension)
    line.draw(ctx)
  }
  ctx.stroke()

  rafId = requestAnimationFrame(render)
}

function startLoop(): void {
  isSettled = false
  isFading = false
  strokeAlpha = BASE_ALPHA

  if (running) return
  running = true
  render()
}

function onPointerMove(e: MouseEvent): void {
  pos.x = e.clientX
  pos.y = e.clientY
  if (!initialized) { initialized = true; createLines() }
  startLoop()
}

function onTouchMove(e: TouchEvent): void {
  const touch = e.touches[0]
  if (!touch) return
  pos.x = touch.clientX
  pos.y = touch.clientY
  if (!initialized) { initialized = true; createLines() }
  startLoop()
}

function onFocus(): void { if (initialized) startLoop() }
function onBlur(): void {
  running = false
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  // Bail if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  ctx = canvas.getContext('2d')
  if (!ctx) return

  wave = new Wave({
    phase: Math.random() * Math.PI * 2,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  })

  resizeCanvas()

  document.addEventListener('mousemove', onPointerMove, { passive: true })
  document.addEventListener('touchmove', onTouchMove, { passive: true })
  document.addEventListener('touchstart', onTouchMove, { passive: true })
  window.addEventListener('resize', resizeCanvas, { passive: true })
  window.addEventListener('focus', onFocus)
  window.addEventListener('blur', onBlur)

  if (screen?.orientation) {
    screen.orientation.addEventListener('change', resizeCanvas)
  }
})

onUnmounted(() => {
  running = false
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }

  document.removeEventListener('mousemove', onPointerMove)
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchstart', onTouchMove)
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('focus', onFocus)
  window.removeEventListener('blur', onBlur)

  if (screen?.orientation) {
    screen.orientation.removeEventListener('change', resizeCanvas)
  }
})
</script>

<style scoped>
.fluid-cursor {
  pointer-events: none;
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}
</style>