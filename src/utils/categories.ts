/**
 * Artwork category definitions and utilities
 */

/**
 * Valid artwork category values
 */
export const ArtworkCategory = {
  PORTRAITS: 'portraits',
  SUNRISE_AND_SEAS: 'sunrise and seas',
  MISC: '', // Empty string represents Misc category
} as const

/**
 * Type for artwork category values
 */
export type ArtworkCategoryValue =
  | typeof ArtworkCategory.PORTRAITS
  | typeof ArtworkCategory.SUNRISE_AND_SEAS
  | typeof ArtworkCategory.MISC
  | null
  | undefined

/**
 * Category tab configuration
 */
export interface CategoryTab {
  key: string
  label: string
  value: string
  matches: (category: string | null | undefined) => boolean
}

/**
 * Normalizes a category string for comparison (trims and lowercases)
 */
export const normalizeCategory = (category: string | null | undefined): string =>
  (category ?? '').trim().toLowerCase()

/**
 * Gets the display label for a category
 */
export const getCategoryLabel = (category: string | null | undefined): string => {
  const normalized = normalizeCategory(category)
  
  if (!normalized) {
    return 'Misc'
  }
  
  if (normalized === ArtworkCategory.PORTRAITS) {
    return 'Portraits'
  }
  
  if (normalized === ArtworkCategory.SUNRISE_AND_SEAS) {
    return 'Sunrise and Seas'
  }
  
  return category ?? 'Misc'
}

/**
 * Default category tabs configuration
 */
export const categoryTabs: CategoryTab[] = [
  {
    key: 'portraits',
    label: 'Portraits',
    value: ArtworkCategory.PORTRAITS,
    matches: (category: string | null | undefined) =>
      normalizeCategory(category) === ArtworkCategory.PORTRAITS,
  },
  {
    key: 'sunrise-and-seas',
    label: 'Sunrise and Seas',
    value: ArtworkCategory.SUNRISE_AND_SEAS,
    matches: (category: string | null | undefined) =>
      normalizeCategory(category) === ArtworkCategory.SUNRISE_AND_SEAS,
  },
  {
    key: 'misc',
    label: 'Misc',
    value: ArtworkCategory.MISC,
    matches: (category: string | null | undefined) =>
      normalizeCategory(category) === ArtworkCategory.MISC,
  },
]

/**
 * Checks if a category value is valid
 */
export const isValidCategory = (category: string | null | undefined): boolean => {
  const normalized = normalizeCategory(category)
  return (
    normalized === ArtworkCategory.PORTRAITS ||
    normalized === ArtworkCategory.SUNRISE_AND_SEAS ||
    normalized === ArtworkCategory.MISC
  )
}

/**
 * Gets category options for select/input fields
 */
export const getCategoryOptions = () => [
  { value: '', label: 'Misc (default)' },
  { value: ArtworkCategory.PORTRAITS, label: 'Portraits' },
  { value: ArtworkCategory.SUNRISE_AND_SEAS, label: 'Sunrise and Seas' },
]
