import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

// Inject animation once
const CONTACT_STYLE_ID = 'contact-keyframes'
function injectContactStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(CONTACT_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = CONTACT_STYLE_ID
  style.textContent = `
    @keyframes contactFadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `
  document.head.appendChild(style)
}
injectContactStyles()

interface ContactLink {
  label: string
  href: string
  icon: string
  ariaLabel: string
}

const CONTACT_LINKS: ContactLink[] = [
  {
    label: 'Email',
    href: 'mailto:hello@example.com',
    icon: '✉',
    ariaLabel: 'Send email',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/example',
    icon: '⌥',
    ariaLabel: 'GitHub profile',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/example',
    icon: '◈',
    ariaLabel: 'LinkedIn profile',
  },
]

const ContactSection: React.FC = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 })

  return (
    <section
      id="contact"
      ref={sectionRef}
      data-testid="contact-section"
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 2rem',
        background: 'var(--bg-primary, #0a0a0f)',
      }}
    >
      <h2
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: '2rem',
          fontWeight: 700,
          color: '#00ffff',
          marginBottom: '0.75rem',
          textShadow: '0 0 12px rgba(0, 255, 255, 0.4)',
          opacity: isVisible ? 1 : 0,
          animation: isVisible ? 'contactFadeIn 400ms ease forwards' : 'none',
        }}
      >
        {t('contact.title')}
      </h2>
      <p
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: '0.85rem',
          color: 'rgba(200, 220, 255, 0.6)',
          marginBottom: '3rem',
          opacity: isVisible ? 1 : 0,
          animation: isVisible ? 'contactFadeIn 400ms ease forwards 100ms' : 'none',
        }}
      >
        {t('contact.subtitle')}
      </p>

      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {CONTACT_LINKS.map((link, index) => (
          <ContactItem
            key={link.label}
            link={link}
            index={index}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  )
}

interface ContactItemProps {
  link: ContactLink
  index: number
  isVisible: boolean
}

const ContactItem: React.FC<ContactItemProps> = ({ link, index, isVisible }) => {
  const delay = index * 100 + 200

  return (
    <a
      href={link.href}
      target={link.href.startsWith('mailto:') ? undefined : '_blank'}
      rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      aria-label={link.ariaLabel}
      data-testid="contact-link"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
        color: 'rgba(200, 220, 255, 0.75)',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: '0.85rem',
        opacity: isVisible ? 1 : 0,
        animation: isVisible ? `contactFadeIn 400ms ease forwards ${delay}ms` : 'none',
        transition: 'color 200ms ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.color = '#00ffff'
        const icon = el.querySelector('.contact-icon') as HTMLSpanElement | null
        if (icon) {
          icon.style.transform = 'scale(1.2)'
          icon.style.filter = 'drop-shadow(0 0 8px #00ffff)'
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.color = 'rgba(200, 220, 255, 0.75)'
        const icon = el.querySelector('.contact-icon') as HTMLSpanElement | null
        if (icon) {
          icon.style.transform = 'scale(1)'
          icon.style.filter = 'none'
        }
      }}
    >
      <span
        className="contact-icon"
        style={{
          fontSize: '2rem',
          transition: 'transform 200ms ease, filter 200ms ease',
        }}
      >
        {link.icon}
      </span>
      <span>{link.label}</span>
    </a>
  )
}

export default ContactSection
