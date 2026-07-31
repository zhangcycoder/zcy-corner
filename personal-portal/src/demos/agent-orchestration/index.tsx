// src/demos/agent-orchestration/index.tsx
import { useState } from 'react'
import { ORCHESTRATION_STEPS } from './steps'

/**
 * @name Agent 编排体系旗舰 demo
 * @description 单步回放本站自身的受治理构建循环(6 步),每步展示真实退出码/事件,
 *   可展开原始产物。用户驱动、无自动播放,尊重 reduced-motion。
 */
export default function AgentOrchestrationDemo() {
  const [step, setStep] = useState(0)
  const total = ORCHESTRATION_STEPS.length
  const current = ORCHESTRATION_STEPS[step]

  return (
    <div className="agent-demo">
      <ol className="agent-demo__rail" aria-label="编排流水线">
        {ORCHESTRATION_STEPS.map((item, index) => (
          <li
            key={item.rail}
            className={
              'agent-demo__stage'
              + (index < step ? ' is-done' : '')
              + (index === step ? ' is-current' : '')
            }
            aria-current={index === step ? 'step' : undefined}
          >
            <span className="agent-demo__stage-n">{String(index + 1).padStart(2, '0')}</span>
            {item.rail}
          </li>
        ))}
      </ol>

      <div className="agent-demo__panel">
        <p className="agent-demo__kicker">STEP {step + 1} / {total}</p>
        <h3 className="agent-demo__title">{current.title}</h3>
        <p className="agent-demo__body">{current.body}</p>

        <pre className="agent-demo__evidence" aria-label="这一步的真实证据">
          {current.evidence.join('\n')}
        </pre>

        <details className="agent-demo__raw">
          <summary>▸ {current.raw.label}</summary>
          <pre>{current.raw.lines.join('\n')}</pre>
        </details>
      </div>

      <div className="agent-demo__nav">
        <button
          type="button"
          className="agent-demo__btn"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          disabled={step === 0}
        >
          ← 上一步
        </button>
        <span className="agent-demo__dots" aria-hidden="true">
          {ORCHESTRATION_STEPS.map((item, index) => (
            <span key={item.rail} className={index === step ? 'is-on' : ''}>●</span>
          ))}
        </span>
        <button
          type="button"
          className="agent-demo__btn"
          onClick={() => setStep((value) => Math.min(total - 1, value + 1))}
          disabled={step === total - 1}
        >
          下一步 →
        </button>
      </div>
    </div>
  )
}
