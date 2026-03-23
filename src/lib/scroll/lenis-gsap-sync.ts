'use client'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function initSmoothScroll(): Lenis {
  if (lenisInstance) return lenisInstance

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  // Critical: pipe Lenis scroll events into GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  // Critical: pipe GSAP ticker into Lenis RAF loop
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)
  lenisInstance = lenis
  return lenis
}

export function getLenis(): Lenis | null {
  return lenisInstance
}
