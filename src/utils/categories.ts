import type { ProductCategory } from '@/types'

// Canonical labels for the product categories we expose publicly
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  business: 'Negocios',
  home: 'Hogar',
  custom: 'Personalizado',
  decorative: 'Decorativo',
  signs: 'Se\u00f1ales',
  letters: 'Letras'
}

// Legacy/admin aliases (mostly Spanish values stored in Firestore forms)
const CATEGORY_ALIASES: Record<string, ProductCategory> = {
  business: 'business',
  negocios: 'business',
  home: 'home',
  hogar: 'home',
  custom: 'custom',
  personalizado: 'custom',
  personalizadas: 'custom',
  decorative: 'decorative',
  decorativo: 'decorative',
  decorativos: 'decorative',
  signs: 'signs',
  se\u00f1ales: 'signs',
  se\u00f1al: 'signs',
  letters: 'letters',
  letras: 'letters',
  event: 'custom',
  events: 'custom',
  eventos: 'custom'
}

export const CATEGORY_SELECT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'personalizado', label: CATEGORY_LABELS.custom },
  { value: 'negocios', label: CATEGORY_LABELS.business },
  { value: 'hogar', label: CATEGORY_LABELS.home },
  { value: 'eventos', label: 'Eventos' },
  { value: 'decorativo', label: CATEGORY_LABELS.decorative }
]

/**
 * Normalize different category inputs (english or spanish aliases) to the canonical enum.
 */
export function normalizeCategory(category?: string | null): ProductCategory | null {
  if (!category) return null
  const key = category.toString().trim().toLowerCase()
  return CATEGORY_ALIASES[key] ?? null
}

/**
 * Resolve the display label for a category, accepting either canonical or legacy values.
 */
export function resolveCategoryLabel(category?: string | null): string {
  const normalized = normalizeCategory(category)
  if (normalized) {
    return CATEGORY_LABELS[normalized]
  }

  const raw = category?.toString().trim()
  if (raw && raw.length > 0) {
    return raw.charAt(0).toUpperCase() + raw.slice(1)
  }

  return 'Otros'
}

/**
 * Convert a Firestore/category string into the admin select value (Spanish).
 * Defaults to 'personalizado' so the form stays valid.
 */
export function mapCategoryToOptionValue(category?: string | null): string {
  const normalized = normalizeCategory(category)
  switch (normalized) {
    case 'business':
      return 'negocios'
    case 'home':
      return 'hogar'
    case 'decorative':
      return 'decorativo'
    case 'letters':
    case 'signs':
      return 'negocios'
    default:
      return 'personalizado'
  }
}

/**
 * Convert a select option value (usually Spanish) to the canonical category.
 */
export function mapOptionValueToCategory(optionValue?: string | null): ProductCategory {
  return normalizeCategory(optionValue) ?? 'custom'
}
