import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { projectsData } from '../data/projectsData'

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Trigger entrance animation after mount
    const timer = setTimeout(() => setMounted(true), 20)
    return () => clearTimeout(timer)
  }, [])

  const project = projectsData.find((p) => p.id === id)

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    padding: '6rem 2rem 4rem',
    background: 'var(--bg-primary, #0a0a0f)',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  }

  const contentStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 600ms ease, transform 600ms ease',
  }

  if (!project) {
    return (
      <div style={pageStyle}>
        <div style={contentStyle}>
          <h1
            style={{
              fontSize: '2rem',
              color: '#00ffff',
              marginBottom: '1rem',
            }}
          >
            {t('notFound.title')}
          </h1>
          <p style={{ color: 'rgba(200, 220, 255, 0.75)', marginBottom: '2rem' }}>
            {t('notFound.desc')}
          </p>
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
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        {/* Back link */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(0, 255, 255, 0.7)',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: '0.85rem',
            cursor: 'pointer',
            marginBottom: '2rem',
            padding: 0,
            transition: 'color 200ms ease',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#00ffff')}
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(0, 255, 255, 0.7)')
          }
        >
          {t('projects.backToList')}
        </button>

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: '#00ffff',
            marginBottom: '1.5rem',
            textShadow: '0 0 12px rgba(0, 255, 255, 0.4)',
          }}
        >
          {project.name}
        </h1>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.75rem',
                color: '#0080ff',
                border: '1px solid rgba(0, 128, 255, 0.4)',
                borderRadius: '2px',
                padding: '3px 8px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Full description */}
        <p
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.8,
            color: 'rgba(200, 220, 255, 0.85)',
            marginBottom: '2rem',
          }}
        >
          {project.fullDescription ?? project.description}
        </p>

        {/* Tech stack */}
        <div style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontSize: '1rem',
              color: '#00ffff',
              marginBottom: '0.75rem',
              letterSpacing: '0.1em',
            }}
          >
            {t('projects.techStack')}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.techStack.map((tech) => (
              <span
                key={tech}
                style={{
                  fontSize: '0.8rem',
                  color: 'rgba(200, 220, 255, 0.8)',
                  background: 'rgba(0, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 255, 255, 0.2)',
                  borderRadius: '2px',
                  padding: '4px 10px',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Demo link */}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              color: '#00ffff',
              textDecoration: 'none',
              border: '1px solid #00ffff',
              padding: '0.5rem 1.5rem',
              fontSize: '0.85rem',
              transition: 'all 200ms ease',
              marginBottom: '2rem',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'rgba(0, 255, 255, 0.1)'
              el.style.boxShadow = '0 0 12px rgba(0, 255, 255, 0.4)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'transparent'
              el.style.boxShadow = 'none'
            }}
          >
            {t('projects.demo')} ↗
          </a>
        )}

        {/* Screenshots */}
        {project.screenshots && project.screenshots.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {project.screenshots.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${project.name} screenshot ${i + 1}`}
                style={{
                  width: '100%',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 255, 255, 0.2)',
                }}
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectDetailPage
