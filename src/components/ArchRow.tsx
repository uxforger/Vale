/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

export interface ArchRowProps {
  glowColor: string;
  lit: boolean;
  slideIndex: number;
  cursorOffset?: { x: number; y: number };
  reducedMotion?: boolean;
}

// Harmonious architectural heights (px or percentage)
const ARCH_HEIGHTS = [
  '55%', '72%', '62%', '84%', '78%', '92%', '68%', '86%', '64%', '80%', '58%',
];

export const ArchRow: React.FC<ArchRowProps> = ({
  glowColor,
  lit,
  slideIndex,
  cursorOffset = { x: 0, y: 0 },
  reducedMotion = false,
}) => {
  // Parallax: 0.4x relative to slide movements (each slide ~70px parallax offset)
  const slideParallaxX = -slideIndex * 56;
  const cursorParallaxX = reducedMotion ? 0 : cursorOffset.x * -14;

  return (
    <div className="absolute inset-x-0 bottom-0 top-[20%] flex items-end justify-center overflow-hidden pointer-events-none z-0 arch-mask">
      {/* Drifting & Parallax Container */}
      <motion.div
        animate={{
          x: slideParallaxX + cursorParallaxX,
        }}
        transition={{
          duration: 0.88,
          ease: [0.77, 0, 0.175, 1],
        }}
        className={`flex items-end justify-center gap-[14px] px-8 h-full ${
          reducedMotion ? '' : 'animate-arch-drift'
        }`}
      >
        {ARCH_HEIGHTS.map((height, i) => {
          // Show ~5 center arches on small screens, all on md+
          const isOuter = i < 3 || i > 7;
          return (
            <div
              key={i}
              className={`relative w-11 sm:w-16 md:w-20 rounded-t-[36px] overflow-hidden border border-white/35 backdrop-blur-[8px] transition-all duration-700 shrink-0 ${
                isOuter ? 'hidden md:block' : 'block'
              }`}
              style={{
                height,
                background:
                  'linear-gradient(180deg, rgba(255, 255, 255, 0.48) 0%, rgba(255, 255, 255, 0.1) 60%, rgba(255, 255, 255, 0.04) 100%)',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6)',
              }}
            >
              {/* Candlelight glow wash from bottom up when lit */}
              <div
                className="absolute inset-0 rounded-t-[36px] transition-opacity duration-1000 pointer-events-none"
                style={{
                  opacity: lit ? 0.88 : 0,
                  background: `linear-gradient(to top, color-mix(in srgb, ${glowColor} 58%, transparent) 0%, color-mix(in srgb, ${glowColor} 26%, transparent) 42%, transparent 85%)`,
                }}
              />

              {/* Inner vertical highlight streak */}
              <div className="absolute inset-y-0 left-2 w-1 bg-white/20 blur-[1px] pointer-events-none" />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
