import { useEffect, useRef, useState } from 'react';
import type { Particle } from '../types';

export interface ParticleSystemProps {
  particleCount?: number;
  disabled?: boolean;
}

const COLORS = ['#00ffff', '#0080ff', '#ffffff'];

/** 纯函数：初始化粒子数组 */
export function initParticles(count: number, width: number, height: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5),   // -0.5 ~ 0.5
    vy: (Math.random() - 0.5),
    radius: 1 + Math.random() * 2,  // 1 ~ 3
    opacity: 0.3 + Math.random() * 0.5, // 0.3 ~ 0.8
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

/** 纯函数：对影响半径内的粒子施加排斥力 */
export function applyMouseForce(
  particles: Particle[],
  mouseX: number,
  mouseY: number,
  radius: number
): Particle[] {
  return particles.map((p) => {
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < radius && distance > 0) {
      const force = ((radius - distance) / radius) * 0.5;
      const nx = dx / distance;
      const ny = dy / distance;
      return {
        ...p,
        vx: p.vx + nx * force,
        vy: p.vy + ny * force,
      };
    }
    return p;
  });
}

const STATIC_BG: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'radial-gradient(ellipse at center, #0d1a2e 0%, #0a0a0f 70%)',
};

const CANVAS_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
};

export default function ParticleSystem({
  particleCount = 80,
  disabled = false,
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('no 2d context');
    } catch {
      setFallback(true);
      return;
    }

    // 设置 canvas 尺寸
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let particles = initParticles(particleCount, canvas.width, canvas.height);
    let mouseX = -9999;
    let mouseY = -9999;
    const MOUSE_RADIUS = 150;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      particles = applyMouseForce(particles, mouseX, mouseY, MOUSE_RADIUS);
    };
    canvas.addEventListener('mousemove', onMouseMove);

    let rafId: number;

    const animate = () => {
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      particles = particles.map((p) => {
        let { x, y, vx, vy } = p;
        x += vx;
        y += vy;

        // 边界反弹
        if (x < 0) { x = 0; vx = -vx; }
        if (x > w) { x = w; vx = -vx; }
        if (y < 0) { y = 0; vy = -vy; }
        if (y > h) { y = h; vy = -vy; }

        return { ...p, x, y, vx, vy };
      });

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, [disabled, particleCount]);

  if (disabled || fallback) {
    return <div style={STATIC_BG} aria-hidden="true" />;
  }

  return (
    <canvas
      ref={canvasRef}
      style={CANVAS_STYLE}
      aria-hidden="true"
    />
  );
}
