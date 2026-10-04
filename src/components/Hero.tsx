/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from './Card';
import { ProgressSegments } from './ProgressSegments';
import type { SlideConfig, BrandConfig } from '../config';

export interface HeroProps {
  brand: BrandConfig;
  slides: SlideConfig[];
}

const AUTOPLAY_DURATION = 6000; // 6 seconds per slide

export const Hero: React.FC<HeroProps> = ({ brand, slides }) => {
  const [virtualIndex, setVirtualIndex] = useState(0);
  const [lit, setLit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  // Normalize slide index
  const slideIndex = ((virtualIndex % slides.length) + slides.length) % slides.length;
  const currentSlide = slides[slideIndex];

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Autoplay RAF loop with linear progress interpolation
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const resetProgress = useCallback(() => {
    elapsedRef.current = 0;
    setProgress(0);
  }, []);

  const handleNextSlide = useCallback(() => {
    setVirtualIndex((prev) => prev + 1);
    resetProgress();
  }, [resetProgress]);

  const handlePrevSlide = useCallback(() => {
    setVirtualIndex((prev) => prev - 1);
    resetProgress();
  }, [resetProgress]);

  const handleSelectVirtualIndex = useCallback(
    (targetIdx: number) => {
      setVirtualIndex(targetIdx);
      resetProgress();
    },
    [resetProgress]
  );

  const handleSelectSlide = useCallback(
    (targetSlideIndex: number) => {
      // Find the closest virtual index matching targetSlideIndex
      const currentMod = ((virtualIndex % slides.length) + slides.length) % slides.length;
      let diff = targetSlideIndex - currentMod;
      if (diff > slides.length / 2) diff -= slides.length;
      if (diff < -slides.length / 2) diff += slides.length;
      setVirtualIndex(virtualIndex + diff);
      resetProgress();
    },
    [virtualIndex, slides.length, resetProgress]
  );

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleToggleLit = useCallback(() => {
    setLit((prev) => !prev);
  }, []);

  // Keyboard navigation: ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMenuOpen) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextSlide, handlePrevSlide, isMenuOpen]);

  // Autoplay animation frame ticker
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (isPlaying) {
        elapsedRef.current += dt;
        if (elapsedRef.current >= AUTOPLAY_DURATION) {
          elapsedRef.current = 0;
          setVirtualIndex((prev) => prev + 1);
          setProgress(0);
        } else {
          setProgress(elapsedRef.current / AUTOPLAY_DURATION);
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      lastTimeRef.current = null;
    };
  }, [isPlaying]);

  // Smooth mouse coordinates tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const nx = (clientX / innerWidth) * 2 - 1; // -1 to 1
    const ny = (clientY / innerHeight) * 2 - 1; // -1 to 1
    setCursorOffset({ x: nx, y: ny });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-between py-4 sm:py-6 px-3 sm:px-6 select-none"
      style={
        {
          '--font-headline': "var(--font-fraunces, 'Fraunces', serif)",
          '--font-body': "var(--font-dm-sans, 'DM Sans', sans-serif)",
          '--font-mono': "var(--font-space-mono, 'Space Mono', monospace)",
          '--color-body': brand.bodyColor,
          '--color-dark-btn': brand.darkBtnColor,
          '--color-cream': brand.creamColor,
          '--color-glow': currentSlide.glowColor,
          '--color-headline': currentSlide.headlineColor,
          '--color-wax': currentSlide.waxTint,
          '--gradient-stop-1': currentSlide.gradient[0],
          '--gradient-stop-2': currentSlide.gradient[1],
          '--gradient-stop-3': currentSlide.gradient[2],
        } as React.CSSProperties
      }
    >
      {/* 1. Full-Viewport Grainy 3-Stop Gradient Layers (Cross-fade between slides) */}
      <div
        className="fixed inset-0 pointer-events-none transition-[filter] duration-1000 z-0"
        style={{
          filter: lit ? 'brightness(1.08)' : 'brightness(1)',
        }}
      >
        {slides.map((s, idx) => {
          const isActive = idx === slideIndex;
          return (
            <div
              key={s.id}
              className="absolute inset-0 transition-opacity duration-900 ease-in-out"
              style={{
                opacity: isActive ? 1 : 0,
                background: `linear-gradient(135deg, ${s.gradient[0]} 0%, ${s.gradient[1]} 52%, ${s.gradient[2]} 100%)`,
              }}
            />
          );
        })}
      </div>

      {/* 2. Film Grain Overlay via inline SVG feTurbulence at ~8% opacity */}
      <svg
        className="fixed inset-0 pointer-events-none z-50 w-full h-full opacity-[0.08]"
        aria-hidden="true"
      >
        <filter id="valeGrainFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#valeGrainFilter)" />
      </svg>

      {/* 3. Centered Frosted Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full my-auto">
        <Card
          brand={brand}
          slides={slides}
          currentSlide={currentSlide}
          virtualIndex={virtualIndex}
          slideIndex={slideIndex}
          lit={lit}
          onToggleLit={handleToggleLit}
          onNextSlide={handleNextSlide}
          onSelectVirtualIndex={handleSelectVirtualIndex}
          cursorOffset={cursorOffset}
          isMenuOpen={isMenuOpen}
          onOpenMenu={() => setIsMenuOpen(true)}
          onCloseMenu={() => setIsMenuOpen(false)}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* 4. Controls Below the Card: 3 Segmented Pill Bars */}
      <footer className="relative z-20 mt-3 sm:mt-4 flex items-center justify-center">
        <ProgressSegments
          slides={slides}
          activeIndex={slideIndex}
          progress={progress}
          onSelectSlide={handleSelectSlide}
          accentColor={currentSlide.glowColor}
        />
      </footer>
    </div>
  );
};
