/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Candle } from './Candle';
import { Embers } from './Embers';
import type { SlideConfig } from '../config';

export interface CandleTrackProps {
  slides: SlideConfig[];
  virtualIndex: number;
  lit: boolean;
  onSelectVirtualIndex: (idx: number) => void;
  onToggleLit?: () => void;
  cursorOffset?: { x: number; y: number };
  reducedMotion?: boolean;
}

export const CandleTrack: React.FC<CandleTrackProps> = ({
  slides,
  virtualIndex,
  lit,
  onSelectVirtualIndex,
  onToggleLit,
  cursorOffset = { x: 0, y: 0 },
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [spacing, setSpacing] = useState(280);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const currentDragXRef = useRef(0);

  // Responsive track spacing calculation
  useEffect(() => {
    const updateSpacing = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setSpacing(195);
      } else if (w < 768) {
        setSpacing(230);
      } else if (w < 1024) {
        setSpacing(270);
      } else {
        setSpacing(310);
      }
    };
    updateSpacing();
    window.addEventListener('resize', updateSpacing);
    return () => window.removeEventListener('resize', updateSpacing);
  }, []);

  // Motion value for smooth translation
  const targetX = -virtualIndex * spacing;
  const xMotion = useMotionValue(targetX);
  const smoothX = useSpring(xMotion, {
    stiffness: reducedMotion ? 9999 : 140,
    damping: reducedMotion ? 100 : 22,
    mass: 0.85,
  });

  // Keep target in sync with virtualIndex & spacing
  useEffect(() => {
    if (!isDragging) {
      xMotion.set(-virtualIndex * spacing);
    }
  }, [virtualIndex, spacing, isDragging, xMotion]);

  // Pointer drag handling for desktop & mobile swipe
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    currentDragXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    currentDragXRef.current = e.clientX;
    const delta = e.clientX - dragStartXRef.current;
    xMotion.set(-virtualIndex * spacing + delta);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    const delta = currentDragXRef.current - dragStartXRef.current;
    const threshold = spacing * 0.22;

    if (delta < -threshold) {
      onSelectVirtualIndex(virtualIndex + 1);
    } else if (delta > threshold) {
      onSelectVirtualIndex(virtualIndex - 1);
    } else {
      // Snap back
      xMotion.set(-virtualIndex * spacing);
    }
  };

  // Render 5 virtual positions around current index to guarantee seamless infinite scroll
  const renderRange = [-2, -1, 0, 1, 2];

  const activeScentIndex = ((virtualIndex % slides.length) + slides.length) % slides.length;
  const activeScent = slides[activeScentIndex];

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-[280px] sm:h-[310px] md:h-[340px] flex items-end justify-center touch-pan-y cursor-grab active:cursor-grabbing select-none"
      style={{
        marginBottom: '-16px', // Overlap bottom edge slightly as requested
      }}
    >
      {/* Embers layer positioned directly over active center candle */}
      <Embers
        lit={lit}
        glowColor={activeScent.glowColor}
        reducedMotion={reducedMotion}
      />

      {/* Moving horizontal track */}
      <motion.div
        style={{ x: smoothX }}
        className="absolute bottom-4 flex items-end justify-center pointer-events-none"
      >
        {renderRange.map((offset) => {
          const itemVirtualIndex = virtualIndex + offset;
          const slideIdx =
            ((itemVirtualIndex % slides.length) + slides.length) % slides.length;
          const scent = slides[slideIdx];
          const isCenter = offset === 0;

          // Scale, opacity and blur configuration
          const scale = isCenter ? 1 : 0.62;
          const opacity = isCenter ? 1 : 0.42;
          const blur = isCenter ? 0 : 3;

          return (
            <div
              key={itemVirtualIndex}
              onClick={(e) => {
                if (Math.abs(currentDragXRef.current - dragStartXRef.current) > 8) {
                  return; // Was dragging, not a tap
                }
                e.stopPropagation();
                if (!isCenter) {
                  onSelectVirtualIndex(itemVirtualIndex);
                } else if (onToggleLit) {
                  onToggleLit();
                }
              }}
              className={`absolute bottom-0 flex flex-col items-center pointer-events-auto transition-transform ${
                !isCenter ? 'cursor-pointer hover:opacity-75' : 'cursor-pointer'
              }`}
              style={{
                left: `calc(50% + ${itemVirtualIndex * spacing}px)`,
                transform: 'translateX(-50%)',
                zIndex: isCenter ? 25 : 10,
              }}
              role="button"
              tabIndex={0}
              aria-label={
                isCenter
                  ? `${scent.scent} candle. Click to ${lit ? 'snuff flame' : 'light flame'}`
                  : `Switch to ${scent.scent} candle`
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!isCenter) {
                    onSelectVirtualIndex(itemVirtualIndex);
                  } else if (onToggleLit) {
                    onToggleLit();
                  }
                }
              }}
            >
              <Candle
                lit={isCenter && lit}
                scent={scent}
                isCenter={isCenter}
                scale={scale}
                opacity={opacity}
                blur={blur}
                cursorOffset={isCenter ? cursorOffset : undefined}
                reducedMotion={reducedMotion}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
