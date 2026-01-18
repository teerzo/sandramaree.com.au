import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import type { Tables } from '../../types/supabase'
import { supabase } from '../utils/supabase'

type Artwork = Tables<'artwork'>

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [favourites, setFavourites] = useState<Artwork[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOverlayVisible, setIsOverlayVisible] = useState(true)
  const [isOverlayFading, setIsOverlayFading] = useState(false)
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

  useEffect(() => {
    if (isLoading) {
      setIsOverlayVisible(true)
      setIsOverlayFading(false)
      return undefined
    }

    const fadeDelayMs = 500
    const fadeDurationMs = 300

    const fadeTimer = window.setTimeout(() => {
      setIsOverlayFading(true)
    }, fadeDelayMs)

    const hideTimer = window.setTimeout(() => {
      setIsOverlayVisible(false)
    }, fadeDelayMs + fadeDurationMs)

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(hideTimer)
    }
  }, [isLoading])

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
  const heroImageOrientation = activeArtwork?.orientation ?? 'landscape'

  console.log(heroImageSrc)
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative h-full w-full object-cover">
        {/* Main image */}
        <img
          src={heroImageSrc}
          alt={heroImageAlt}
          className="relative h-full w-full object-cover  z-10"
        />
      </div>

      <div className="fixed top-0 left-0 right-0 bottom-0 z-[-1]">
        {/* Blurred background image */}
        {heroImageOrientation === 'landscape' ? (
          <img
            src={heroImageSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover  blur-lg scale-110 opacity-50"
            aria-hidden="true"
          />
        ) : (
          <img
            src={heroImageSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover  blur-lg scale-110 opacity-50"
            aria-hidden="true"
          />
        )}  
      </div>
      {isOverlayVisible ? (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-300 ${isOverlayFading ? 'opacity-0' : 'opacity-100'
            }`}
        >
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-700" />
        </div>
      ) : null}
    </div>
  )
}
