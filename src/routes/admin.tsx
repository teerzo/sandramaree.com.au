import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { supabase } from '../utils/supabase'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/admin')({
    beforeLoad: async ({ location }) => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            })
        }
    },
    component: Admin,
})

function Admin() {
    const { user } = useAuth()
    console.log('user', user);

    return (
        <div className="min-h-screen bg-white">
            <Outlet />
        </div>
    )
}
