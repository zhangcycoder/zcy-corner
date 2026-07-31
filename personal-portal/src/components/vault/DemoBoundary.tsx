import { Component, type ReactNode } from 'react'

interface DemoBoundaryProps {
  children: ReactNode
}

interface DemoBoundaryState {
  hasError: boolean
}

/**
 * @name Demo 错误边界
 * @description 隔离藏品实验的渲染错误，避免影响详情正文与资源链接。
 */
export default class DemoBoundary extends Component<
  DemoBoundaryProps,
  DemoBoundaryState
> {
  state: DemoBoundaryState = { hasError: false }

  static getDerivedStateFromError(): DemoBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="demo-fallback" role="status">
          <p>这个实验暂时无法运行。</p>
          <p>正文与源码仍可继续查看。</p>
        </div>
      )
    }

    return this.props.children
  }
}
