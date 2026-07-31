import { useEffect } from 'react'

export interface PageMeta {
  title: string
  description: string
  image?: string
}

/**
 * @name 同步页面元信息
 * @description 路由变化后同步标题、描述和分享图片；卸载时由下一个页面覆盖。
 */
export function usePageMeta({ title, description, image }: PageMeta): void {
  useEffect(() => {
    document.title = title

    const upsert = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector)
      if (!element) {
        element = document.createElement('meta')
        const [key, name] = selector.includes('property=')
          ? ['property', selector.match(/property="([^"]+)"/)?.[1]]
          : ['name', selector.match(/name="([^"]+)"/)?.[1]]
        if (name) element.setAttribute(key, name)
        document.head.appendChild(element)
      }
      element.setAttribute(attribute, value)
    }

    upsert('meta[name="description"]', 'content', description)
    upsert('meta[property="og:title"]', 'content', title)
    upsert('meta[property="og:description"]', 'content', description)
    if (image) {
      upsert('meta[property="og:image"]', 'content', image)
    } else {
      document.head.querySelector('meta[property="og:image"]')?.remove()
    }
  }, [description, image, title])
}
