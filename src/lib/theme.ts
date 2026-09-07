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

export function coverOf(opts: {
  coverUrl?: string | null
  slug?: string
  categories?: Category[] | null
}): string | null {
  return opts.coverUrl ?? null
}
