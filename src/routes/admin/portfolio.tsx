import { createFileRoute, Outlet } from '@tanstack/react-router'
import { supabase } from '../../utils/supabase'

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
      console.log('Artwork data loaded:', artwork)

      return { artwork: artwork || [] }
    } catch (error) {
      console.error('Loader error:', error)
      return { artwork: [] }
    }
  },
  component: AdminPortfolio,
})

function AdminPortfolio() {
  return <Outlet />
}
