import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { navItems } from '../data/navItems'
import LangSwitcher from './LangSwitcher'

const SECTION_IDS = ['about', 'skills', 'projects', 'contact']

const Nav: React.FC = () => {
  const { t } = useTranslation()
  const { activeSectionId, isScrolled } = useScrollSpy(SECTION_IDS)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleNavClick = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    height: '56px',
    transition: 'background 300ms ease, backdrop-filter 300ms ease',
    background: isScrolled ? 'rgba(10, 10, 15, 0.8)' : 'transparent',
    backdropFilter: isScrolled ? 'blur(12px)' : 'none',
    WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
    borderBottom: isScrolled ? '1px solid rgba(0, 255, 255, 0.1)' : '1px solid transparent',
  }

  const logoStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '1.1rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: '#00ffff',
    textShadow: '0 0 8px rgba(0, 255, 255, 0.6)',
    cursor: 'default',
    userSelect: 'none',
  }

  const navListStyle: React.CSSProperties = {
    display: 'flex',
    gap: '2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  }

  const rightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  }

  // Map sectionId to i18n key
  const navLabelMap: Record<string, string> = {
    about: t('nav.about'),
    skills: t('nav.skills'),
    projects: t('nav.projects'),
    contact: t('nav.contact'),
  }

  return (
    <nav style={navStyle} data-scrolled={isScrolled}>
      <span style={logoStyle}>PORTAL</span>
      <div style={rightStyle}>
        <ul style={navListStyle}>
          {navItems.map((item) => {
            const isActive = activeSectionId === item.sectionId
            const isHovered = hoveredId === item.sectionId
            return (
              <li key={item.sectionId}>
                <NavLink
                  label={navLabelMap[item.sectionId] ?? item.label}
                  sectionId={item.sectionId}
                  isActive={isActive}
                  isHovered={isHovered}
                  onHover={setHoveredId}
                  onClick={handleNavClick}
                />
              </li>
            )
          })}
        </ul>
        <LangSwitcher />
      </div>
    </nav>
  )
}

interface NavLinkProps {
  label: string
  sectionId: string
  isActive: boolean
  isHovered: boolean
  onHover: (id: string | null) => void
  onClick: (id: string) => void
}

const NavLink: React.FC<NavLinkProps> = ({
  label,
  sectionId,
  isActive,
  isHovered,
  onHover,
  onClick,
}) => {
  const linkStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '0.85rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: isActive ? '#00ffff' : isHovered ? '#00ffff' : 'rgba(200, 220, 255, 0.75)',
    textShadow: isActive ? '0 0 8px rgba(0, 255, 255, 0.5)' : 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '4px 0',
    transition: 'color 200ms ease, text-shadow 200ms ease',
    outline: 'none',
  }

  const underlineContainerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    overflow: 'hidden',
  }

  const underlineStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: '100%',
    background: '#00ffff',
    boxShadow: '0 0 6px rgba(0, 255, 255, 0.8)',
    transform: isActive || isHovered ? 'scaleX(1)' : 'scaleX(0)',
    transformOrigin: 'left center',
    transition: 'transform 200ms ease',
  }

  return (
    <button
      style={linkStyle}
      onClick={() => onClick(sectionId)}
      onMouseEnter={() => onHover(sectionId)}
      onMouseLeave={() => onHover(null)}
      data-active={isActive}
      data-section={sectionId}
      aria-label={`Navigate to ${label} section`}
    >
      {label}
      <span style={underlineContainerStyle} aria-hidden="true">
        <span style={underlineStyle} />
      </span>
    </button>
  )
}

export default Nav
