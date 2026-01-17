import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import type { Tables } from '../../types/supabase'
import { supabase } from '../utils/supabase'

type Artwork = Tables<'artwork'>

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [favourites, setFavourites] = useState<Artwork[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadFavourites = async () => {
      setIsLoading(true)

      const { data, error } = await supabase
        .from('artwork')
        .select('id, title, description, s3_url, is_favourite')
        .eq('is_favourite', true)

      if (!isMounted) {
        return
      }

      if (error) {
        console.error('Failed to load favourite artwork:', error)
        setFavourites([])
      } else {
        setFavourites(data ?? [])
      }

      setIsLoading(false)
    }

    void loadFavourites()

    return () => {
      isMounted = false
    }
  }, [])

  const favouriteImages = useMemo(
    () => favourites.filter((artwork) => artwork.s3_url),
    [favourites],
  )

  useEffect(() => {
    if (favouriteImages.length <= 1) {
      setActiveIndex(0)
      return
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % favouriteImages.length)
    }, 5000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [favouriteImages.length])

  useEffect(() => {
    if (activeIndex >= favouriteImages.length && favouriteImages.length > 0) {
      setActiveIndex(0)
    }
  }, [activeIndex, favouriteImages.length])

  const activeArtwork = favouriteImages[activeIndex]
  const heroImageSrc = activeArtwork?.s3_url ?? '/images/background.jpg'
  const heroImageAlt =
    activeArtwork?.description || activeArtwork?.title || 'Featured artwork'

  return (
    <div className="relative min-h-screen">
      <img
        src={heroImageSrc}
        alt={heroImageAlt}
        className="min-h-screen w-full object-cover"
      />
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3 text-gray-700">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-700" />
            <span className="text-sm font-medium">Loading favourites...</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
