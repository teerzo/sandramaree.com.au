import { createFileRoute } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { supabase } from '../utils/supabase'
import { categoryTabs } from '../utils/categories'
import type { Tables } from '../../types/supabase'

type ArtworkRow = Tables<'artwork'>

// Filter to only show portraits and sunrise-and-seas tabs (exclude misc)
const publicCategoryTabs = categoryTabs.filter(tab => tab.key !== 'misc')

export const Route = createFileRoute('/portfolio')({
  ssr: 'data-only',
  loader: async () => {
    console.log('Loader running...')
    console.log('Environment check:', {
      hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
      hasKey: !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    })

    try {
      const { data: artwork, error } = await supabase.from('artwork').select('*')

      console.log('Artwork data loaded:', artwork)
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Artwork data loaded:', artwork?.length || 0, 'items')
      return { artwork: artwork || [] }
    } catch (error) {
      console.error('Loader error:', error)
      // Return empty array on error so the page still renders
      return { artwork: [] }
    }
  },
  component: Portfolio,
})

function Portfolio() {
  const { artwork } = Route.useLoaderData() as { artwork: ArtworkRow[] }
  const [activeTab, setActiveTab] = useState(publicCategoryTabs[0].key)
  const [previewArtwork, setPreviewArtwork] = useState<ArtworkRow | null>(null)

  console.log('artwork', artwork, activeTab);
  const tabCounts = useMemo(() => {
    return publicCategoryTabs.reduce<Record<string, number>>((counts, tab) => {
      counts[tab.key] = artwork?.length ? artwork.filter((item) =>
        tab.matches(item.category),
      ).length : 0
      return counts
    }, {})
  }, [artwork])

  const filteredArtwork = useMemo(() => {
    const activeMatcher =
      publicCategoryTabs.find((tab) => tab.key === activeTab) ?? publicCategoryTabs[0]
    return artwork?.length ? artwork.filter((item) => activeMatcher.matches(item.category)) : []
  }, [artwork, activeTab])

  const activeTabLabel =
    publicCategoryTabs.find((tab) => tab.key === activeTab)?.label ??
    publicCategoryTabs[0].label

  console.log('artwork', artwork, activeTab, activeTabLabel, filteredArtwork);

  const handleImageClick = (item: ArtworkRow) => {
    if (item.s3_url) {
      setPreviewArtwork(item)
    }
  }

  const handleClosePreview = () => {
    setPreviewArtwork(null)
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClosePreview()
    }
  }

  useEffect(() => {
    if (!previewArtwork) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClosePreview()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [previewArtwork])

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* <h1 className="text-4xl font-bold text-gray-900 mb-8">Portfolio</h1>
          <p className="text-lg text-gray-600">
            Welcome to the portfolio page. This is where Sandra Maree's artwork will be displayed.
          </p> */}

        <div className="flex flex-wrap gap-2 mb-6">
          {publicCategoryTabs.map((tab) => {
            const isActive = tab.key === activeTab
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${isActive
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                aria-pressed={isActive}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  {tabCounts[tab.key] ?? 0}
                </span>
              </button>
            )
          })}
        </div>

        <div className="min-h-[60vh]">
          {filteredArtwork.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No artwork found in {activeTabLabel}.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredArtwork?.map((artwork) => {
                return (
                  <div className="flex flex-col md:flex-row md:justify-between bg-white rounded-lg shadow-md p-4 w-full mx-auto">
                    <div className="flex flex-col w-full lg:min-w-sm lg:max-w-sm order-2 md:order-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {artwork.title || 'Untitled'}
                      </h3>
                      <p className="text-gray-600">{artwork.description}</p>
                    </div>
                    <div
                      key={artwork.id || artwork.s3_url}
                      className="bg-white p-4 w-full max-w-xl mx-auto order-1 md:order-2"
                    >
                      {artwork.s3_url ? (
                        <img
                          src={artwork.s3_url}
                          alt={artwork.description || artwork.title || 'Artwork'}
                          className="w-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handleImageClick(artwork)}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-24 h-24 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {previewArtwork?.s3_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative max-h-full max-w-full">
            <img
              src={previewArtwork.s3_url}
              alt={previewArtwork.description || previewArtwork.title || 'Artwork'}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            <button
              onClick={handleClosePreview}
              className="absolute top-4 right-4 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-70 transition-colors"
              aria-label="Close image preview"
              type="button"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

