import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
  index: number
  isVisible: boolean
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, isVisible }) => {
  const navigate = useNavigate()
  const delay = index * 100

  const truncatedDesc =
    project.description.length > 120
      ? project.description.slice(0, 120) + '…'
      : project.description

  const handleClick = () => {
    navigate(`/projects/${project.id}`)
  }

  return (
    <div
      data-testid="project-card"
      data-project-id={project.id}
      onClick={handleClick}
      style={{
        background: 'rgba(0, 128, 255, 0.04)',
        border: '1px solid rgba(0, 255, 255, 0.2)',
        borderRadius: '6px',
        padding: '1.5rem',
        cursor: 'pointer',
        opacity: isVisible ? undefined : 0,
        animation: isVisible ? `projectFadeInUp 400ms ease forwards` : 'none',
        animationDelay: `${delay}ms`,
        transition: 'transform 200ms ease, box-shadow 200ms ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = '0 8px 24px rgba(0, 255, 255, 0.2), 0 0 12px rgba(0, 255, 255, 0.1)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      <h3
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: '1rem',
          fontWeight: 700,
          color: '#00ffff',
          marginBottom: '0.75rem',
        }}
      >
        {project.name}
      </h3>
      <p
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: '0.82rem',
          lineHeight: 1.7,
          color: 'rgba(200, 220, 255, 0.75)',
          marginBottom: '1rem',
        }}
      >
        {truncatedDesc}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: '0.7rem',
              color: '#0080ff',
              border: '1px solid rgba(0, 128, 255, 0.4)',
              borderRadius: '2px',
              padding: '2px 6px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default ProjectCard
