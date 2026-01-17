import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { getArtworkSlug } from '../utils/portfolio'
import { supabase } from '../utils/supabase'

const normalizeCategory = (category: string | null | undefined) =>
  (category ?? '').trim().toLowerCase()

const categoryTabs = [
  {
    key: 'portraits',
    label: 'Portraits',
    matches: (category: string | null | undefined) =>
      normalizeCategory(category) === 'portraits',
  },
  {
    key: 'sunrise-and-seas',
    label: 'Sunrise and Seas',
    matches: (category: string | null | undefined) =>
      normalizeCategory(category) === 'sunrise and seas',
  },
]

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
  const { artwork } = Route.useLoaderData()
  const [activeTab, setActiveTab] = useState(categoryTabs[0].key)

  const tabCounts = useMemo(() => {
    return categoryTabs.reduce<Record<string, number>>((counts, tab) => {
      counts[tab.key] = artwork.filter((item) =>
        tab.matches(item.category),
      ).length
      return counts
    }, {})
  }, [artwork])

  const filteredArtwork = useMemo(() => {
    const activeMatcher =
      categoryTabs.find((tab) => tab.key === activeTab) ?? categoryTabs[0]
    return artwork.filter((item) => activeMatcher.matches(item.category))
  }, [artwork, activeTab])

  const activeTabLabel =
    categoryTabs.find((tab) => tab.key === activeTab)?.label ??
    categoryTabs[0].label

  console.log('artwork', artwork);

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Portfolio</h1>
        <p className="text-lg text-gray-600">
          Welcome to the portfolio page. This is where Sandra Maree's artwork will be displayed.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {categoryTabs.map((tab) => {
            const isActive = tab.key === activeTab
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
                aria-pressed={isActive}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive
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

        {filteredArtwork.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
            No artwork found in {activeTabLabel}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtwork?.map((artwork) => {
              const slug = getArtworkSlug(artwork)
              return (
                <div
                  key={artwork.id || artwork.s3_url}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  {artwork.s3_url ? (
                    <img
                      src={artwork.s3_url}
                      alt={artwork.description || artwork.title || 'Artwork'}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
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
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {artwork.title || 'Untitled'}
                  </h3>
                  <p className="text-gray-600">{artwork.description}</p>
                  <Link
                    to="/portfolio/$slug"
                    params={{ slug }}
                    className="mt-3 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    View details
                  </Link>
              </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

