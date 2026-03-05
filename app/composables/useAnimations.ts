import { gsap } from 'gsap';

export const useMotion = () => {
  // Access your CSS variables for GSAP
  const tokens = {
    signature: "cubic-bezier(0.22, 1, 0.36, 1)",
    smooth: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    float: "cubic-bezier(0.25, 0.8, 0.25, 1)"
  };

  const revealElement = (el: HTMLElement) => {
    gsap.from(el, {
      opacity: 0,
      y: 20,
      duration: 1.2,
      ease: tokens.signature, // Strictly following your rule
    });
  };

  return { revealElement, tokens };
};