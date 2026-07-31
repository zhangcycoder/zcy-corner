import { matchPath, Outlet, useLocation } from 'react-router-dom'
import { getTreasureBySlug } from '../../content/contentLoader'
import SiteFooter from './SiteFooter'
import SiteHeader, { type SiteScene } from './SiteHeader'

/**
 * @name 站点框架
 * @description 根据简历路由与藏品类型切换 Gallery 或 Paper 场景，并承载子路由。
 */
export default function SiteShell() {
  const { pathname } = useLocation()
  const detailMatch = matchPath('/vault/:slug', pathname)
  const resumeMatch = matchPath('/resume', pathname)
  const treasure = getTreasureBySlug(detailMatch?.params.slug)
  const scene: SiteScene = resumeMatch || treasure?.type === 'note'
    ? 'paper'
    : 'gallery'

  return (
    <div className="site-shell" data-scene={scene}>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <SiteHeader scene={scene} />
      <main id="main-content">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
