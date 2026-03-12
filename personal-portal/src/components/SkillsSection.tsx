import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { skillsData } from '../data/skillsData'
import type { Skill } from '../types'

// Inject progress bar animation once
const SKILLS_STYLE_ID = 'skills-keyframes'
function injectSkillsStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(SKILLS_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = SKILLS_STYLE_ID
  style.textContent = `
    @keyframes skillFadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes progressGrow {
      from { width: 0%; }
    }
  `
  document.head.appendChild(style)
}
injectSkillsStyles()

interface SkillCardProps {
  skill: Skill
  index: number
  isVisible: boolean
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, index, isVisible }) => {
  const delay = index * 80
  const proficiency = skill.proficiency !== undefined
    ? Math.min(100, Math.max(0, skill.proficiency))
    : undefined

  return (
    <div
      data-testid="skill-card"
      data-skill-name={skill.name}
      style={{
        background: 'rgba(0, 255, 255, 0.03)',
        border: '1px solid rgba(0, 255, 255, 0.2)',
        borderRadius: '4px',
        padding: '1rem',
        opacity: isVisible ? undefined : 0,
        animation: isVisible ? `skillFadeInUp 400ms ease forwards` : 'none',
        animationDelay: `${delay}ms`,
        transition: 'box-shadow 150ms ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 12px #00ffff'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {skill.icon && <span style={{ fontSize: '1.2rem' }}>{skill.icon}</span>}
        <span
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: '0.9rem',
            color: '#e0e0e0',
            fontWeight: 600,
          }}
        >
          {skill.name}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: '0.7rem',
          color: 'rgba(0, 255, 255, 0.6)',
          marginBottom: proficiency !== undefined ? '0.5rem' : 0,
        }}
      >
        {skill.category}
      </div>
      {proficiency !== undefined && (
        <div
          data-testid="skill-progress-bar"
          style={{
            height: '3px',
            background: 'rgba(0, 255, 255, 0.15)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: isVisible ? `${proficiency}%` : '0%',
              background: 'linear-gradient(90deg, #0080ff, #00ffff)',
              boxShadow: '0 0 6px rgba(0, 255, 255, 0.6)',
              animation: isVisible ? `progressGrow 600ms ease forwards ${delay + 200}ms` : 'none',
              transition: isVisible ? `width 600ms ease ${delay + 200}ms` : 'none',
            }}
            data-proficiency={proficiency}
          />
        </div>
      )}
    </div>
  )
}

const SkillsSection: React.FC = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 })

  return (
    <section
      id="skills"
      ref={sectionRef}
      data-testid="skills-section"
      style={{
        minHeight: '100vh',
        padding: '5rem 2rem',
        background: 'var(--bg-primary, #0a0a0f)',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
          {t('skills.title')}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {skillsData.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SkillsSection
