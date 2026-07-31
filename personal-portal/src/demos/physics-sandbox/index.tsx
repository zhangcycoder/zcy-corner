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

interface Point {
  x: number
  y: number
  px: number
  py: number
  pinned: boolean
}

interface Link {
  a: number
  b: number
  len: number
}

/**
 * @name 物理沙盘 Demo
 * @description Verlet 积分模拟一块顶边部分固定的布料,距离约束每帧迭代收敛;指针/触摸抓起最近节点拖拽。
 *   跟随「减少动态效果」:开启时关闭重力,布料静置,仅拖拽产生局部扰动。
 */
export default function PhysicsSandboxDemo() {
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
    const gravity = reduceMotion ? 0 : 0.4
    const pointer = { x: 0, y: 0 }

    let width = 0
    let height = 0
    let points: Point[] = []
    let links: Link[] = []
    let raf = 0
    let dragIndex = -1

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = 14
      const rows = 10
      const gap = Math.min(width / (cols + 1), (height * 0.72) / rows)
      const originX = (width - gap * (cols - 1)) / 2
      const originY = height * 0.12
      points = []
      links = []
      for (let j = 0; j < rows; j += 1) {
        for (let i = 0; i < cols; i += 1) {
          const x = originX + i * gap
          const y = originY + j * gap
          points.push({ x, y, px: x, py: y, pinned: j === 0 && i % 3 === 0 })
        }
      }
      const at = (i: number, j: number) => j * cols + i
      for (let j = 0; j < rows; j += 1) {
        for (let i = 0; i < cols; i += 1) {
          if (i < cols - 1) links.push({ a: at(i, j), b: at(i + 1, j), len: gap })
          if (j < rows - 1) links.push({ a: at(i, j), b: at(i, j + 1), len: gap })
        }
      }
    }

    const simulate = () => {
      for (const p of points) {
        if (p.pinned) continue
        const vx = (p.x - p.px) * 0.98
        const vy = (p.y - p.py) * 0.98
        p.px = p.x
        p.py = p.y
        p.x += vx
        p.y += vy + gravity
      }
      for (let k = 0; k < 3; k += 1) {
        for (const l of links) {
          const a = points[l.a]
          const b = points[l.b]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const d = Math.sqrt(dx * dx + dy * dy) || 1
          const diff = (l.len - d) / d / 2
          const ox = dx * diff
          const oy = dy * diff
          if (!a.pinned) { a.x -= ox; a.y -= oy }
          if (!b.pinned) { b.x += ox; b.y += oy }
        }
      }
      if (dragIndex >= 0) {
        const p = points[dragIndex]
        p.x = pointer.x
        p.y = pointer.y
        p.px = pointer.x
        p.py = pointer.y
      }
    }

    const draw = () => {
      ctx.fillStyle = paper
      ctx.fillRect(0, 0, width, height)
      ctx.strokeStyle = ink
      ctx.globalAlpha = 0.6
      ctx.lineWidth = 1
      ctx.beginPath()
      for (const l of links) {
        const a = points[l.a]
        const b = points[l.b]
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
      }
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    build()

    const loop = () => {
      simulate()
      draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const observer = new ResizeObserver(() => build())
    observer.observe(canvas)

    const toLocal = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      return { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    const onDown = (event: PointerEvent) => {
      const local = toLocal(event)
      pointer.x = local.x
      pointer.y = local.y
      let best = -1
      let bestD = 24 * 24
      for (let i = 0; i < points.length; i += 1) {
        const dx = points[i].x - local.x
        const dy = points[i].y - local.y
        const d2 = dx * dx + dy * dy
        if (d2 < bestD) { bestD = d2; best = i }
      }
      dragIndex = best
      if (best >= 0) canvas.setPointerCapture(event.pointerId)
    }
    const onMove = (event: PointerEvent) => {
      const local = toLocal(event)
      pointer.x = local.x
      pointer.y = local.y
    }
    const onUp = (event: PointerEvent) => {
      dragIndex = -1
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [reduceMotion])

  return (
    <div className="physics-sandbox-demo">
      <canvas ref={canvasRef} className="physics-sandbox-demo__canvas" />
      <div className="demo-hud" aria-hidden="true">
        <span>VERLET CLOTH</span>
        <span>DRAG TO PULL</span>
      </div>
    </div>
  )
}
