import { Link } from 'react-router-dom'

/**
 * @name 站点页脚
 * @description 为所有路由提供统一的站点落款、共建署名与视觉场景索引。
 */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__brand">ZCY CORNER</p>
        <p className="site-footer__coauthor">
          <Link to="/vault/co-authored">ZCY × CLAUDE</Link>
        </p>
        <p className="site-footer__index">GALLERY / PAPER · 2026</p>
      </div>
    </footer>
  )
}
