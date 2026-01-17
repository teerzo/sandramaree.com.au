import { Link, createFileRoute } from '@tanstack/react-router'

import ArtworkDetail from '../components/ArtworkDetail'
import { supabase } from '../utils/supabase'

export const Route = createFileRoute('/portfolio/$slug')({
  ssr: 'data-only',
  loader: async ({ params }) => {
    try {
      const { data, error } = await supabase
        .from('artwork')
        .select('*')
        .eq('id', params.slug)
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
  component: PortfolioDetail,
})

function PortfolioDetail() {
  const { artwork } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/portfolio"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to portfolio
        </Link>

        <div className="mt-6">
          {artwork ? (
            <ArtworkDetail artwork={artwork} />
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
              Artwork not found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
