import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Home, Images, LogOut, Menu, Upload, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate({ to: '/' })
  }

  return (
    <>
      <header className="p-4 flex items-center justify-between bg-white text-gray-900 shadow-lg border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open admin menu"
          >
            <Menu size={24} className="text-gray-900" />
          </button>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-900 flex items-center gap-2"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link
              to="/admin/portfolio"
              className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-900 flex items-center gap-2"
              activeProps={{
                className:
                  'px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-gray-900 flex items-center gap-2',
              }}
              title="Portfolio"
            >
              <Images size={20} />
              <span>Portfolio</span>
            </Link>
            <Link
              to="/admin/upload"
              className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-900 flex items-center gap-2"
              activeProps={{
                className:
                  'px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-gray-900 flex items-center gap-2',
              }}
              title="Upload Artwork"
            >
              <Upload size={20} />
              <span>Upload</span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-600 hidden md:inline">
              {user.email}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-900 flex items-center gap-2"
            title="Logout"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Admin</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close admin menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            to="/admin/portfolio"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
            }}
          >
            <Images size={20} />
            <span className="font-medium">Portfolio</span>
          </Link>

          <Link
            to="/admin/upload"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
            }}
          >
            <Upload size={20} />
            <span className="font-medium">Upload</span>
          </Link>

          <button
            onClick={async () => {
              await handleLogout()
              setIsOpen(false)
            }}
            className="flex w-full items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            title="Logout"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  )
}
