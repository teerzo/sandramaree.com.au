import { useEffect, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'

import type { Tables } from '../../types/supabase'

type ArtworkRow = Tables<'artwork'>

const excludedFields = new Set<keyof ArtworkRow>([
  'description',
  's3_url',
  'title',
])

const formatLabel = (key: string) =>
  key
    .split('_')
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() ?? ''}${word.slice(1)}`)
    .join(' ')

const renderValue = (
  key: string,
  value: ArtworkRow[keyof ArtworkRow],
): ReactNode => {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (key.endsWith('_url') && typeof value === 'string') {
    return (
      <a
        href={value}
        className="text-indigo-600 hover:text-indigo-700 hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        {value}
      </a>
    )
  }

  return String(value)
}

export default function ArtworkDetail({ artwork }: { artwork: ArtworkRow }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const description = artwork.description?.trim()
  const detailEntries = (
    Object.entries(artwork) as Array<
      [keyof ArtworkRow, ArtworkRow[keyof ArtworkRow]]
    >
  ).filter(([key]) => !excludedFields.has(key))

  const handleImageClick = () => {
    if (artwork.s3_url) {
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal()
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsModalOpen(false)
        }
      }
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isModalOpen])

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div>
            {artwork.s3_url ? (
              <img
                src={artwork.s3_url}
                alt={artwork.description || artwork.title || 'Artwork'}
                className="w-full h-72 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleImageClick}
              />
            ) : (
              <div className="w-full h-72 bg-gray-200 rounded-lg flex items-center justify-center">
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
          <div className="flex flex-col w-full gap-3">
            <h1 className="text-3xl font-semibold text-gray-900">
              {artwork.title || 'Untitled'}
            </h1>
            <p className="text-gray-600">
              {description || 'No description provided.'}
            </p>

            <div className="flex flex-row items-center justify-between gap-2">
              {artwork.price ? (
                <>
                  {artwork?.is_sold ? (
                    <p className="text-2xl font-semibold text-gray-900 line-through"> ${artwork.price} </p>
                  ) : (
                    <p className="text-2xl font-semibold text-gray-900">
                      ${Number(artwork.price).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-2xl font-semibold text-gray-900">
                  {artwork?.is_sold ? 'Sold' : 'Offer'}
                </p>)
              }


              {artwork?.is_sold ? (
                <button className="bg-gray-600 hover:bg-gray-700 opacity-50 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-sm hover:shadow-md">
                  Unavailable
                </button>
              ) : (
                <>
                  {artwork.store_url ? (
                    <a href={artwork.store_url} target="_blank" rel="noreferrer">
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-sm hover:shadow-md">
                        View in Store
                      </button>
                    </a>
                  ) : (
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-sm hover:shadow-md">
                      Contact
                    </button>
                  )}
                </>
              )}
            </div>

          </div>
        </div>

        {/* <div className="mt-4">
          <dl className="space-y-3">
            {detailEntries.map(([key, value]) => (
              <div
                key={key}
                className="grid gap-2 sm:grid-cols-[180px_minmax(0,1fr)]"
              >
                <dt className="text-sm font-medium text-gray-500">
                  {formatLabel(String(key))}
                </dt>
                <dd className="text-sm text-gray-900">
                  {renderValue(String(key), value)}
                </dd>
              </div>
            ))}
          </dl>
        </div> */}
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && artwork.s3_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative max-h-full max-w-full">
            <img
              src={artwork.s3_url}
              alt={artwork.description || artwork.title || 'Artwork'}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-70 transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
