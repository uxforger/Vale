/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  links: { label: string; href: string }[];
}

export const MenuOverlay: React.FC<MenuOverlayProps> = ({
  isOpen,
  onClose,
  brandName,
  links,
}) => {
  // ESC key listener to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-50 flex flex-col justify-between p-8 sm:p-12 md:p-16 rounded-[36px] bg-[#F6F1EA]/95 backdrop-blur-2xl select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="font-serif text-2xl tracking-tight text-[#1F1714]">
              {brandName}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#1F1714] hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F1714] rounded-md px-2 py-1 cursor-pointer"
              aria-label="Close navigation menu"
            >
              <span>Close</span>
              <X className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>

          {/* Editorial Link List */}
          <nav className="my-auto py-6 flex flex-col gap-4 sm:gap-6">
            {links.map((link, idx) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.08 * idx, duration: 0.4 },
                }}
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
                className="group flex items-baseline justify-between py-2 border-b border-[#4A3F3A]/15 text-[#1F1714] transition-all hover:pl-2"
              >
                <span className="font-serif text-2xl sm:text-3xl md:text-4xl group-hover:translate-x-1 transition-transform">
                  {link.label}
                </span>
                <span className="font-mono text-xs tracking-widest text-[#4A3F3A]/60 group-hover:text-[#1F1714] transition-colors">
                  EXPLORE →
                </span>
              </motion.a>
            ))}
          </nav>

          {/* Footer note */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-[#4A3F3A]/70 pt-4 border-t border-[#4A3F3A]/10">
            <span>ARTISANAL POURED WAX · SUSTAINABLE BOTANICALS</span>
            <span className="mt-1 sm:mt-0">EST. 2026</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
