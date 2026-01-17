import { createFileRoute, Outlet } from '@tanstack/react-router'

import { supabase } from '../../utils/supabase'

export const Route = createFileRoute('/admin/portfolio/$slug')({
  ssr: 'data-only',
  loader: async ({ params }) => {
    try {
      console.log('params', params)
      const { data, error } = await supabase
        .from('artwork')
        .select('*')
        .eq('id', params.slug)
        .maybeSingle()

      if (error) {
        console.error('Supabase error:', error)
        return { artwork: null }
      }
      console.log('data', data)

      return { artwork: data }
    } catch (error) {
      console.error('Loader error:', error)
      return { artwork: null }
    }
  },
  component: AdminPortfolioSlugLayout,
})

function AdminPortfolioSlugLayout() {
  return <Outlet />
}
