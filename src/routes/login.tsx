import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/login')({
    validateSearch: (search: Record<string, unknown>) => {
        return {
            redirect: (search.redirect as string) || undefined,
        }
    },
    component: Login,
})

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const [isPageLoading, setIsPageLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { user, loading: authLoading } = useAuth()
    const { redirect } = useSearch({ from: '/login' })

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            const redirectTo = redirect || '/admin'
            navigate({ to: redirectTo })
        }
    }, [user, authLoading, navigate, redirect])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) {
                setError(authError.message || 'Invalid email or password')
                setIsLoading(false)
                return
            }

            if (data.user) {
                // Successful login - redirect to the original page or admin dashboard
                console.log('Login successful:', data.user)
                const redirectTo = redirect || '/admin'
                navigate({ to: redirectTo })
            }
        } catch (err) {
            console.error('Login error:', err)
            setError('An unexpected error occurred. Please try again.')
            setIsLoading(false)
        }
    }

    // Show loading while checking auth state
    if (authLoading) {
        return (
            <div className="min-h-screen bg-white py-12 px-6">
                <div className="max-w-md mx-auto text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white py-12 px-6">
            <div className="max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
