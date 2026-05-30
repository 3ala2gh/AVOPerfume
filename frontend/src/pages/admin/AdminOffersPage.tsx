import { Home, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { usePublishWebsiteMutation } from '../../hooks/usePublishWebsiteMutation'
import { getStoredOfferImages, setStoredOfferImages } from '../../utils/offersStorage'

type AdminOffersPageProps = {
  onLogout: () => void
}

function AdminOffersPage({ onLogout }: AdminOffersPageProps) {
  const [images, setImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { mutateAsync: publishWebsiteMutation, isPending: isPublishingWebsite } =
    usePublishWebsiteMutation()

  useEffect(() => {
    setImages(getStoredOfferImages())
  }, [])

  function persistImages(nextImages: string[]) {
    setImages(nextImages)
    setStoredOfferImages(nextImages)
  }

  function handleDeleteImage(indexToDelete: number) {
    const nextImages = images.filter((_, index) => index !== indexToDelete)
    persistImages(nextImages)
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])

    if (files.length === 0) {
      return
    }

    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(String(reader.result))
            reader.onerror = () => reject(new Error('Failed to read file'))
            reader.readAsDataURL(file)
          }),
      ),
    )
      .then((newImages) => {
        persistImages([...images, ...newImages])
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      })
      .catch(() => {
        window.alert('Unable to upload one or more images.')
      })
  }

  async function handlePublishWebsite() {
    try {
      await publishWebsiteMutation()
      toast.success('Website publish triggered successfully.')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to trigger website publish right now.'
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-white/10 bg-black text-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-2xl tracking-wider">AVO PERFUMES</h1>
              <p className="text-sm opacity-60">Admin Dashboard - Offers</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin"
                className="flex items-center gap-2 border border-white/20 px-4 py-2 transition-colors hover:bg-white/10"
              >
                Products
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 bg-white px-4 py-2 text-black transition-colors hover:bg-white/90"
              >
                <Home className="h-4 w-4" />
                View Store
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 bg-black px-4 py-2 text-white transition-opacity hover:opacity-90">
            <Upload className="h-4 w-4" />
            Upload Offer Images
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <button
            type="button"
            onClick={handlePublishWebsite}
            disabled={isPublishingWebsite}
            className="border border-black px-4 py-2 text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPublishingWebsite ? 'Publishing...' : 'Publish Website'}
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="border border-black px-4 py-2 text-black transition-colors hover:bg-black hover:text-white"
          >
            Logout
          </button>
        </div>

        {images.length === 0 ? (
          <div className="rounded-md border border-black/10 bg-black/[0.02] px-4 py-10 text-center">
            <p className="text-sm text-black/70 sm:text-base">No offer images uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <article key={`${image.slice(0, 40)}-${index}`} className="border border-black/10 p-3">
                <img
                  src={image}
                  alt={`Offer ${index + 1}`}
                  className="mb-3 h-56 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="inline-flex items-center gap-2 border border-black px-3 py-2 text-sm transition-colors hover:bg-black hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminOffersPage
