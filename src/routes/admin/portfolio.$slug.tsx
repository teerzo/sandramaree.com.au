import { Link, createFileRoute } from '@tanstack/react-router'

import ArtworkDetail from '../../components/ArtworkDetail'
import { getArtworkIdFromSlug } from '../../utils/portfolio'
import { supabase } from '../../utils/supabase'

export const Route = createFileRoute('/admin/portfolio/$slug')({
  ssr: 'data-only',
  loader: async ({ params }) => {
    try {
      const artworkId = getArtworkIdFromSlug(params.slug)
      const { data, error } = await supabase
        .from('artwork')
        .select('*')
        .eq('id', artworkId)
        .maybeSingle()

      if (error) {
        console.error('Supabase error:', error)
        return { artwork: null }
      }

      return { artwork: data }
    } catch (error) {
      console.error('Loader error:', error)
      return { artwork: null }
    }
  },
  component: AdminPortfolioDetail,
})

function AdminPortfolioDetail() {
  const { artwork } = Route.useLoaderData()
  const { slug } = Route.useParams()

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 mb-6">
          <Link
            to="/admin/portfolio"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to portfolio
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-semibold text-gray-900">
              Portfolio entry
            </h1>
            {artwork && (
              <Link
                to="/admin/portfolio/$slug/edit"
                params={{ slug }}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50"
              >
                Edit entry
              </Link>
            )}
          </div>
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
