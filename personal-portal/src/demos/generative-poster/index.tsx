import { useCallback, useEffect, useRef, useState } from 'react'

/** @name mulberry32 伪随机数生成器(同一 seed 产出确定序列) */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** @name 读取主题 CSS 变量 */
function readColor(el: HTMLElement, name: string, fallback: string): string {
  const value = getComputedStyle(el).getPropertyValue(name).trim()
  return value || fallback
}

/**
 * @name 生成海报 Demo
 * @description 用 seed 驱动 mulberry32 伪随机,在网格上确定性地拼出几何构成(圆/方/斜线/半圆);
 *   同一 seed 永远同一张。「重新生成」换 seed,「下载 PNG」导出当前画布。纯静态绘制。
 */
export default function GenerativePosterDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const ink = readColor(canvas, '--color-accent', '#7188ff')
    const paper = readColor(canvas, '--color-gallery', '#0b0c0f')
    const light = readColor(canvas, '--color-text', '#e8e8ea')

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = rect.width
      const h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const rand = mulberry32(seed)
      const palette = [ink, light, paper]
      ctx.fillStyle = paper
      ctx.fillRect(0, 0, w, h)

      const cols = 3 + Math.floor(rand() * 4)
      const rows = 3 + Math.floor(rand() * 4)
      const cw = w / cols
      const ch = h / rows
      for (let i = 0; i < cols; i += 1) {
        for (let j = 0; j < rows; j += 1) {
          const x = i * cw
          const y = j * ch
          const kind = rand()
          ctx.fillStyle = palette[Math.floor(rand() * palette.length)]
          ctx.strokeStyle = ink
          ctx.lineWidth = 1.5
          if (kind < 0.34) {
            ctx.beginPath()
            ctx.arc(x + cw / 2, y + ch / 2, Math.min(cw, ch) * (0.2 + rand() * 0.24), 0, Math.PI * 2)
            ctx.fill()
          } else if (kind < 0.58) {
            const pad = Math.min(cw, ch) * 0.18
            ctx.fillRect(x + pad, y + pad, cw - pad * 2, ch - pad * 2)
          } else if (kind < 0.8) {
            ctx.beginPath()
            ctx.moveTo(x, y + (rand() < 0.5 ? 0 : ch))
            ctx.lineTo(x + cw, y + (rand() < 0.5 ? 0 : ch))
            ctx.stroke()
          } else {
            ctx.beginPath()
            ctx.arc(x + cw / 2, y + ch / 2, Math.min(cw, ch) * 0.4, 0, Math.PI)
            ctx.fill()
          }
        }
      }
    }

    draw()
    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [seed])

  const regenerate = useCallback(() => setSeed(Math.floor(Math.random() * 1e9)), [])

  const download = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `poster-${seed}.png`
      anchor.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }, [seed])

  return (
    <div className="generative-poster-demo">
      <canvas ref={canvasRef} className="generative-poster-demo__canvas" />
      <div className="generative-poster-demo__controls">
        <button type="button" onClick={regenerate}>重新生成</button>
        <button type="button" onClick={download}>下载 PNG</button>
      </div>
    </div>
  )
}
