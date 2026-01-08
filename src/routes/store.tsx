import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/store')({
  component: Store,
})

function Store() {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Store</h1>
        <p className="text-lg text-gray-600">
          Browse and purchase Sandra Maree's artwork and products.
        </p>
      </div>
    </div>
  )
}

