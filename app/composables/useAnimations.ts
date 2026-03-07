import { gsap } from 'gsap'

/* ─────────────────────────────────────────────
   Motion token system — three easings, no exceptions.
   Maps CSS vars to GSAP-compatible strings.
   ───────────────────────────────────────────── */

export const EASE = {
  signature: 'cubic-bezier(0.22, 1, 0.36, 1)',
  smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  float: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
} as const

export type EaseToken = keyof typeof EASE

export const useMotion = () => {
  const revealElement = (el: HTMLElement, opts?: { delay?: number }) => {
    gsap.from(el, {
      opacity: 0,
      y: 20,
      duration: 1.2,
      ease: EASE.signature,
      delay: opts?.delay ?? 0,
    })
  }

  return { revealElement, EASE }
}