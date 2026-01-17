import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { Upload as UploadIcon, X } from 'lucide-react'

import { useAuth } from '../../contexts/AuthContext'
import { getArtworkIdFromSlug, getArtworkSlug } from '../../utils/portfolio'
import { supabase } from '../../utils/supabase'

export const Route = createFileRoute('/admin/portfolio/$slug/edit')({
  ssr: 'data-only',
  loader: async ({ params }) => {
    try {
      const artworkId = getArtworkIdFromSlug(params.slug)
      const { data, error } = await supabase
        .from('artwork')
        .select('*')
        .eq('id', artworkId)
        .maybeSingle()

      if (error) {
        console.error('Supabase error:', error)
        return { artwork: null }
      }

      return { artwork: data }
    } catch (error) {
      console.error('Loader error:', error)
      return { artwork: null }
    }
  },
  component: AdminPortfolioEdit,
})

function AdminPortfolioEdit() {
  const { artwork } = Route.useLoaderData()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState(artwork?.title ?? '')
  const [description, setDescription] = useState(artwork?.description ?? '')
  const [category, setCategory] = useState(artwork?.category ?? '')
  const [artworkDate, setArtworkDate] = useState(artwork?.date ?? '')
  const [price, setPrice] = useState(
    artwork?.price !== null && artwork?.price !== undefined
      ? String(artwork.price)
      : '',
  )
  const [storeUrl, setStoreUrl] = useState(artwork?.store_url ?? '')
  const [isFavourite, setIsFavourite] = useState(!!artwork?.is_favourite)
  const [isSold, setIsSold] = useState(!!artwork?.is_sold)
  const [s3Url, setS3Url] = useState(artwork?.s3_url ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!artwork) {
    return (
      <div className="min-h-screen bg-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
            Artwork not found.
          </div>
        </div>
      </div>
    )
  }

  const previewSrc = selectedFile ? preview : s3Url

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()
    const trimmedCategory = category.trim()
    const trimmedStoreUrl = storeUrl.trim()
    const trimmedPrice = price.trim()
    const trimmedDate = artworkDate.trim()
    const trimmedS3Url = s3Url.trim()
    const parsedPrice = trimmedPrice ? Number(trimmedPrice) : null

    if (!trimmedTitle) {
      setError('Title is required')
      return
    }

    if (!trimmedDescription) {
      setError('Description is required')
      return
    }

    if (!selectedFile && !trimmedS3Url) {
      setError('Storage URL is required')
      return
    }

    if (trimmedPrice && Number.isNaN(parsedPrice)) {
      setError('Price must be a valid number')
      return
    }

    if (selectedFile && !user) {
      setError('You must be logged in to upload artwork')
      return
    }

    setIsSaving(true)

    try {
      let finalS3Url = trimmedS3Url
      let uploadedFilePath: string | null = null

      if (selectedFile && user) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`
        const filePath = `${user.id}/${fileName}`
        uploadedFilePath = filePath

        const { error: uploadError } = await supabase.storage
          .from('artworks')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          setError(uploadError.message || 'Failed to upload image')
          setIsSaving(false)
          return
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('artworks').getPublicUrl(filePath)

        finalS3Url = publicUrl
      }

      const { error: updateError } = await supabase
        .from('artwork')
        .update({
          title: trimmedTitle,
          description: trimmedDescription,
          s3_url: finalS3Url,
          category: trimmedCategory ? trimmedCategory : null,
          is_favourite: isFavourite,
          is_sold: isSold,
          price: parsedPrice,
          store_url: trimmedStoreUrl ? trimmedStoreUrl : null,
          date: trimmedDate ? trimmedDate : null,
        })
        .eq('id', artwork.id)

      if (updateError) {
        console.error('Update error:', updateError)
        setError(updateError.message || 'Failed to save artwork')
        if (uploadedFilePath) {
          await supabase.storage.from('artworks').remove([uploadedFilePath])
        }
        setIsSaving(false)
        return
      }

      const updatedSlug = getArtworkSlug({
        ...artwork,
        title: trimmedTitle,
      })

      navigate({
        to: '/admin/portfolio/$slug',
        params: { slug: updatedSlug },
      })
    } catch (err) {
      console.error('Error:', err)
      setError('An unexpected error occurred. Please try again.')
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-3 mb-8">
          <Link
            to="/admin/portfolio/$slug"
            params={{ slug: getArtworkSlug(artwork) }}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Back to portfolio entry
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">
            Edit portfolio entry
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Image File
            </label>
            {!previewSrc ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop an image here, or click to select
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={previewSrc}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain bg-gray-50"
                  />
                </div>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter artwork title"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter artwork description"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-gray-700 font-bold mb-2"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category ?? ''}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Portraits, Sunrise and Seas, or leave blank for Misc"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-gray-700 font-bold mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={artworkDate ?? ''}
                onChange={(e) => setArtworkDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-gray-700 font-bold mb-2"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="storeUrl"
                className="block text-gray-700 font-bold mb-2"
              >
                Store URL
              </label>
              <input
                type="url"
                id="storeUrl"
                value={storeUrl ?? ''}
                onChange={(e) => setStoreUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="inline-flex items-center gap-2 text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={isFavourite}
                onChange={(e) => setIsFavourite(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              Mark as favourite
            </label>
            <label className="inline-flex items-center gap-2 text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={isSold}
                onChange={(e) => setIsSold(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              Mark as sold
            </label>
          </div>

          <div>
            <label htmlFor="s3Url" className="block text-gray-700 font-bold mb-2">
              Storage URL *
            </label>
            <input
              type="url"
              id="s3Url"
              value={s3Url}
              onChange={(e) => setS3Url(e.target.value)}
              required={!selectedFile}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="id" className="block text-gray-700 font-bold mb-2">
                ID
              </label>
              <input
                type="text"
                id="id"
                value={artwork.id}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="createdAt"
                className="block text-gray-700 font-bold mb-2"
              >
                Created At
              </label>
              <input
                type="text"
                id="createdAt"
                value={artwork.created_at}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="updatedAt"
                className="block text-gray-700 font-bold mb-2"
              >
                Updated At
              </label>
              <input
                type="text"
                id="updatedAt"
                value={artwork.updated_at}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
