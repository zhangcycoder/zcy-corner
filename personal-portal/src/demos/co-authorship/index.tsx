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

type NodeKind = 'zcy' | 'claude' | 'work'

interface GraphNode {
  id: string
  label: string
  kind: NodeKind
  x: number
  y: number
  vx: number
  vy: number
}

/** @name 共建节点定义(真实协作范围) */
const NODE_DEFS: { id: string, label: string, kind: NodeKind }[] = [
  { id: 'zcy', label: 'ZCY', kind: 'zcy' },
  { id: 'claude', label: 'Claude', kind: 'claude' },
  { id: 'config', label: 'Claude Code 配置', kind: 'work' },
  { id: 'mobile', label: '移动端适配', kind: 'work' },
  { id: 'flow', label: '流场墨迹', kind: 'work' },
  { id: 'ascii', label: 'ASCII 艺术', kind: 'work' },
  { id: 'poster', label: '生成海报', kind: 'work' },
  { id: 'physics', label: '物理沙盘', kind: 'work' },
  { id: 'colophon', label: '共建后记', kind: 'work' },
]

/**
 * @name 共建脉络 Demo
 * @description 力导向图:每件共建产物同时连向 ZCY 与 Claude 两个核心,构成一张人机共同拉起的网。
 *   斥力 + 弹簧 + 双核软锚定自动布局,可拖拽节点重新找平衡,指针靠近时高亮。跟随「减少动态效果」:
 *   开启时先迭代收敛到静态平衡再停。由 Claude 设计与实现。
 */
export default function CoAuthorshipDemo() {
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

    const accent = readColor(canvas, '--color-accent', '#7188ff')
    const paper = readColor(canvas, '--color-gallery', '#0b0c0f')
    const text = readColor(canvas, '--color-text', '#e8e8ea')
    const muted = readColor(canvas, '--color-muted-dark', '#8a90a0')
    const mono = readColor(canvas, '--font-mono', 'monospace')
    const pointer = { x: 0, y: 0 }

    let width = 0
    let height = 0
    let raf = 0
    let dragIndex = -1
    let hoverIndex = -1
    let zcyIndex = 0
    let claudeIndex = 1

    const nodes: GraphNode[] = NODE_DEFS.map((d) => ({ ...d, x: 0, y: 0, vx: 0, vy: 0 }))
    const workIndices: number[] = []
    nodes.forEach((n, i) => {
      if (n.kind === 'zcy') zcyIndex = i
      else if (n.kind === 'claude') claudeIndex = i
      else workIndices.push(i)
    })
    const edges: { a: number, b: number }[] = []
    for (const wi of workIndices) {
      edges.push({ a: wi, b: zcyIndex })
      edges.push({ a: wi, b: claudeIndex })
    }

    const layoutInit = () => {
      nodes[zcyIndex].x = width * 0.28
      nodes[zcyIndex].y = height * 0.5
      nodes[claudeIndex].x = width * 0.72
      nodes[claudeIndex].y = height * 0.5
      workIndices.forEach((wi, k) => {
        const a = (k / workIndices.length) * Math.PI * 2
        nodes[wi].x = width * 0.5 + Math.cos(a) * width * 0.18
        nodes[wi].y = height * 0.5 + Math.sin(a) * height * 0.28
      })
      for (const n of nodes) { n.vx = 0; n.vy = 0 }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const simulate = () => {
      const repulse = 2400
      const spring = 0.015
      const restLen = Math.min(width, height) * 0.26
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dx = nodes[j].x - nodes[i].x
          const dy = nodes[j].y - nodes[i].y
          const d2 = dx * dx + dy * dy || 1
          const d = Math.sqrt(d2)
          const f = repulse / d2
          const fx = (dx / d) * f
          const fy = (dy / d) * f
          nodes[i].vx -= fx
          nodes[i].vy -= fy
          nodes[j].vx += fx
          nodes[j].vy += fy
        }
      }
      for (const e of edges) {
        const a = nodes[e.a]
        const b = nodes[e.b]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.sqrt(dx * dx + dy * dy) || 1
        const f = (d - restLen) * spring
        const fx = (dx / d) * f
        const fy = (dy / d) * f
        a.vx += fx
        a.vy += fy
        b.vx -= fx
        b.vy -= fy
      }
      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i]
        if (n.kind === 'zcy') {
          n.vx += (width * 0.28 - n.x) * 0.01
          n.vy += (height * 0.5 - n.y) * 0.01
        } else if (n.kind === 'claude') {
          n.vx += (width * 0.72 - n.x) * 0.01
          n.vy += (height * 0.5 - n.y) * 0.01
        } else {
          n.vx += (width * 0.5 - n.x) * 0.001
          n.vy += (height * 0.5 - n.y) * 0.001
        }
        if (i === dragIndex) {
          n.x = pointer.x
          n.y = pointer.y
          n.vx = 0
          n.vy = 0
          continue
        }
        n.vx *= 0.86
        n.vy *= 0.86
        n.x += n.vx
        n.y += n.vy
        const pad = 44
        n.x = Math.max(pad, Math.min(width - pad, n.x))
        n.y = Math.max(pad, Math.min(height - pad, n.y))
      }
    }

    const draw = () => {
      ctx.fillStyle = paper
      ctx.fillRect(0, 0, width, height)
      ctx.strokeStyle = accent
      ctx.globalAlpha = 0.28
      ctx.lineWidth = 1
      ctx.beginPath()
      for (const e of edges) {
        ctx.moveTo(nodes[e.a].x, nodes[e.a].y)
        ctx.lineTo(nodes[e.b].x, nodes[e.b].y)
      }
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.textAlign = 'center'
      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i]
        const isCore = n.kind !== 'work'
        const active = i === hoverIndex || i === dragIndex
        const r = (isCore ? 12 : 6) + (active ? 2 : 0)
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        if (n.kind === 'claude') {
          ctx.fillStyle = paper
          ctx.strokeStyle = text
          ctx.lineWidth = 2
          ctx.fill()
          ctx.stroke()
        } else {
          ctx.fillStyle = accent
          ctx.fill()
        }
        ctx.fillStyle = isCore || active ? text : muted
        ctx.font = `${isCore ? 13 : 11}px ${mono}`
        ctx.fillText(n.label, n.x, n.y + r + 15)
      }
      ctx.textAlign = 'start'
    }

    resize()
    layoutInit()

    const observer = new ResizeObserver(() => { resize(); layoutInit() })
    observer.observe(canvas)

    if (reduceMotion) {
      for (let i = 0; i < 260; i += 1) simulate()
      draw()
    } else {
      const loop = () => {
        simulate()
        draw()
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    const toLocal = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      return { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    const nearest = (x: number, y: number, maxD: number) => {
      let best = -1
      let bestD = maxD * maxD
      for (let i = 0; i < nodes.length; i += 1) {
        const dx = nodes[i].x - x
        const dy = nodes[i].y - y
        const d2 = dx * dx + dy * dy
        if (d2 < bestD) { bestD = d2; best = i }
      }
      return best
    }
    const onDown = (event: PointerEvent) => {
      const local = toLocal(event)
      pointer.x = local.x
      pointer.y = local.y
      dragIndex = nearest(local.x, local.y, 30)
      if (dragIndex >= 0) canvas.setPointerCapture(event.pointerId)
    }
    const onMove = (event: PointerEvent) => {
      const local = toLocal(event)
      pointer.x = local.x
      pointer.y = local.y
      hoverIndex = dragIndex >= 0 ? dragIndex : nearest(local.x, local.y, 24)
      if (reduceMotion && dragIndex >= 0) { simulate(); draw() }
    }
    const onUp = (event: PointerEvent) => {
      dragIndex = -1
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    }
    const onLeave = () => { hoverIndex = -1 }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [reduceMotion])

  return (
    <div className="co-authorship-demo">
      <canvas ref={canvasRef} className="co-authorship-demo__canvas" />
      <div className="demo-hud" aria-hidden="true">
        <span>CO-AUTHORSHIP</span>
        <span>DRAG · FORCE GRAPH</span>
      </div>
    </div>
  )
}
