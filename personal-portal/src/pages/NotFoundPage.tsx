import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0f',
        color: '#00ffff',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '0.1em' }}>
        {t('notFound.title')}
      </h1>
      <p style={{ marginBottom: '2rem', color: '#0080ff' }}>{t('notFound.desc')}</p>
      <Link
        to="/"
        style={{
          color: '#00ffff',
          textDecoration: 'none',
          border: '1px solid #00ffff',
          padding: '0.5rem 1.5rem',
          transition: 'all 200ms ease',
        }}
      >
        {t('notFound.back')}
      </Link>
    </div>
  )
}

export default NotFoundPage
