import ParticleSystem from './ParticleSystem';
import Typewriter from './Typewriter';

const ROLE_TEXTS = [
  'Full Stack Developer',
  'React Enthusiast',
  'Open Source Contributor',
];

const containerStyle: React.CSSProperties = {
  position: 'relative',
  height: '100vh',
  overflow: 'hidden',
};

const contentStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  textAlign: 'center',
  padding: '0 1.5rem',
};

const nameStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
  fontWeight: 700,
  letterSpacing: '0.15em',
  color: 'var(--accent-cyan)',
  textShadow: '0 0 20px var(--accent-cyan), 0 0 40px var(--accent-cyan)',
  marginBottom: '1.25rem',
  textTransform: 'uppercase',
};

const typewriterStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'clamp(1rem, 3vw, 1.5rem)',
  color: '#a0c4ff',
  marginBottom: '2.5rem',
  minHeight: '2em',
};

const ctaStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '1rem',
  letterSpacing: '0.1em',
  color: 'var(--accent-cyan)',
  background: 'transparent',
  border: '1px solid var(--accent-cyan)',
  padding: '0.75rem 2rem',
  cursor: 'pointer',
  boxShadow: '0 0 8px var(--accent-cyan)',
  transition: 'box-shadow 200ms ease, background 200ms ease, color 200ms ease',
};

function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia) {
    return window.matchMedia('(max-width: 767px)').matches;
  }
  return window.innerWidth < 768;
}

function handleCtaClick() {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
}

function handleCtaMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
  const btn = e.currentTarget;
  btn.style.boxShadow = '0 0 20px var(--accent-cyan), 0 0 40px var(--accent-cyan)';
  btn.style.background = 'rgba(0, 255, 255, 0.1)';
}

function handleCtaMouseLeave(e: React.MouseEvent<HTMLButtonElement>) {
  const btn = e.currentTarget;
  btn.style.boxShadow = '0 0 8px var(--accent-cyan)';
  btn.style.background = 'transparent';
}

export default function HeroSection() {
  const disabled = isMobile();

  return (
    <section data-testid="hero-section" id="hero" style={containerStyle}>
      <ParticleSystem disabled={disabled} />
      <div style={contentStyle}>
        <h1 style={nameStyle}>YOUR NAME</h1>
        <Typewriter
          texts={ROLE_TEXTS}
          charInterval={80}
          pauseDuration={2000}
          style={typewriterStyle}
        />
        <button
          style={ctaStyle}
          onClick={handleCtaClick}
          onMouseEnter={handleCtaMouseEnter}
          onMouseLeave={handleCtaMouseLeave}
          aria-label="Scroll to about section"
        >
          EXPLORE →
        </button>
      </div>
    </section>
  );
}
