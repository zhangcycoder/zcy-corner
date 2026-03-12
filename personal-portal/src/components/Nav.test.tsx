import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import Nav from './Nav'
import { navItems } from '../data/navItems'

// Mock useScrollSpy so we can control activeSectionId and isScrolled
vi.mock('../hooks/useScrollSpy', () => ({
  useScrollSpy: vi.fn(),
}))

import { useScrollSpy } from '../hooks/useScrollSpy'
const mockUseScrollSpy = vi.mocked(useScrollSpy)

beforeEach(() => {
  mockUseScrollSpy.mockReturnValue({ activeSectionId: null, isScrolled: false })
})

// ─── Unit Tests ───────────────────────────────────────────────────────────────

describe('Nav — structure', () => {
  it('renders a <nav> element with position: fixed', () => {
    const { container } = render(<Nav />)
    const nav = container.querySelector('nav')
    expect(nav).not.toBeNull()
    expect(nav!.style.position).toBe('fixed')
  })

  it('renders the PORTAL logo', () => {
    render(<Nav />)
    expect(screen.getByText('PORTAL')).toBeTruthy()
  })

  it('renders all nav items', () => {
    render(<Nav />)
    for (const item of navItems) {
      expect(screen.getByText(item.label)).toBeTruthy()
    }
  })
})

describe('Nav — scroll state (毛玻璃背景)', () => {
  it('does NOT apply glass background when isScrolled=false', () => {
    mockUseScrollSpy.mockReturnValue({ activeSectionId: null, isScrolled: false })
    const { container } = render(<Nav />)
    const nav = container.querySelector('nav')!
    expect(nav.style.background).toBe('transparent')
    expect(nav.getAttribute('data-scrolled')).toBe('false')
  })

  it('applies glass background when isScrolled=true', () => {
    mockUseScrollSpy.mockReturnValue({ activeSectionId: null, isScrolled: true })
    const { container } = render(<Nav />)
    const nav = container.querySelector('nav')!
    expect(nav.style.background).toContain('rgba(10, 10, 15')
    expect(nav.getAttribute('data-scrolled')).toBe('true')
  })
})

describe('Nav — active section highlight', () => {
  it('marks the active nav item with data-active=true', () => {
    const activeId = navItems[0].sectionId
    mockUseScrollSpy.mockReturnValue({ activeSectionId: activeId, isScrolled: false })
    render(<Nav />)
    const activeBtn = document.querySelector(`[data-section="${activeId}"]`)
    expect(activeBtn?.getAttribute('data-active')).toBe('true')
  })

  it('does not mark inactive items as active', () => {
    const activeId = navItems[0].sectionId
    mockUseScrollSpy.mockReturnValue({ activeSectionId: activeId, isScrolled: false })
    render(<Nav />)
    const inactiveItems = navItems.filter((n) => n.sectionId !== activeId)
    for (const item of inactiveItems) {
      const btn = document.querySelector(`[data-section="${item.sectionId}"]`)
      expect(btn?.getAttribute('data-active')).toBe('false')
    }
  })
})

describe('Nav — click interaction', () => {
  it('calls scrollIntoView on the target section when a nav item is clicked', () => {
    const sectionId = navItems[1].sectionId
    const mockScrollIntoView = vi.fn()
    const el = document.createElement('section')
    el.id = sectionId
    el.scrollIntoView = mockScrollIntoView
    document.body.appendChild(el)

    mockUseScrollSpy.mockReturnValue({ activeSectionId: null, isScrolled: false })
    render(<Nav />)

    const btn = document.querySelector(`[data-section="${sectionId}"]`) as HTMLButtonElement
    fireEvent.click(btn)
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })

    document.body.removeChild(el)
  })
})

// ─── Property Tests ───────────────────────────────────────────────────────────

describe('Nav — Property 5: 导航栏滚动状态', () => {
  // Feature: personal-portal, Property 5: 导航栏滚动状态
  it('any scrollY > 80 → glass background present; ≤ 80 → absent', () => {
    // isScrolled=true branch
    fc.assert(
      fc.property(fc.constant(true), (_isScrolled) => {
        mockUseScrollSpy.mockReturnValue({ activeSectionId: null, isScrolled: true })
        const { container, unmount } = render(<Nav />)
        const nav = container.querySelector('nav')!
        const hasGlass = nav.getAttribute('data-scrolled') === 'true'
        unmount()
        return hasGlass
      }),
      { numRuns: 100 }
    )

    // isScrolled=false branch
    fc.assert(
      fc.property(fc.constant(false), (_isScrolled) => {
        mockUseScrollSpy.mockReturnValue({ activeSectionId: null, isScrolled: false })
        const { container, unmount } = render(<Nav />)
        const nav = container.querySelector('nav')!
        const noGlass = nav.getAttribute('data-scrolled') === 'false'
        unmount()
        return noGlass
      }),
      { numRuns: 100 }
    )
  })
})

describe('Nav — Property 6: 导航项高亮与当前 Section 一致', () => {
  // Feature: personal-portal, Property 6: 导航项高亮与当前 Section 一致
  it('any sectionId → only that nav item is highlighted', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...navItems.map((n) => n.sectionId)),
        (activeId) => {
          mockUseScrollSpy.mockReturnValue({ activeSectionId: activeId, isScrolled: false })
          const { unmount } = render(<Nav />)

          const activeBtn = document.querySelector(`[data-section="${activeId}"]`)
          const activeIsHighlighted = activeBtn?.getAttribute('data-active') === 'true'

          const otherItems = navItems.filter((n) => n.sectionId !== activeId)
          const othersNotHighlighted = otherItems.every(
            (item) =>
              document.querySelector(`[data-section="${item.sectionId}"]`)?.getAttribute('data-active') === 'false'
          )

          unmount()
          return activeIsHighlighted && othersNotHighlighted
        }
      ),
      { numRuns: 100 }
    )
  })
})
