import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <section className="gallery-page not-found-page">
      <h1>404</h1>
      <p className="not-found-page__description">{t('notFound.desc')}</p>
      <div className="not-found-page__actions">
        <Link className="not-found-page__link" to="/">
          {t('common.backHome')}
        </Link>
        <Link className="not-found-page__link" to="/vault">
          {t('common.backVault')}
        </Link>
      </div>
    </section>
  )
}
