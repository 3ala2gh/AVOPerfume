import { Home, Trash2, Upload } from 'lucide-react'
import { useRef, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCreateOfferMutation } from '../../hooks/useCreateOfferMutation'
import { useDeleteOfferMutation } from '../../hooks/useDeleteOfferMutation'
import { useOffersQuery } from '../../hooks/useOffersQuery'
import { usePublishWebsiteMutation } from '../../hooks/usePublishWebsiteMutation'

type AdminOffersPageProps = {
  onLogout: () => void
}

function AdminOffersPage({ onLogout }: AdminOffersPageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const queryClient = useQueryClient()
  const { data: offers = [], isLoading: isLoadingOffers } = useOffersQuery({ source: 'admin' })
  const { mutateAsync: createOfferMutation, isPending: isUploadingOffer } = useCreateOfferMutation()
  const { mutateAsync: deleteOfferMutation, isPending: isDeletingOffer } = useDeleteOfferMutation()
  const { mutateAsync: publishWebsiteMutation, isPending: isPublishingWebsite } =
    usePublishWebsiteMutation()

  async function handleDeleteImage(offerId: number) {
    try {
      await deleteOfferMutation(offerId)
      await queryClient.invalidateQueries({ queryKey: ['offers', 'admin'] })
      toast.success('Offer removed successfully.')
    } catch {
      toast.error('Unable to remove offer right now.')
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    createOfferMutation(file)
      .then(async () => {
        await queryClient.invalidateQueries({ queryKey: ['offers', 'admin'] })
        toast.success('Offer uploaded successfully.')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      })
      .catch(() => {
        toast.error('Unable to upload offer right now.')
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
            {isUploadingOffer ? 'Uploading...' : 'Upload Offer Image'}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploadingOffer}
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

        {isLoadingOffers ? (
          <div className="rounded-md border border-black/10 bg-black/[0.02] px-4 py-10 text-center">
            <p className="text-sm text-black/70 sm:text-base">Loading offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="rounded-md border border-black/10 bg-black/[0.02] px-4 py-10 text-center">
            <p className="text-sm text-black/70 sm:text-base">No offer images uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <article key={offer.id} className="border border-black/10 p-3">
                <img
                  src={offer.imageUrl}
                  alt={`Offer ${offer.id}`}
                  className="mb-3 h-56 w-full object-cover"
                />
                <button
                  type="button"
                  disabled={isDeletingOffer}
                  onClick={() => handleDeleteImage(offer.id)}
                  className="inline-flex items-center gap-2 border border-black px-3 py-2 text-sm transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
