import { useEffect, useState } from 'react'
import ParticleSystem from '../../components/ParticleSystem'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(REDUCED_MOTION_QUERY).matches
}

/**
 * @name 粒子力场 Demo
 * @description 将旧粒子实现限制在藏品预览容器内，并跟随系统减少动态效果设置。
 */
export default function ParticleFieldDemo() {
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    const handleChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches)
    }

    setReduceMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <div className="particle-field-demo">
      <ParticleSystem disabled={reduceMotion} />
      <div className="particle-field-demo__label" aria-hidden="true">
        <span>POINTER FORCE</span>
        <span>CANVAS / 2D</span>
      </div>
    </div>
  )
}
