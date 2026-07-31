import { lazy, Suspense, useMemo } from 'react'
import { loadDemo } from '../../demos/registry'
import DemoBoundary from './DemoBoundary'

interface DemoStageProps {
  demoKey?: string
}

/**
 * @name 藏品 Demo 舞台
 * @description 按注册表延迟加载实验，并隔离加载与渲染失败。
 * @param demoKey 藏品元数据中声明的 Demo 标识；缺失时不渲染舞台。
 */
export default function DemoStage({ demoKey }: DemoStageProps) {
  const loader = loadDemo(demoKey)
  const Demo = useMemo(
    () => loader ? lazy(loader) : undefined,
    [loader],
  )

  if (!demoKey) return null

  if (!Demo) {
    return (
      <div className="demo-fallback" role="status">
        <p>这个实验尚未注册可运行版本。</p>
        <p>正文与资源仍可继续查看。</p>
      </div>
    )
  }

  return (
    <section className="demo-stage" aria-label="交互演示">
      <DemoBoundary key={demoKey}>
        <Suspense
          fallback={(
            <div className="demo-loading" role="status">
              正在载入实验…
            </div>
          )}
        >
          <Demo />
        </Suspense>
      </DemoBoundary>
    </section>
  )
}
