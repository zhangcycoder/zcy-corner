import type { ComponentType } from 'react'

export type DemoKey = 'particle-field' | 'typewriter-effect' | 'agent-orchestration'

type DemoLoader = () => Promise<{ default: ComponentType }>

const demoLoaders: Record<DemoKey, DemoLoader> = {
  'particle-field': () => import('./particle-field'),
  'typewriter-effect': () => import('./typewriter-effect'),
  'agent-orchestration': () => import('./agent-orchestration'),
}

/**
 * @name 加载藏品 Demo
 * @param key 藏品元数据中声明的 Demo 标识。
 * @returns 未注册的 key 返回 undefined，由页面降级为图文说明。
 */
export function loadDemo(key: string | undefined): DemoLoader | undefined {
  return key && key in demoLoaders
    ? demoLoaders[key as DemoKey]
    : undefined
}
