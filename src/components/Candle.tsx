/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { SlideConfig } from '../config';

export interface CandleProps {
  lit: boolean;
  scent: SlideConfig;
  imageSrc?: string;
  cursorOffset?: { x: number; y: number };
  isCenter?: boolean;
  scale?: number;
  opacity?: number;
  blur?: number;
  reducedMotion?: boolean;
}

export const Candle: React.FC<CandleProps> = ({
  lit,
  scent,
  imageSrc,
  cursorOffset = { x: 0, y: 0 },
  isCenter = true,
  scale = 1,
  opacity = 1,
  blur = 0,
  reducedMotion = false,
}) => {
  // Track snuff event to spawn a smoke wisp
  const [showSmoke, setShowSmoke] = useState(false);
  const prevLitRef = useRef(lit);

  useEffect(() => {
    if (prevLitRef.current && !lit) {
      setShowSmoke(true);
      const timer = setTimeout(() => {
        setShowSmoke(false);
      }, 1900);
      return () => clearTimeout(timer);
    }
    prevLitRef.current = lit;
  }, [lit]);

  // Compute cursor lean angle (max ~4 degrees toward cursor X)
  const flameLean = reducedMotion
    ? 0
    : Math.max(-4, Math.min(4, cursorOffset.x * 4.5));

  // Dynamic glass reflection shift based on cursor
  const reflectionShift = reducedMotion
    ? 0
    : Math.max(-12, Math.min(12, cursorOffset.x * 14));

  return (
    <div
      className="relative flex flex-col items-center select-none"
      style={{
        transform: `scale(${scale})`,
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        transition: 'transform 0.85s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.85s ease, filter 0.85s ease',
      }}
    >
      {/* 1. Ground Shadow */}
      <div className="absolute -bottom-4 w-44 sm:w-52 h-8 pointer-events-none z-0">
        <div
          className="w-full h-full rounded-[100%] transition-all duration-700"
          style={{
            background: lit && isCenter
              ? `radial-gradient(ellipse at center, rgba(16,12,12,0.48) 0%, rgba(16,12,12,0.2) 50%, color-mix(in srgb, ${scent.glowColor} 18%, transparent) 75%, transparent 100%)`
              : 'radial-gradient(ellipse at center, rgba(16,12,12,0.42) 0%, rgba(16,12,12,0.18) 55%, transparent 80%)',
            filter: 'blur(7px)',
          }}
        />
        {/* Core contact shadow right at glass base */}
        <div
          className="absolute inset-x-4 top-1 h-3 rounded-[100%] bg-black/45"
          style={{ filter: 'blur(3px)' }}
        />
      </div>

      {/* 2. Candle Assembly: Flame + Jar */}
      <div className="relative flex flex-col items-center z-10">
        {/* Flame Layer */}
        <div className="relative w-16 h-28 -mb-4 flex flex-col items-center justify-end z-30 pointer-events-none">
          {/* Flame Halo / Aura when lit */}
          <AnimatePresence>
            {lit && isCenter && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.4,
                  transition: { duration: 0.9, ease: 'easeOut' },
                }}
                className={`absolute bottom-3 w-40 h-40 rounded-full pointer-events-none ${
                  reducedMotion ? '' : 'animate-halo'
                }`}
                style={{
                  background: `radial-gradient(circle at center, color-mix(in srgb, ${scent.glowColor} 75%, white) 0%, color-mix(in srgb, ${scent.glowColor} 45%, transparent) 40%, transparent 75%)`,
                  filter: 'blur(20px)',
                  transform: 'translate3d(0, 0, 0)',
                }}
              />
            )}
          </AnimatePresence>

          {/* Active Flame */}
          <AnimatePresence>
            {lit && isCenter && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 15 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  rotate: flameLean,
                  transition: {
                    type: 'spring',
                    stiffness: 280,
                    damping: 20,
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.1,
                  y: 8,
                  transition: { duration: 0.35, ease: 'easeIn' },
                }}
                className={`relative flex flex-col items-center origin-bottom ${
                  reducedMotion ? '' : 'animate-flame'
                }`}
                style={{
                  transform: `rotate(${flameLean}deg)`,
                  transformOrigin: 'bottom center',
                }}
              >
                {/* Flame Teardrop SVG */}
                <svg
                  width="26"
                  height="46"
                  viewBox="0 0 26 46"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-[0_0_10px_rgba(255,200,120,0.85)] filter"
                >
                  <defs>
                    <radialGradient
                      id={`flameOuter-${scent.id}`}
                      cx="50%"
                      cy="82%"
                      r="65%"
                      fx="50%"
                      fy="82%"
                    >
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="25%" stopColor="#FFF2A3" />
                      <stop offset="60%" stopColor={scent.glowColor} />
                      <stop offset="95%" stopColor={scent.glowColor} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={scent.glowColor} stopOpacity="0" />
                    </radialGradient>
                    <radialGradient
                      id={`flameCore-${scent.id}`}
                      cx="50%"
                      cy="75%"
                      r="40%"
                    >
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="70%" stopColor="#FFECA8" />
                      <stop offset="100%" stopColor="#FFC868" stopOpacity="0.8" />
                    </radialGradient>
                    <linearGradient
                      id={`flameBaseBlue-${scent.id}`}
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="70%" stopColor="#4A88FF" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#1E3875" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>

                  {/* Outer teardrop */}
                  <path
                    d="M13 2 C16.5 14, 25 24, 25 34 C25 41.5, 19.5 45.5, 13 45.5 C6.5 45.5, 1 41.5, 1 34 C1 24, 9.5 14, 13 2 Z"
                    fill={`url(#flameOuter-${scent.id})`}
                  />

                  {/* Inner radiant core */}
                  <path
                    d="M13 14 C15 20, 20.5 28, 20.5 35 C20.5 40, 17 43, 13 43 C9 43, 5.5 40, 5.5 35 C5.5 28, 11 20, 13 14 Z"
                    fill={`url(#flameCore-${scent.id})`}
                  />

                  {/* Pure white center highlight */}
                  <ellipse cx="13" cy="35" rx="3.5" ry="6" fill="#FFFFFF" opacity="0.95" />

                  {/* Tiny blue base flame */}
                  <ellipse
                    cx="13"
                    cy="43.5"
                    rx="5"
                    ry="2"
                    fill={`url(#flameBaseBlue-${scent.id})`}
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Snuff Smoke Wisp */}
          <AnimatePresence>
            {showSmoke && !lit && !reducedMotion && (
              <motion.div
                initial={{ opacity: 0.7, y: 0, scale: 0.7 }}
                animate={{
                  opacity: [0.7, 0.45, 0],
                  y: -55,
                  x: [0, 8, -6, 4],
                  scale: [0.7, 1.2, 1.7],
                  transition: { duration: 1.8, ease: 'easeOut' },
                }}
                className="absolute bottom-2 flex flex-col items-center pointer-events-none"
              >
                <svg width="24" height="48" viewBox="0 0 24 48" fill="none">
                  <path
                    d="M12 46 C10 38, 16 30, 11 20 C7 12, 15 6, 12 2"
                    stroke="rgba(215, 205, 198, 0.65)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    style={{ filter: 'blur(1.5px)' }}
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. The Candle Jar (or Image fallback) */}
        {imageSrc ? (
          <div className="relative w-40 sm:w-48 h-52 sm:h-60 rounded-b-2xl overflow-hidden flex items-end justify-center">
            <img
              src={imageSrc}
              alt={`Vale candle in ${scent.scent}`}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="relative w-40 sm:w-48 h-52 sm:h-60">
            {/* Glass Jar Body Container */}
            <div
              className="relative w-full h-full rounded-b-[26px] overflow-hidden border border-white/50 shadow-[0_18px_36px_-6px_rgba(0,0,0,0.28)]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 35%, rgba(255, 255, 255, 0.15) 85%, rgba(255, 255, 255, 0.35) 100%)',
                backdropFilter: 'blur(3px)',
              }}
            >
              {/* Left Rim Edge Specular Highlight */}
              <div
                className="absolute inset-y-0 left-0 w-2.5 pointer-events-none z-20"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)',
                }}
              />

              {/* Dynamic Glass Reflection Streak shifting with cursor */}
              <div
                className="absolute inset-y-0 pointer-events-none z-20 w-8 transition-transform duration-300 ease-out"
                style={{
                  left: '18%',
                  transform: `translateX(${reflectionShift}px)`,
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 40%, rgba(255,255,255,0.48) 50%, rgba(255,255,255,0.15) 60%, transparent 100%)',
                }}
              />

              {/* Right Rim Edge Specular Highlight */}
              <div
                className="absolute inset-y-0 right-0 w-2 pointer-events-none z-20"
                style={{
                  background:
                    'linear-gradient(270deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)',
                }}
              />

              {/* Wax Body */}
              <div
                className="absolute inset-x-0 bottom-0 top-[22%] flex flex-col justify-end transition-colors duration-700"
                style={{
                  backgroundColor: scent.waxTint,
                  backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.38) 100%)`,
                }}
              >
                {/* Lit Subsurface Glow in the wax */}
                {lit && isCenter && (
                  <div
                    className="absolute inset-x-0 top-0 h-28 pointer-events-none transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(ellipse at 50% 0%, color-mix(in srgb, ${scent.glowColor} 65%, transparent) 0%, color-mix(in srgb, ${scent.glowColor} 20%, transparent) 55%, transparent 95%)`,
                      filter: 'blur(6px)',
                    }}
                  />
                )}

                {/* Wax Top Surface (Concave Ellipse) */}
                <div className="absolute -top-3.5 inset-x-0 h-7 rounded-[100%] overflow-hidden z-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.35)]">
                  <div
                    className="w-full h-full transition-colors duration-700"
                    style={{
                      backgroundColor: scent.waxTint,
                      backgroundImage: lit && isCenter
                        ? `radial-gradient(ellipse at center, color-mix(in srgb, ${scent.glowColor} 75%, white) 0%, color-mix(in srgb, ${scent.waxTint} 60%, ${scent.glowColor}) 50%, ${scent.waxTint} 100%)`
                        : `radial-gradient(ellipse at 45% 40%, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.4) 100%)`,
                    }}
                  />
                  {/* Subtle concave rim sheen */}
                  <div className="absolute inset-0 rounded-[100%] border border-white/25 pointer-events-none" />
                </div>

                {/* The Braided Cotton Wick */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                  <div
                    className="w-[2.5px] h-3.5 rounded-t-sm"
                    style={{
                      backgroundColor: '#1E1916',
                      backgroundImage:
                        'linear-gradient(180deg, #120F0D 0%, #2D2420 50%, #4D3F37 100%)',
                      boxShadow: lit && isCenter ? `0 -1px 3px ${scent.glowColor}` : 'none',
                    }}
                  />
                  {/* Tiny charred wick tip */}
                  <div
                    className="w-1 h-1 rounded-full -mt-4 transition-colors duration-300"
                    style={{
                      backgroundColor: lit && isCenter ? '#FFFFFF' : '#FF7034',
                      boxShadow: lit && isCenter ? `0 0 4px ${scent.glowColor}` : '0 0 2px #FF5226',
                    }}
                  />
                </div>

                {/* Minimal Luxury Paper Label */}
                <div className="relative mx-auto mb-7 w-[72%] max-w-[125px] py-3.5 px-2 bg-[#FAF7F2] rounded-[4px] border border-[#DDD4C7] shadow-[0_4px_12px_rgba(0,0,0,0.18)] flex flex-col items-center text-center z-15">
                  {/* Brand Wordmark */}
                  <span className="font-serif text-[13px] tracking-[0.22em] text-[#221B17] font-semibold uppercase leading-tight">
                    VALE
                  </span>

                  {/* Hairline Separator */}
                  <div className="w-8 h-[0.5px] bg-[#CFC4B5] my-1.5" />

                  {/* Scent Name */}
                  <span className="font-mono text-[8.5px] tracking-[0.14em] text-[#3E342F] uppercase font-bold leading-tight">
                    {scent.scent}
                  </span>

                  {/* Net Weight Spec */}
                  <span className="font-mono text-[6.5px] tracking-[0.08em] text-[#85776F] uppercase mt-1 leading-none">
                    260G · HAND POURED
                  </span>

                  {/* Subtle label paper bevel highlight */}
                  <div className="absolute inset-0 rounded-[4px] pointer-events-none border border-white/70" />
                </div>

                {/* Heavy Glass Base ("Sham") */}
                <div
                  className="relative h-5 w-full border-t border-white/25 overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.25) 100%)',
                  }}
                >
                  {/* Refraction Caustic Line */}
                  <div className="absolute inset-x-3 bottom-1.5 h-[1.5px] rounded-full bg-white/45 blur-[0.5px]" />
                </div>
              </div>

              {/* Jar Top Glass Rim (Opening Lip) */}
              <div className="absolute top-0 inset-x-0 h-4 rounded-[100%] border border-white/70 pointer-events-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
