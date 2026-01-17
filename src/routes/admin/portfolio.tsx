import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { supabase } from '../../utils/supabase'

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
  {
    key: 'misc',
    label: 'Misc',
    matches: (category: string | null | undefined) =>
      normalizeCategory(category) === '',
  },
]

const getCategoryLabel = (category: string | null | undefined) => {
  const normalized = normalizeCategory(category)
  if (!normalized) {
    return 'Misc'
  }
  if (normalized === 'portraits') {
    return 'Portraits'
  }
  if (normalized === 'sunrise and seas') {
    return 'Sunrise and Seas'
  }
  return category ?? 'Misc'
}

export const Route = createFileRoute('/admin/portfolio')({
  ssr: 'data-only',
  loader: async () => {
    try {
      const { data: artwork, error } = await supabase
        .from('artwork')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        return { artwork: [] }
      }

      return { artwork: artwork || [] }
    } catch (error) {
      console.error('Loader error:', error)
      return { artwork: [] }
    }
  },
  component: AdminPortfolio,
})

function AdminPortfolio() {
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

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-lg text-gray-600">
            Review portfolio entries by category.
          </p>
        </div>

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
            {filteredArtwork.map((item) => {
              const description = item.description?.trim()
              return (
                <div
                  key={item.id || item.s3_url}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  {item.s3_url ? (
                    <img
                      src={item.s3_url}
                      alt={item.description || item.title || 'Artwork'}
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
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {item.title || 'Untitled'}
                    </h3>
                    <span className="text-xs uppercase tracking-wide text-gray-500">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    {description || 'No description provided.'}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
