'use client'
import { useReducedMotion } from 'framer-motion'
export { useReducedMotion }

export function useGSAPMotionConfig() {
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
  return prefersReduced ? { duration: 0, ease: 'none' } : {}
}
