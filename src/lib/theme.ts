import type { Category } from '@/lib/types'

export type CategoryTheme = {
  slug: string
  label: string
  /** Solid used for chips, pins, glows */
  hex: string
  soft: string
  text: string
  emoji: string
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  musica: {
    slug: 'musica',
    label: 'Música',
    hex: '#7C3AED',
    soft: '#EDE4FF',
    text: '#4C1D95',
    emoji: '♪',
  },
  gastronomia: {
    slug: 'gastronomia',
    label: 'Gastronomia',
    hex: '#EA580C',
    soft: '#FFEDD5',
    text: '#9A3412',
    emoji: '🍽',
  },
  arte: {
    slug: 'arte',
    label: 'Arte',
    hex: '#0F766E',
    soft: '#CCFBF1',
    text: '#115E59',
    emoji: '✦',
  },
  'vida-nocturna': {
    slug: 'vida-nocturna',
    label: 'Vida nocturna',
    hex: '#DB2777',
    soft: '#FCE7F3',
    text: '#9D174D',
    emoji: '☾',
  },
  karaoke: {
    slug: 'karaoke',
    label: 'Karaoke',
    hex: '#E11D48',
    soft: '#FFE4E6',
    text: '#9F1239',
    emoji: '🎤',
  },
  cinema: {
    slug: 'cinema',
    label: 'Cinema',
    hex: '#CA8A04',
    soft: '#FEF3C7',
    text: '#854D0E',
    emoji: '🎬',
  },
}

export const FALLBACK_THEME: CategoryTheme = {
  slug: 'outro',
  label: 'Cidade',
  hex: '#FF5C4D',
  soft: '#FFE8E1',
  text: '#9A3412',
  emoji: '·',
}

export function themeFor(slug?: string | null): CategoryTheme {
  if (!slug) return FALLBACK_THEME
  return CATEGORY_THEMES[slug] ?? FALLBACK_THEME
}

export function primaryCategory(categories?: Category[] | null): CategoryTheme {
  return themeFor(categories?.[0]?.slug)
}

const COVERS: Record<string, string> = {
  karaoke:
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80',
  'vida-nocturna':
    'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1600&q=80',
  musica:
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
  gastronomia:
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80',
  cinema:
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
  arte: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80',
}

const SLUG_COVERS: Record<string, string> = {
  'karaoke-talatona':
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1600&q=80',
  'mare-alta':
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80',
  'cine-marginal':
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
  'karaoke-night':
    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1600&q=80',
  'jantar-sexta-ilha':
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80',
  'karaoke-luanda-fim-de-semana':
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80',
}

export function coverOf(opts: {
  coverUrl?: string | null
  slug?: string
  categories?: Category[] | null
}): string {
  if (opts.coverUrl) return opts.coverUrl
  if (opts.slug && SLUG_COVERS[opts.slug]) return SLUG_COVERS[opts.slug]
  const slug = opts.categories?.[0]?.slug
  if (slug && COVERS[slug]) return COVERS[slug]
  return 'https://images.unsplash.com/photo-1514565131-fce0801d7090?auto=format&fit=crop&w=1600&q=80'
}

export const TALATONA = { latitude: -8.916, longitude: 13.185 }
