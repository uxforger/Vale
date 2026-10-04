/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ArchRow } from './ArchRow';
import { CandleTrack } from './CandleTrack';
import { MenuOverlay } from './MenuOverlay';
import type { SlideConfig, BrandConfig } from '../config';

export interface CardProps {
  brand: BrandConfig;
  slides: SlideConfig[];
  currentSlide: SlideConfig;
  virtualIndex: number;
  slideIndex: number;
  lit: boolean;
  onToggleLit: () => void;
  onNextSlide: () => void;
  onSelectVirtualIndex: (idx: number) => void;
  cursorOffset?: { x: number; y: number };
  isMenuOpen: boolean;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  reducedMotion?: boolean;
}

export const Card: React.FC<CardProps> = ({
  brand,
  slides,
  currentSlide,
  virtualIndex,
  slideIndex,
  lit,
  onToggleLit,
  onNextSlide,
  onSelectVirtualIndex,
  cursorOffset = { x: 0, y: 0 },
  isMenuOpen,
  onOpenMenu,
  onCloseMenu,
  reducedMotion = false,
}) => {
  const headlineWords = currentSlide.headline.split(' ');

  return (
    <div
      className="relative w-[92vw] max-w-[1240px] h-[calc(100dvh-5.6rem)] max-h-[840px] min-h-[540px] rounded-[36px] overflow-hidden flex flex-col justify-between select-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.28),inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.06)] transition-shadow duration-1000"
      style={{
        backgroundColor: 'rgba(246, 241, 234, 0.86)',
        backdropFilter: 'blur(28px) saturate(140%)',
        WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        border: '1px solid rgba(255, 255, 255, 0.45)',
      }}
    >
      {/* 1. Ambient Candlelight Bloom when lit */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000 z-0"
        style={{
          opacity: lit ? 0.9 : 0,
          background: `radial-gradient(ellipse at 50% 64%, color-mix(in srgb, ${currentSlide.glowColor} 42%, transparent) 0%, color-mix(in srgb, ${currentSlide.glowColor} 18%, transparent) 46%, transparent 78%)`,
        }}
      />

      {/* 2. Architectural Arches Backdrop */}
      <ArchRow
        glowColor={currentSlide.glowColor}
        lit={lit}
        slideIndex={slideIndex}
        cursorOffset={cursorOffset}
        reducedMotion={reducedMotion}
      />

      {/* 3. Top Navigation Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 pt-6 sm:pt-8">
        {/* Wordmark (Fraunces serif, no icon) */}
        <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1F1714]">
          {brand.name}
        </span>

        {/* Menu button (Space Mono with two-line icon) */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="group flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-[#1F1714] px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F1714] cursor-pointer"
          aria-label="Open navigation menu"
        >
          <span>Menu</span>
          {/* Two-line icon */}
          <div className="flex flex-col gap-1 w-4" aria-hidden="true">
            <span className="h-[1.5px] w-full bg-[#1F1714] group-hover:w-3.5 transition-all self-end" />
            <span className="h-[1.5px] w-full bg-[#1F1714] group-hover:w-full transition-all" />
          </div>
        </button>
      </header>

      {/* 4. Upper Center Editorial Copy & CTAs */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 sm:px-8 mt-1 sm:mt-2">
        {/* Slide Number & Scent Name in Space Mono */}
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <span
            className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-700"
            style={{ color: currentSlide.headlineColor }}
          >
            {currentSlide.num} / {currentSlide.scent}
          </span>
        </div>

        {/* Headline (Fraunces serif, clamp(42px, 6vw, 84px), line-height 1, letter-spacing -0.02em, soft optical style) */}
        <div className="min-h-[58px] sm:min-h-[84px] md:min-h-[96px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentSlide.id}
              className="font-serif text-[clamp(34px,5.2vw,84px)] sm:text-[clamp(42px,6vw,84px)] leading-[1] tracking-[-0.02em] font-medium max-w-2xl px-2 transition-colors duration-700 select-text"
              style={{ color: currentSlide.headlineColor }}
              aria-live="polite"
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: reducedMotion ? 0 : 28,
                      filter: reducedMotion ? 'none' : 'blur(4px)',
                    },
                    animate: {
                      opacity: 1,
                      x: 0,
                      filter: 'blur(0px)',
                      transition: {
                        duration: reducedMotion ? 0.2 : 0.65,
                        delay: reducedMotion ? 0 : i * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                    exit: {
                      opacity: 0,
                      x: reducedMotion ? 0 : -24,
                      filter: reducedMotion ? 'none' : 'blur(4px)',
                      transition: {
                        duration: reducedMotion ? 0.2 : 0.35,
                        delay: reducedMotion ? 0 : i * 0.03,
                        ease: [0.77, 0, 0.175, 1],
                      },
                    },
                  }}
                  className="inline-block mr-[0.26em]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Subhead (1 line) */}
        <div className="min-h-[22px] sm:min-h-[26px] flex items-center justify-center mt-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentSlide.id + '-sub'}
              initial={{ opacity: 0, x: reducedMotion ? 0 : 18 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  duration: reducedMotion ? 0.2 : 0.55,
                  delay: reducedMotion ? 0 : headlineWords.length * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              exit={{
                opacity: 0,
                x: reducedMotion ? 0 : -16,
                transition: { duration: 0.3, ease: [0.77, 0, 0.175, 1] },
              }}
              className="font-sans text-xs sm:text-sm md:text-base text-[#4A3F3A] max-w-md font-normal leading-relaxed"
            >
              {currentSlide.subhead}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* CTA Row: Dark pill button + Square accent button */}
        <div className="flex items-center gap-3 mt-4 sm:mt-5 z-30">
          {/* Dark pill button: "Light it" / "Snuff it out" */}
          <button
            type="button"
            onClick={onToggleLit}
            className="group relative inline-flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-sans font-medium tracking-wide bg-[#1F1714] text-[#F6F1EA] shadow-[0_4px_16px_rgba(0,0,0,0.16)] hover:bg-[#2F2420] active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F1714] focus-visible:ring-offset-2 cursor-pointer"
            aria-label={lit ? 'Snuff the candle flame' : 'Light the candle flame'}
          >
            <span className="relative z-10 transition-colors">
              {lit ? brand.ctaSnuff : brand.ctaLight}
            </span>
            {/* Subtle glow rim inside button when lit */}
            {lit && (
              <span
                className="absolute inset-0 rounded-full opacity-40 transition-opacity"
                style={{
                  boxShadow: `inset 0 0 10px ${currentSlide.glowColor}`,
                }}
              />
            )}
          </button>

          {/* Square accent button with arrow icon to go to next slide */}
          <button
            type="button"
            onClick={onNextSlide}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F1714] cursor-pointer"
            style={{
              backgroundColor: currentSlide.glowColor,
              color: '#1F1714',
            }}
            aria-label={`Next scent: ${
              slides[(slideIndex + 1) % slides.length].scent
            }`}
          >
            <ArrowRight className="w-4 h-4 stroke-[2.2] transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* 5. Lower Center Candle Carousel Track */}
      <div className="relative z-20 w-full overflow-visible">
        <CandleTrack
          slides={slides}
          virtualIndex={virtualIndex}
          lit={lit}
          onSelectVirtualIndex={onSelectVirtualIndex}
          onToggleLit={onToggleLit}
          cursorOffset={cursorOffset}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* 6. Full-Card Menu Overlay */}
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={onCloseMenu}
        brandName={brand.name}
        links={brand.menuLinks}
      />
    </div>
  );
};
