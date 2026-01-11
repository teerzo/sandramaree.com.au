import { Link, useNavigate } from '@tanstack/react-router'
import { Home, LogOut, Upload } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function AdminHeader() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate({ to: '/' })
  }

  return (
    <header className="p-4 flex items-center justify-between bg-white text-gray-900 shadow-lg border-b border-gray-200">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-900 flex items-center gap-2"
        >
          <Home size={20} />
          <span>Home</span>
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
  )
}
