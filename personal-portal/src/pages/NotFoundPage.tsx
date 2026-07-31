import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <section className="gallery-page not-found-page">
      <h1>{t('notFound.title')}</h1>
      <p className="not-found-page__description">{t('notFound.desc')}</p>
      <Link className="not-found-page__link" to="/">
        {t('notFound.back')}
      </Link>
    </section>
  )
}
