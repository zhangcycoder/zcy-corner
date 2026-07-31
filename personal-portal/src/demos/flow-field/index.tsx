import { useEffect, useRef, useState } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(REDUCED_MOTION_QUERY).matches
}

/** @name 读取主题 CSS 变量 */
function readColor(el: HTMLElement, name: string, fallback: string): string {
  const value = getComputedStyle(el).getPropertyValue(name).trim()
  return value || fallback
}

interface Particle {
  x: number
  y: number
  px: number
  py: number
}

/**
 * @name 流场墨迹 Demo
 * @description 上千粒子沿多频正弦流场移动,低透明度拖尾在纸底上累积成墨迹;
 *   指针或触摸靠近时扰动局部流向。跟随系统「减少动态效果」:开启时只渲染一帧静态快照,不循环。
 */
export default function FlowFieldDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia(REDUCED_MOTION_QUERY)
    const onChange = (event: MediaQueryListEvent) => setReduceMotion(event.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const ink = readColor(canvas, '--color-accent', '#7188ff')
    const paper = readColor(canvas, '--color-gallery', '#0b0c0f')
    const pointer = { x: -9999, y: -9999, active: false }

    let width = 0
    let height = 0
    let particles: Particle[] = []
    let raf = 0
    let t = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = paper
      ctx.fillRect(0, 0, width, height)
    }

    const seed = () => {
      particles = Array.from({ length: 700 }, () => {
        const x = Math.random() * width
        const y = Math.random() * height
        return { x, y, px: x, py: y }
      })
    }

    /** @name 计算某点流场角度(叠加正弦场 + 指针扰动) */
    const angleAt = (x: number, y: number): number => {
      const f = 0.0016
      let a = Math.sin(x * f + t) + Math.cos(y * f - t * 0.7) + Math.sin((x + y) * f * 0.6)
      if (pointer.active) {
        const dx = x - pointer.x
        const dy = y - pointer.y
        const d2 = dx * dx + dy * dy
        const radius = 150
        if (d2 < radius * radius) {
          const d = Math.sqrt(d2) || 1
          a += Math.atan2(dy, dx) * (1 - d / radius) * 2.2
        }
      }
      return a * Math.PI
    }

    const step = () => {
      ctx.globalAlpha = 0.04
      ctx.fillStyle = paper
      ctx.fillRect(0, 0, width, height)
      ctx.globalAlpha = 0.5
      ctx.strokeStyle = ink
      ctx.lineWidth = 1
      ctx.beginPath()
      for (const p of particles) {
        const a = angleAt(p.x, p.y)
        p.px = p.x
        p.py = p.y
        p.x += Math.cos(a) * 0.9
        p.y += Math.sin(a) * 0.9
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          p.x = Math.random() * width
          p.y = Math.random() * height
          p.px = p.x
          p.py = p.y
          continue
        }
        ctx.moveTo(p.px, p.py)
        ctx.lineTo(p.x, p.y)
      }
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    resize()
    seed()

    const observer = new ResizeObserver(() => { resize(); seed() })
    observer.observe(canvas)

    if (reduceMotion) {
      for (let i = 0; i < 140; i += 1) { t += 0.002; step() }
    } else {
      const loop = () => {
        t += 0.002
        step()
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = true
    }
    const onLeave = () => { pointer.active = false }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [reduceMotion])

  return (
    <div className="flow-field-demo">
      <canvas ref={canvasRef} className="flow-field-demo__canvas" />
      <div className="demo-hud" aria-hidden="true">
        <span>FLOW FIELD</span>
        <span>CANVAS / 2D</span>
      </div>
    </div>
  )
}
