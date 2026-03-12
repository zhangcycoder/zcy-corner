import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

// ─── Exported pure helpers (used by tests) ───────────────────────────────────

/** Returns the animation-delay in ms for a given line index. */
export function getLineDelay(index: number, step = 150): number {
  return index * step
}

/** Default bio lines (used by tests as a stable reference). */
export const bioLines: string[] = [
  '你好，我是一名热爱技术的全栈开发者。',
  '专注于构建高性能、用户友好的 Web 应用。',
  '热衷于开源社区与前沿技术探索。',
]

// ─── Glitch keyframes injected once ──────────────────────────────────────────

const GLITCH_STYLE_ID = 'about-glitch-keyframes'

function injectGlitchStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(GLITCH_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = GLITCH_STYLE_ID
  style.textContent = `
    @keyframes glitch {
      0%   { transform: translate(0); text-shadow: 2px 0 #ff0040, -2px 0 #00ffff; }
      10%  { transform: translate(-3px, 1px); text-shadow: 3px 0 #ff0040, -3px 0 #00ffff; }
      20%  { transform: translate(3px, -1px); text-shadow: -2px 0 #ff0040, 2px 0 #00ffff; }
      30%  { transform: translate(-2px, 2px); text-shadow: 4px 0 #ff0040, -4px 0 #00ffff; }
      40%  { transform: translate(2px, -2px); text-shadow: -3px 0 #ff0040, 3px 0 #00ffff; }
      50%  { transform: translate(-1px, 1px); text-shadow: 2px 0 #ff0040, -2px 0 #00ffff; }
      60%  { transform: translate(1px, -1px); text-shadow: -1px 0 #ff0040, 1px 0 #00ffff; }
      70%  { transform: translate(-2px, 0); text-shadow: 3px 0 #ff0040, -3px 0 #00ffff; }
      80%  { transform: translate(2px, 1px); text-shadow: -2px 0 #ff0040, 2px 0 #00ffff; }
      90%  { transform: translate(-1px, -1px); text-shadow: 1px 0 #ff0040, -1px 0 #00ffff; }
      100% { transform: translate(0); text-shadow: 0 0 8px rgba(0,255,255,0.6); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `
  document.head.appendChild(style)
}

injectGlitchStyles()

// ─── Component ────────────────────────────────────────────────────────────────

const AboutSection: React.FC = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 })

  // Use i18n bio lines, fall back to static bioLines if not an array
  const i18nBio = t('about.bio', { returnObjects: true })
  const activeBioLines: string[] = Array.isArray(i18nBio) ? i18nBio : bioLines

  return (
    <section
      id="about"
      ref={sectionRef}
      data-testid="about-section"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        background: 'var(--bg-primary, #0a0a0f)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4rem',
          maxWidth: '900px',
          width: '100%',
          flexWrap: 'wrap',
        }}
      >
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          <div
            role="img"
            aria-label="个人头像"
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: '2px solid #00ffff',
              boxShadow: '0 0 20px rgba(0,255,255,0.4), 0 0 40px rgba(0,255,255,0.15)',
              background: 'linear-gradient(135deg, #0a0a2e 0%, #001a33 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              color: '#00ffff',
              userSelect: 'none',
            }}
          >
            👤
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <h2
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: '2rem',
              fontWeight: 700,
              color: '#00ffff',
              marginBottom: '1.5rem',
              animation: isVisible ? 'glitch 600ms ease forwards' : 'none',
            }}
          >
            {t('about.title')}
          </h2>

          {/* Bio lines with staggered fade-in */}
          <div>
            {activeBioLines.map((line, i) => (
              <BioLine key={i} text={line} index={i} isVisible={isVisible} />
            ))}
          </div>

          {/* Key info */}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: '0.85rem',
                color: 'rgba(200, 220, 255, 0.7)',
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <span style={{ color: '#00ffff', minWidth: '80px' }}>{t('about.location')}：</span>
              <span>中国 · 上海</span>
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: '0.85rem',
                color: 'rgba(200, 220, 255, 0.7)',
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <span style={{ color: '#00ffff', minWidth: '80px' }}>{t('about.status')}：</span>
              <span style={{ color: '#00ff88' }}>● 开放合作</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── BioLine sub-component ────────────────────────────────────────────────────

interface BioLineProps {
  text: string
  index: number
  isVisible: boolean
}

const BioLine: React.FC<BioLineProps> = ({ text, index, isVisible }) => {
  const delay = getLineDelay(index)

  return (
    <p
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: '0.95rem',
        lineHeight: 1.8,
        color: 'rgba(200, 220, 255, 0.85)',
        opacity: isVisible ? undefined : 0,
        animation: isVisible ? `fadeInUp 400ms ease forwards ${delay}ms` : 'none',
      }}
      data-line-index={index}
      data-line-delay={delay}
    >
      {text}
    </p>
  )
}

export default AboutSection
