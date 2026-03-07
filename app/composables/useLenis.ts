import Lenis from 'lenis'
import { gsap } from 'gsap'

/* ─────────────────────────────────────────────
   Lenis smooth scroll — singleton pattern.
   Piped through GSAP ticker for ScrollTrigger sync.
   ───────────────────────────────────────────── */

let instance: Lenis | null = null
let tickerFn: ((time: number) => void) | null = null

export function useLenis() {
  function init(): Lenis | null {
    if (instance) return instance

    instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    tickerFn = (time: number) => {
      instance?.raf(time * 1000)
    }

    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    return instance
  }

  function destroy() {
    if (tickerFn) {
      gsap.ticker.remove(tickerFn)
      tickerFn = null
    }
    instance?.destroy()
    instance = null
  }

  function scrollTo(target: string | number | HTMLElement, options?: object) {
    instance?.scrollTo(target, options)
  }

  return {
    init,
    destroy,
    scrollTo,
    get lenis() { return instance },
  }
}