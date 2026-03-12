import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock ParticleSystem
vi.mock('./ParticleSystem', () => ({
  default: () => <div data-testid="particle-system" />,
}))

// Mock Typewriter
vi.mock('./Typewriter', () => ({
  default: ({ texts }: { texts: string[] }) => (
    <span data-testid="typewriter">{texts[0]}</span>
  ),
}))

import HeroSection from './HeroSection'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('HeroSection — structure', () => {
  it('renders with data-testid="hero-section"', () => {
    render(<HeroSection />)
    expect(screen.getByTestId('hero-section')).toBeTruthy()
  })

  it('contains the name heading text', () => {
    render(<HeroSection />)
    expect(screen.getByText('YOUR NAME')).toBeTruthy()
  })

  it('renders the Typewriter component', () => {
    render(<HeroSection />)
    expect(screen.getByTestId('typewriter')).toBeTruthy()
  })

  it('renders the ParticleSystem component', () => {
    render(<HeroSection />)
    expect(screen.getByTestId('particle-system')).toBeTruthy()
  })

  it('renders the CTA button', () => {
    render(<HeroSection />)
    const btn = screen.getByRole('button')
    expect(btn).toBeTruthy()
    expect(btn.textContent).toContain('EXPLORE')
  })
})

describe('HeroSection — CTA button click', () => {
  it('calls scrollIntoView on #about element when CTA is clicked', () => {
    const mockScrollIntoView = vi.fn()
    const aboutEl = document.createElement('section')
    aboutEl.id = 'about'
    aboutEl.scrollIntoView = mockScrollIntoView
    document.body.appendChild(aboutEl)

    render(<HeroSection />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })

    document.body.removeChild(aboutEl)
  })

  it('does not throw when #about element is absent', () => {
    render(<HeroSection />)
    const btn = screen.getByRole('button')
    expect(() => fireEvent.click(btn)).not.toThrow()
  })
})

describe('HeroSection — layout', () => {
  it('has 100vh height style', () => {
    render(<HeroSection />)
    const section = screen.getByTestId('hero-section') as HTMLElement
    expect(section.style.height).toBe('100vh')
  })

  it('has position: relative style', () => {
    render(<HeroSection />)
    const section = screen.getByTestId('hero-section') as HTMLElement
    expect(section.style.position).toBe('relative')
  })
})
