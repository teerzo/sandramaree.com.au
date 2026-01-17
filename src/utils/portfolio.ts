import type { Tables } from '../../types/supabase'

export type ArtworkRow = Tables<'artwork'>

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const getArtworkSlug = (artwork: ArtworkRow) => {
  const base = slugify(artwork.title || 'artwork')
  return `${base || 'artwork'}--${artwork.id}`
}

export const getArtworkIdFromSlug = (slug: string) => {
  const delimiter = '--'
  const delimiterIndex = slug.lastIndexOf(delimiter)

  if (delimiterIndex === -1) {
    return slug
  }

  const candidate = slug.slice(delimiterIndex + delimiter.length)
  return candidate || slug
}
