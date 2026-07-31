import { useEffect, useRef, useState } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
/** @name 隐藏层单元数 */
const HIDDEN = 10
/** @name 每次训练的学习率 */
const LEARNING_RATE = 0.35
/** @name 动画模式下每帧训练的 epoch 数 */
const EPOCHS_PER_FRAME = 3
/** @name 减少动态效果时,单次「训练」同步跑的 epoch 数 */
const REDUCED_BURST = 320

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

/** @name 把 #rrggbb 解析为 [r,g,b] */
function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean
  const num = Number.parseInt(full.slice(0, 6) || '000000', 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

/** 一个带真实标签的训练样本,坐标已归一化到约 [-1, 1] */
interface Sample {
  x: number
  y: number
  /** 真实类别:0 或 1 */
  label: 0 | 1
}

/**
 * 一个 2 → 隐藏层(tanh) → 1(sigmoid)的两层 MLP。
 * 权重全部是明文数组,前向与反向传播都在本文件里手写,不依赖任何机器学习库。
 */
interface Net {
  /** 输入层到隐藏层权重,形状 HIDDEN×2 */
  w1: number[][]
  /** 隐藏层偏置,长度 HIDDEN */
  b1: number[]
  /** 隐藏层到输出的权重,长度 HIDDEN */
  w2: number[]
  /** 输出偏置 */
  b2: number
}

const sigmoid = (z: number): number => 1 / (1 + Math.exp(-z))

/** @name 小随机数初始化一个新网络 */
function createNet(): Net {
  const rand = () => (Math.random() - 0.5) * 1.4
  return {
    w1: Array.from({ length: HIDDEN }, () => [rand(), rand()]),
    b1: Array.from({ length: HIDDEN }, () => 0),
    w2: Array.from({ length: HIDDEN }, () => rand()),
    b2: 0,
  }
}

/**
 * @name 前向传播
 * @returns out 为 sigmoid 输出(0~1),a1 为隐藏层激活(反向传播时复用)
 */
function forward(net: Net, x: number, y: number): { out: number; a1: number[] } {
  const a1 = new Array<number>(HIDDEN)
  let z2 = net.b2
  for (let j = 0; j < HIDDEN; j += 1) {
    const z1 = net.w1[j][0] * x + net.w1[j][1] * y + net.b1[j]
    const a = Math.tanh(z1)
    a1[j] = a
    z2 += net.w2[j] * a
  }
  return { out: sigmoid(z2), a1 }
}

/**
 * @name 一个 epoch 的批量梯度下降
 * @description 对全部样本做前向 + 反向传播,累加梯度后一次性更新权重。
 *   损失为二元交叉熵(BCE),配 sigmoid 输出时输出层误差恰为 (out - y)。
 * @returns 本轮更新前的平均 BCE 损失;样本为空时返回 NaN。
 */
function trainEpoch(net: Net, data: Sample[], lr: number): number {
  const n = data.length
  if (n === 0) return Number.NaN

  const gW1 = Array.from({ length: HIDDEN }, () => [0, 0])
  const gB1 = new Array<number>(HIDDEN).fill(0)
  const gW2 = new Array<number>(HIDDEN).fill(0)
  let gB2 = 0
  let loss = 0

  for (const s of data) {
    const { out, a1 } = forward(net, s.x, s.y)
    const clamped = Math.min(Math.max(out, 1e-7), 1 - 1e-7)
    loss += -(s.label * Math.log(clamped) + (1 - s.label) * Math.log(1 - clamped))

    // BCE + sigmoid 的输出层梯度直接是 (out - y)
    const dz2 = out - s.label
    gB2 += dz2
    for (let j = 0; j < HIDDEN; j += 1) {
      gW2[j] += dz2 * a1[j]
      // 反传到隐藏层,tanh 导数为 (1 - a^2)
      const dz1 = dz2 * net.w2[j] * (1 - a1[j] * a1[j])
      gW1[j][0] += dz1 * s.x
      gW1[j][1] += dz1 * s.y
      gB1[j] += dz1
    }
  }

  const scale = lr / n
  for (let j = 0; j < HIDDEN; j += 1) {
    net.w1[j][0] -= scale * gW1[j][0]
    net.w1[j][1] -= scale * gW1[j][1]
    net.b1[j] -= scale * gB1[j]
    net.w2[j] -= scale * gW2[j]
  }
  net.b2 -= scale * gB2
  return loss / n
}

/**
 * @name 播种「同心环」数据集
 * @description 内圈一簇属于类别 1,外圈一环属于类别 0——线性不可分,
 *   必须靠隐藏层弯出一条闭合边界才能分开。
 */
function seedRings(): Sample[] {
  const out: Sample[] = []
  const push = (count: number, min: number, max: number, label: 0 | 1) => {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2
      const radius = min + Math.random() * (max - min)
      out.push({
        x: Math.cos(angle) * radius + (Math.random() - 0.5) * 0.06,
        y: Math.sin(angle) * radius + (Math.random() - 0.5) * 0.06,
        label,
      })
    }
  }
  push(38, 0, 0.42, 1)
  push(44, 0.68, 1.02, 0)
  return out
}

/**
 * @name 浏览器里的神经网络 demo
 * @description 手写的两层 MLP(2 → tanh 隐藏层 → sigmoid),用批量梯度下降实时训练一个
 *   二维二分类任务(同心环),把决策面采样成网格画在 canvas 上,边训练边看边界弯曲。
 *   全程本地纯 JS 数学,不联网、不加载任何模型或机器学习库。
 *   跟随系统「减少动态效果」:开启时不跑 rAF,每次点「训练」同步跑固定轮数后静态渲染一帧。
 */
export default function NeuralNetDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion)
  const [running, setRunning] = useState(false)
  const [epoch, setEpoch] = useState(0)
  const [loss, setLoss] = useState<number | null>(null)
  const [brush, setBrush] = useState<0 | 1>(1)

  // 当前笔刷类别放进 ref,供 canvas 指针回调即时读取(避免每次改笔刷重建引擎)
  const brushRef = useRef<0 | 1>(1)
  useEffect(() => {
    brushRef.current = brush
  }, [brush])

  // 引擎方法挂在 ref 上,供 JSX 里的按钮/画布回调调用
  const engineRef = useRef<{
    toggle: () => void
    reset: () => void
    addPoint: (clientX: number, clientY: number) => void
  } | null>(null)

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

    const paper = parseHex(readColor(canvas, '--color-gallery', '#0b0c0f'))
    const accent = parseHex(readColor(canvas, '--color-accent', '#7188ff'))
    const ink = readColor(canvas, '--color-text', '#f0f0ec')
    const accentCss = readColor(canvas, '--color-accent', '#7188ff')

    let net = createNet()
    let data = seedRings()
    let width = 0
    let height = 0
    let cx = 0
    let cy = 0
    let scale = 1
    let raf = 0
    let isRunning = false
    let epochCount = 0
    let lastLoss = Number.NaN
    let frame = 0

    const CELL = 6

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = width / 2
      cy = height / 2
      // 用较短边定标,保证同心环画成正圆
      scale = (Math.min(width, height) / 2) * 0.92
    }

    /** @name 采样决策面并叠加数据点 */
    const render = () => {
      for (let py = 0; py < height; py += CELL) {
        for (let px = 0; px < width; px += CELL) {
          const nx = (px + CELL / 2 - cx) / scale
          const ny = (py + CELL / 2 - cy) / scale
          const { out } = forward(net, nx, ny)
          const r = Math.round(paper[0] + (accent[0] - paper[0]) * out)
          const g = Math.round(paper[1] + (accent[1] - paper[1]) * out)
          const b = Math.round(paper[2] + (accent[2] - paper[2]) * out)
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
          ctx.fillRect(px, py, CELL, CELL)
        }
      }
      for (const s of data) {
        const px = cx + s.x * scale
        const py = cy + s.y * scale
        ctx.beginPath()
        ctx.arc(px, py, 5, 0, Math.PI * 2)
        ctx.fillStyle = s.label === 1 ? accentCss : ink
        ctx.fill()
        // 深色描边把样本点从决策面里勾出来
        ctx.lineWidth = 1.5
        ctx.strokeStyle = `rgb(${paper[0]}, ${paper[1]}, ${paper[2]})`
        ctx.stroke()
      }
    }

    /** @name 把内部计数同步给 React 状态 */
    const flush = () => {
      setEpoch(epochCount)
      setLoss(Number.isNaN(lastLoss) ? null : lastLoss)
    }

    const loop = () => {
      for (let k = 0; k < EPOCHS_PER_FRAME; k += 1) {
        lastLoss = trainEpoch(net, data, LEARNING_RATE)
        epochCount += 1
      }
      render()
      frame += 1
      if (frame % 5 === 0) flush()
      raf = requestAnimationFrame(loop)
    }

    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      isRunning = false
      setRunning(false)
    }

    /** @name 减少动态效果:同步跑一批训练后静态渲染 */
    const burst = () => {
      for (let k = 0; k < REDUCED_BURST; k += 1) {
        lastLoss = trainEpoch(net, data, LEARNING_RATE)
        epochCount += 1
      }
      render()
      flush()
    }

    const engine = {
      toggle: () => {
        if (reduceMotion) {
          burst()
          return
        }
        if (isRunning) {
          stop()
          return
        }
        isRunning = true
        setRunning(true)
        raf = requestAnimationFrame(loop)
      },
      reset: () => {
        stop()
        net = createNet()
        data = seedRings()
        epochCount = 0
        lastLoss = Number.NaN
        frame = 0
        flush()
        render()
      },
      addPoint: (clientX: number, clientY: number) => {
        const rect = canvas.getBoundingClientRect()
        const nx = (clientX - rect.left - cx) / scale
        const ny = (clientY - rect.top - cy) / scale
        data.push({ x: nx, y: ny, label: brushRef.current })
        if (!isRunning) render()
      },
    }
    engineRef.current = engine

    build()
    render()

    const observer = new ResizeObserver(() => {
      build()
      render()
    })
    observer.observe(canvas)

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault()
      engine.addPoint(event.clientX, event.clientY)
    }
    canvas.addEventListener('pointerdown', onPointerDown)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      engineRef.current = null
    }
  }, [reduceMotion])

  const lossLabel = loss === null ? '—' : loss.toFixed(4)

  return (
    <div className="neural-net-demo">
      <div className="neural-net-demo__bar">
        <button
          type="button"
          className="neural-net-demo__btn"
          onClick={() => engineRef.current?.toggle()}
        >
          {reduceMotion ? '训练一轮' : running ? '暂停' : '训练'}
        </button>
        <button
          type="button"
          className="neural-net-demo__btn"
          onClick={() => engineRef.current?.reset()}
        >
          重置
        </button>
        <button
          type="button"
          className="neural-net-demo__btn"
          onClick={() => setBrush((prev) => (prev === 1 ? 0 : 1))}
        >
          笔刷:{brush === 1 ? '类别 A(内)' : '类别 B(外)'}
        </button>
        <span className="neural-net-demo__stat">
          epoch {epoch} · loss {lossLabel}
        </span>
      </div>
      <canvas ref={canvasRef} className="neural-net-demo__canvas" />
      <p className="neural-net-demo__note" aria-hidden="true">
        点击画布投放当前笔刷类别的样本；蓝色区域是网络判定的类别 A。
      </p>
    </div>
  )
}
