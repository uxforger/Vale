/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

export interface EmbersProps {
  lit: boolean;
  glowColor: string;
  reducedMotion?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  driftFreq: number;
}

export const Embers: React.FC<EmbersProps> = ({
  lit,
  glowColor,
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;
    const isMobile = window.innerWidth < 768;
    const maxParticles = isMobile ? 10 : 20;

    const spawnParticle = (w: number, h: number): Particle => {
      return {
        x: w / 2 + (Math.random() - 0.5) * 16,
        y: h - 15 - Math.random() * 8,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -(0.55 + Math.random() * 0.75),
        size: 1 + Math.random() * 1.8,
        alpha: 0,
        life: 0,
        maxLife: 80 + Math.random() * 70,
        driftFreq: 0.02 + Math.random() * 0.04,
      };
    };

    const render = () => {
      if (!isMounted) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Spawn new particles if lit and under capacity
      if (lit && particlesRef.current.length < maxParticles && Math.random() < 0.28) {
        particlesRef.current.push(spawnParticle(width, height));
      }

      // Update and draw existing particles
      const alive: Particle[] = [];
      for (const p of particlesRef.current) {
        p.life += 1;
        p.x += p.vx + Math.sin(p.life * p.driftFreq) * 0.35;
        p.y += p.vy;

        // Smooth alpha envelope: fade in, sustain, fade out
        const progress = p.life / p.maxLife;
        if (progress < 0.2) {
          p.alpha = progress / 0.2;
        } else if (progress > 0.6) {
          p.alpha = Math.max(0, 1 - (progress - 0.6) / 0.4);
        } else {
          p.alpha = 1;
        }

        if (p.life < p.maxLife && p.y > 0) {
          alive.push(p);

          // Draw ember glow
          ctx.save();
          ctx.globalAlpha = p.alpha * 0.85;

          // Tiny radial glow
          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.size * 2.5
          );
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.4, glowColor);
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Hot inner spark
          ctx.fillStyle = '#FFF8E8';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      particlesRef.current = alive;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [lit, glowColor, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={260}
      className="absolute bottom-28 left-1/2 -translate-x-1/2 pointer-events-none z-40"
      style={{
        width: '220px',
        height: '260px',
      }}
    />
  );
};
