/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { SlideConfig } from '../config';

export interface ProgressSegmentsProps {
  slides: SlideConfig[];
  activeIndex: number;
  progress: number; // 0 to 1
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onSelectSlide: (index: number) => void;
  accentColor: string;
}

export const ProgressSegments: React.FC<ProgressSegmentsProps> = ({
  slides,
  activeIndex,
  progress,
  onSelectSlide,
  accentColor,
}) => {
  return (
    <div className="flex items-center select-none z-30">
      {/* 3 Segmented Pill Bars */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {slides.map((slide, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;

          let fillPct = 0;
          if (isCompleted) fillPct = 100;
          else if (isActive) fillPct = Math.min(100, Math.max(0, progress * 100));

          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => onSelectSlide(idx)}
              className="group relative h-2.5 w-14 sm:w-20 md:w-24 rounded-full bg-[#F6F1EA]/25 hover:bg-[#F6F1EA]/35 backdrop-blur-sm overflow-hidden p-0 m-0 border-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all"
              aria-label={`Go to slide ${idx + 1}: ${slide.scent}`}
            >
              {/* Inner fill bar */}
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${fillPct}%`,
                  backgroundColor: accentColor,
                  boxShadow: isActive ? `0 0 8px ${accentColor}` : 'none',
                  transition: isActive ? 'width 0.08s linear' : 'width 0.3s ease',
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
