import Lenis from 'lenis'
import { gsap } from 'gsap'

let instance: Lenis | null = null

export function useLenis() {
  function init() {
    if (instance) return instance

    instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    gsap.ticker.add((time) => {
      instance!.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return instance
  }

  function destroy() {
    instance?.destroy()
    instance = null
  }

  function scrollTo(target: string | number | HTMLElement, options?: object) {
    instance?.scrollTo(target, options)
  }

  return { init, destroy, scrollTo, lenis: instance }
}
