import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

function Contact() {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact</h1>
        <p className="text-lg text-gray-600">
          Get in touch with Sandra Maree.
        </p>
      </div>
    </div>
  )
}
