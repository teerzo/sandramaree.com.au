import { Link, createFileRoute } from '@tanstack/react-router'

import ArtworkDetail from '../../components/ArtworkDetail'
import { Route as ParentRoute } from './portfolio.$slug'

export const Route = createFileRoute('/admin/portfolio/$slug/')({
  component: AdminPortfolioDetail,
})

function AdminPortfolioDetail() {
  // Access parent route's loader data directly
  const { artwork } = ParentRoute.useLoaderData()
  console.log('Artwork:', artwork)

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-row items-center justify-between gap-2 mb-2">
          <Link
            to="/admin/portfolio"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to portfolio
          </Link>

          {artwork && (
            <Link to="/admin/portfolio/$slug/edit" params={{ slug: artwork.id }}>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-sm hover:shadow-md">
                Edit
              </button>
            </Link>
          )}

        </div>

        {artwork ? (
          <ArtworkDetail artwork={artwork} />
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
            Artwork not found.
          </div>
        )}
      </div>
    </div>
  )
}
