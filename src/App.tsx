/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Hero } from './components/Hero';
import { Candle, type CandleProps } from './components/Candle';
import { Card } from './components/Card';
import { CandleTrack } from './components/CandleTrack';
import { ArchRow } from './components/ArchRow';
import { Embers } from './components/Embers';
import { ProgressSegments } from './components/ProgressSegments';
import { MenuOverlay } from './components/MenuOverlay';
import type { SlideConfig, BrandConfig } from './config';

/* =========================================================================
   BRAND & SLIDES CONFIGURATION
   Easily customize the brand name, copy, tokens, and scent details below.
   ========================================================================= */

export const BRAND: BrandConfig = {
  name: 'Vale',
  subtitle: 'Artisanal Poured Wax',
  bodyColor: '#4A3F3A',
  darkBtnColor: '#1F1714',
  creamColor: '#F6F1EA',
  ctaLight: 'Light it',
  ctaSnuff: 'Snuff it out',
  menuLinks: [
    { label: '01 / The Autumn Collection', href: '#collection' },
    { label: '02 / Wax & Botanical Craft', href: '#craft' },
    { label: '03 / The Scent Questionnaire', href: '#finder' },
    { label: '04 / Studio & Stockists', href: '#stockists' },
  ],
};

export const SLIDES: SlideConfig[] = [
  {
    id: 'fig-smoke',
    num: '01',
    scent: 'Fig & Smoke',
    headline: 'Come home to something slow.',
    subhead: 'A warm, woody scent for the end of a long day.',
    waxTint: '#462734',
    glowColor: '#FFB067',
    headlineColor: '#3A1F2B',
    gradient: ['#1E1520', '#7B3F4B', '#EBD9CF'],
    notes: 'Black Fig · Smoked Birch · Amber Resin',
  },
  {
    id: 'salt-cedar',
    num: '02',
    scent: 'Salt & Cedar',
    headline: 'Fresh air, kept indoors.',
    subhead: 'Clean, cool and quietly green.',
    waxTint: '#264349',
    glowColor: '#FFD27A',
    headlineColor: '#153238',
    gradient: ['#10222B', '#4F7D86', '#E6EEE9'],
    notes: 'Pacific Brine · Atlas Cedar · Dried Sage',
  },
  {
    id: 'rose-ash',
    num: '03',
    scent: 'Rose Ash',
    headline: 'Soft light. Softer evenings.',
    subhead: 'Petals, embers and a little bit of mystery.',
    waxTint: '#522831',
    glowColor: '#FF8A7A',
    headlineColor: '#4A2326',
    gradient: ['#2A1A1A', '#B5646B', '#F4E3DC'],
    notes: 'Damask Rose · Birch Charcoal · Pink Peppercorn',
  },
];

/* Re-export individual components for modularity */
export {
  Hero,
  Card,
  Candle,
  CandleTrack,
  ArchRow,
  Embers,
  ProgressSegments,
  MenuOverlay,
  type CandleProps,
  type SlideConfig,
  type BrandConfig,
};

export default function App() {
  return <Hero brand={BRAND} slides={SLIDES} />;
}
