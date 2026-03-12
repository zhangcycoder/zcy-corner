import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { projectsData } from '../data/projectsData'
import ProjectCard from './ProjectCard'

// Inject animation once
const PROJECTS_STYLE_ID = 'projects-keyframes'
function injectProjectsStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(PROJECTS_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = PROJECTS_STYLE_ID
  style.textContent = `
    @keyframes projectFadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `
  document.head.appendChild(style)
}
injectProjectsStyles()

const ProjectsSection: React.FC = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 })

  return (
    <section
      id="projects"
      ref={sectionRef}
      data-testid="projects-section"
      style={{
        minHeight: '100vh',
        padding: '5rem 2rem',
        background: 'var(--bg-primary, #0a0a0f)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: '2rem',
            fontWeight: 700,
            color: '#00ffff',
            marginBottom: '3rem',
            textAlign: 'center',
            textShadow: '0 0 12px rgba(0, 255, 255, 0.4)',
          }}
        >
          {t('projects.title')}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {projectsData.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
