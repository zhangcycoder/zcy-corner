import { useEffect, useRef, useState } from 'react'

type Phase = 'idle' | 'streaming' | 'done'

/** @name 预置的助手回复 */
// 全部内容都是预先写好的,由浏览器在本地按节奏吐出,不连接网络、不调用任何模型。
const RESPONSE = `流式生成 UI 的意义,在于把「等待」变成「陪伴」。模型逐 token 吐字,前端不必攒齐整段再一次性呈现,而是让文字像现在这样一小段一小段浮现——响应从「几秒的空白」变成「持续的进展」,人的注意力被稳稳接住。

真正要处理的从来不是动画,而是工程:把新 chunk 增量追加进已有内容,在末尾留一个跳动的光标标记「还在写」,当你没有主动上滑时把视图温柔地锚在底部,并允许你随时按下停止、保留已经生成的半截文字。

这段演示里的每个字都是预先写好的,由浏览器在本地按节奏吐出——它不连接任何网络、不调用任何模型,示范的是「接住 token 流」的前端手法,而不是一次真实的推理。`

/** @name 是否开启系统减少动态效果 */
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** @name 本次吐出的字数(1~3 字) */
const nextChunkSize = () => 1 + Math.floor(Math.random() * 3)

/** @name 下一块到达的间隔(25~45ms) */
const nextDelay = () => 25 + Math.floor(Math.random() * 21)

/**
 * @name 流式生成 UI demo
 * @description 客户端模拟的 token 流:预置回复被逐块吐出,演示增量渲染、可中断、
 *   滚动锚定与减少动态效果降级。全程不触网、不调用真实模型。
 */
export default function StreamingUiDemo() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [text, setText] = useState('')

  const outputRef = useRef<HTMLDivElement>(null)
  // 用户是否仍吸附在输出框底部;上滑离开后置 false,回到底部再置 true
  const stickRef = useRef(true)
  const timerRef = useRef<number | null>(null)
  const indexRef = useRef(0)

  // 卸载时清掉挂起的定时器
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  // 文本增长后,只有仍吸附底部时才滚到底,避免打断向上翻阅
  useEffect(() => {
    const el = outputRef.current
    if (stickRef.current && el) el.scrollTop = el.scrollHeight
  }, [text])

  const handleScroll = () => {
    const el = outputRef.current
    if (!el) return
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24
  }

  /** @name 吐出下一块 token */
  const step = () => {
    const next = Math.min(indexRef.current + nextChunkSize(), RESPONSE.length)
    indexRef.current = next
    setText(RESPONSE.slice(0, next))
    if (next >= RESPONSE.length) {
      timerRef.current = null
      setPhase('done')
      return
    }
    timerRef.current = window.setTimeout(step, nextDelay())
  }

  /** @name 开始生成 */
  const start = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    indexRef.current = 0
    stickRef.current = true
    // 减少动态效果:一次性给出完整文本,不逐块、不闪烁光标
    if (prefersReducedMotion()) {
      setText(RESPONSE)
      setPhase('done')
      return
    }
    setText('')
    setPhase('streaming')
    timerRef.current = window.setTimeout(step, 25)
  }

  const stop = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    // 保留已经生成的半截文字
    setPhase('done')
  }

  const statusLabel = phase === 'idle' ? '待生成' : phase === 'streaming' ? '生成中…' : '已完成'

  return (
    <div className="streaming-ui-demo">
      <div className="streaming-ui-demo__bar">
        <button
          type="button"
          className="streaming-ui-demo__btn"
          onClick={start}
          disabled={phase !== 'idle'}
        >
          生成
        </button>
        <button
          type="button"
          className="streaming-ui-demo__btn"
          onClick={stop}
          disabled={phase !== 'streaming'}
        >
          停止
        </button>
        <button
          type="button"
          className="streaming-ui-demo__btn"
          onClick={start}
          disabled={phase === 'idle'}
        >
          重新生成
        </button>
        <span className="streaming-ui-demo__status" aria-hidden="true">{statusLabel}</span>
      </div>

      <div
        ref={outputRef}
        className="streaming-ui-demo__output"
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-label="流式输出"
      >
        {text || <span className="streaming-ui-demo__placeholder">按「生成」开始逐字吐出预置回复…</span>}
        {phase === 'streaming' && <span className="streaming-ui-demo__caret" aria-hidden="true" />}
      </div>

      <p className="streaming-ui-demo__note" role="status">
        模拟 token 流:回复内容预先写好,由浏览器在本地按节奏吐出,不触网、不调用真实模型。
        开启系统「减少动态效果」时,「生成」会一次性给出完整文本。
      </p>
    </div>
  )
}
