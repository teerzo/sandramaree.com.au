import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { Upload as UploadIcon, X } from 'lucide-react'
import { supabase } from '../../utils/supabase'
import { useAuth } from '../../contexts/AuthContext'

export const Route = createFileRoute('/admin/upload')({
    component: Upload,
})

function Upload() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [s3Url, setS3Url] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const { user } = useAuth()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            // Create preview
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
        setSuccess(false)
        
        // Validate required fields
        if (!selectedFile) {
            setError('Please select an image file')
            return
        }

        const trimmedTitle = title.trim()
        const trimmedDescription = description.trim()

        if (!trimmedTitle) {
            setError('Title is required')
            return
        }

        if (!trimmedDescription) {
            setError('Description is required')
            return
        }

        if (!user) {
            setError('You must be logged in to upload artwork')
            return
        }
        
        setIsUploading(true)

        try {
            // Generate a unique file name
            const fileExt = selectedFile.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            // Upload file to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('artworks')
                .upload(filePath, selectedFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                console.error('Upload error:', uploadError)
                setError(uploadError.message || 'Failed to upload image')
                setIsUploading(false)
                return
            }

            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
                .from('artworks')
                .getPublicUrl(filePath)

            // Store the s3_url for display
            setS3Url(publicUrl)

            // Save artwork data to database with validated/trimmed values
            const { error: insertError } = await supabase
                .from('artwork')
                .insert([
                    {
                        title: trimmedTitle,
                        description: trimmedDescription,
                        s3_url: publicUrl
                    }
                ])

            if (insertError) {
                console.error('Insert error:', insertError)
                setError(insertError.message || 'Failed to save artwork')
                // Try to delete the uploaded file if database insert fails
                await supabase.storage.from('artworks').remove([filePath])
                setIsUploading(false)
                setS3Url('')
                return
            }

            // Success!
            setSuccess(true)
            setIsUploading(false)

            // Redirect to portfolio after 2 seconds
            setTimeout(() => {
                // Reset form
                setSelectedFile(null)
                setPreview(null)
                setTitle('')
                setDescription('')
                setS3Url('')
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
                navigate({ to: '/portfolio' })
            }, 2000)

        } catch (err) {
            console.error('Error:', err)
            setError('An unexpected error occurred. Please try again.')
            setIsUploading(false)
            setS3Url('')
        }
    }

    return (
        <div className="min-h-screen bg-white py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Upload Artwork</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Upload Area */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">
                            Image File
                        </label>
                        {!preview ? (
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
                                <p className="text-sm text-gray-500">
                                    PNG, JPG, GIF up to 10MB
                                </p>
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
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-auto max-h-96 object-contain bg-gray-50"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                                    title="Remove image"
                                >
                                    <X size={20} />
                                </button>
                                {selectedFile && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Title Field */}
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

                    {/* Description Field */}
                    <div>
                        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
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

                    {/* S3 URL Field - Disabled, shows after upload */}
                    <div>
                        <label htmlFor="s3Url" className="block text-gray-700 font-bold mb-2">
                            Storage URL
                        </label>
                        <input
                            type="url"
                            id="s3Url"
                            value={s3Url}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                            placeholder="URL will appear here after upload"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                            Artwork uploaded successfully! Redirecting to portfolio...
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!selectedFile || !title.trim() || !description.trim() || isUploading}
                        className="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
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
                                Uploading...
                            </>
                        ) : (
                            'Upload Artwork'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
