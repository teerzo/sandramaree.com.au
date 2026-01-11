import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../../contexts/AuthContext'

export const Route = createFileRoute('/admin/')({
    component: AdminIndex,
})

function AdminIndex() {
    const { user } = useAuth()
    console.log('user', user);

    return (
        <div className="py-12 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-900">
                    HELLO SANDRA
                </h1>
                <p> {user?.email}</p>
            </div>
        </div>
    )
}
