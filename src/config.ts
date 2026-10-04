export interface SlideConfig {
  id: string;
  num: string;
  scent: string;
  headline: string;
  subhead: string;
  waxTint: string;
  glowColor: string;
  headlineColor: string;
  gradient: [string, string, string];
  notes?: string;
}

export interface BrandConfig {
  name: string;
  subtitle: string;
  bodyColor: string;
  darkBtnColor: string;
  creamColor: string;
  ctaLight: string;
  ctaSnuff: string;
  menuLinks: { label: string; href: string }[];
}

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
