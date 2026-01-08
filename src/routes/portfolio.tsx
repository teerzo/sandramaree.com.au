import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/portfolio')({
  component: Portfolio,
})

function Portfolio() {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Portfolio</h1>
        <p className="text-lg text-gray-600">
          Welcome to the portfolio page. This is where Sandra Maree's artwork will be displayed.
        </p>
      </div>
    </div>
  )
}

