import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/meet-the-artist')({
  component: MeetTheArtist,
})

function MeetTheArtist() {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Meet the Artist</h1>
        <p className="text-lg text-gray-600">
          Learn more about Sandra Maree and her artistic journey.
        </p>
      </div>
    </div>
  )
}

