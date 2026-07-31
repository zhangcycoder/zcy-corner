import { useEffect, useRef, useState } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const CHARS = ' .:-=+*#%@'

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

/**
 * @name 交互式 ASCII 艺术 Demo
 * @description 在 Canvas 网格上按亮度场选字符(密度梯度 " .:-=+*#%@");亮度 = 到中心的波纹 + 指针高斯照亮。
 *   跟随「减少动态效果」:开启时冻结时间波纹,仅指针移动时重绘一帧。
 */
export default function AsciiArtDemo() {
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
    const muted = readColor(canvas, '--color-muted-dark', '#5a5f6a')
    const mono = readColor(canvas, '--font-mono', 'monospace')
    const pointer = { x: -9999, y: -9999 }
    const cell = 14

    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
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
      cols = Math.ceil(width / cell)
      rows = Math.ceil(height / cell)
      ctx.font = `${cell}px ${mono}`
      ctx.textBaseline = 'top'
    }

    const draw = () => {
      ctx.fillStyle = paper
      ctx.fillRect(0, 0, width, height)
      const cx = width / 2
      const cy = height / 2
      for (let gy = 0; gy < rows; gy += 1) {
        for (let gx = 0; gx < cols; gx += 1) {
          const x = gx * cell
          const y = gy * cell
          const dxc = x - cx
          const dyc = y - cy
          const dc = Math.sqrt(dxc * dxc + dyc * dyc)
          let b = 0.5 + 0.5 * Math.sin(dc * 0.045 - t * 2)
          const dxp = x - pointer.x
          const dyp = y - pointer.y
          const dp2 = dxp * dxp + dyp * dyp
          const radius = 120
          if (dp2 < radius * radius) {
            b += (1 - Math.sqrt(dp2) / radius) * 0.8
          }
          b = Math.max(0, Math.min(1, b))
          const ch = CHARS[Math.round(b * (CHARS.length - 1))]
          if (ch === ' ') continue
          ctx.fillStyle = b > 0.62 ? ink : muted
          ctx.fillText(ch, x, y)
        }
      }
    }

    resize()

    const observer = new ResizeObserver(() => { resize(); draw() })
    observer.observe(canvas)

    if (reduceMotion) {
      draw()
    } else {
      const loop = () => {
        t += 0.02
        draw()
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      if (reduceMotion) draw()
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
      if (reduceMotion) draw()
    }
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
    <div className="ascii-art-demo">
      <canvas ref={canvasRef} className="ascii-art-demo__canvas" />
      <div className="demo-hud" aria-hidden="true">
        <span>ASCII FIELD</span>
        <span>POINTER · WAVE</span>
      </div>
    </div>
  )
}
