import { Facebook, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/artsandramaree/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://instagram.com/sandra_artclasses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
          </div>
          <p className="text-gray-600">
            ❤️ Built by{' '}
            <a
              href="https://teerzo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 hover:text-gray-700 underline transition-colors"
            >
              teerzo
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

