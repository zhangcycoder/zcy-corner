import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import AboutSection, { getLineDelay, bioLines } from './AboutSection';

// ─── Helper: mock IntersectionObserver ───────────────────────────────────────

function mockIntersectionObserver(isIntersecting: boolean) {
  class MockIO {
    private cb: (entries: IntersectionObserverEntry[]) => void;
    constructor(cb: (entries: IntersectionObserverEntry[]) => void) {
      this.cb = cb;
    }
    observe(el: Element) {
      this.cb([{ isIntersecting, target: el } as IntersectionObserverEntry]);
    }
    disconnect() {}
    unobserve() {}
  }

  vi.stubGlobal('IntersectionObserver', MockIO);
  return MockIO;
}

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ─── Unit tests ───────────────────────────────────────────────────────────────

describe('AboutSection — structure', () => {
  it('renders with data-testid="about-section"', () => {
    mockIntersectionObserver(false);
    const { getByTestId } = render(<AboutSection />);
    expect(getByTestId('about-section')).toBeTruthy();
  });

  it('has id="about"', () => {
    mockIntersectionObserver(false);
    const { getByTestId } = render(<AboutSection />);
    expect(getByTestId('about-section').id).toBe('about');
  });

  it('renders avatar element', () => {
    mockIntersectionObserver(false);
    const { getByRole } = render(<AboutSection />);
    expect(getByRole('img', { name: '个人头像' })).toBeTruthy();
  });

  it('renders all bio lines', () => {
    mockIntersectionObserver(false);
    const { container } = render(<AboutSection />);
    const lines = container.querySelectorAll('[data-line-index]');
    expect(lines.length).toBe(bioLines.length);
  });

  it('renders location and status info', () => {
    mockIntersectionObserver(false);
    const { getByText } = render(<AboutSection />);
    expect(getByText(/上海/)).toBeTruthy();
    expect(getByText(/开放合作/)).toBeTruthy();
  });
});

describe('getLineDelay — pure function', () => {
  it('returns 0 for index 0 with default step', () => {
    expect(getLineDelay(0)).toBe(0);
  });

  it('returns index * 150 with default step', () => {
    expect(getLineDelay(1)).toBe(150);
    expect(getLineDelay(3)).toBe(450);
  });

  it('respects custom step', () => {
    expect(getLineDelay(2, 100)).toBe(200);
  });
});

// ─── Property 14: 简介文字逐行淡入延迟 ───────────────────────────────────────

// Feature: personal-portal, Property 14: 简介文字逐行淡入延迟
describe('Property 14: 简介文字逐行淡入延迟', () => {
  it('任意 N 行简介，第 i 行 animation-delay 大于第 i-1 行', () => {
    // Validates: Requirements 7.3
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 2, maxLength: 10 }),
        (lines) => {
          // For each consecutive pair, delay[i] > delay[i-1]
          for (let i = 1; i < lines.length; i++) {
            const prev = getLineDelay(i - 1);
            const curr = getLineDelay(i);
            if (curr <= prev) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('data-line-delay 属性在 DOM 中递增', () => {
    // Validates: Requirements 7.3
    mockIntersectionObserver(true);
    const { container } = render(<AboutSection />);
    const lineEls = Array.from(container.querySelectorAll('[data-line-delay]'));
    expect(lineEls.length).toBeGreaterThanOrEqual(3);

    for (let i = 1; i < lineEls.length; i++) {
      const prev = Number(lineEls[i - 1].getAttribute('data-line-delay'));
      const curr = Number(lineEls[i].getAttribute('data-line-delay'));
      expect(curr).toBeGreaterThan(prev);
    }
  });
});

// ─── Property 15: IntersectionObserver 触发动画 ───────────────────────────────

// Feature: personal-portal, Property 15: IntersectionObserver 触发动画
describe('Property 15: IntersectionObserver 触发动画', () => {
  it('未进入视口时，标题无 glitch 动画', () => {
    // Validates: Requirements 9.1
    fc.assert(
      fc.property(fc.constant(false), (_isIntersecting) => {
        mockIntersectionObserver(false);
        const { container, unmount } = render(<AboutSection />);
        const title = container.querySelector('h2') as HTMLElement;
        const hasGlitch = title?.style.animation?.includes('glitch');
        unmount();
        return !hasGlitch;
      }),
      { numRuns: 100 }
    );
  });

  it('进入视口后，标题具有 glitch 动画', () => {
    // Validates: Requirements 9.1
    fc.assert(
      fc.property(fc.constant(true), (_isIntersecting) => {
        mockIntersectionObserver(true);
        const { container, unmount } = render(<AboutSection />);
        const title = container.querySelector('h2') as HTMLElement;
        const hasGlitch = title?.style.animation?.includes('glitch');
        unmount();
        return hasGlitch;
      }),
      { numRuns: 100 }
    );
  });

  it('进入视口后，bio 行具有 fadeInUp 动画', () => {
    // Validates: Requirements 9.1
    mockIntersectionObserver(true);
    const { container } = render(<AboutSection />);
    const lines = Array.from(container.querySelectorAll('[data-line-index]')) as HTMLElement[];
    expect(lines.length).toBeGreaterThan(0);
    lines.forEach((line) => {
      expect(line.style.animation).toContain('fadeInUp');
    });
  });

  it('未进入视口时，bio 行无 fadeInUp 动画', () => {
    // Validates: Requirements 9.1
    mockIntersectionObserver(false);
    const { container } = render(<AboutSection />);
    const lines = Array.from(container.querySelectorAll('[data-line-index]')) as HTMLElement[];
    expect(lines.length).toBeGreaterThan(0);
    lines.forEach((line) => {
      expect(line.style.animation).toBe('none');
    });
  });
});
