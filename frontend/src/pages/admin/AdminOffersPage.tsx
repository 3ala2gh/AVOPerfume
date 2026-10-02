import { useRef, useState, type ChangeEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CloudUpload, Image, LoaderCircle, Trash2 } from 'lucide-react'
import AdminEmptyState from '../../components/admin/AdminEmptyState'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { useCreateOfferMutation } from '../../hooks/useCreateOfferMutation'
import { useDeleteOfferMutation } from '../../hooks/useDeleteOfferMutation'
import { useOffersQuery } from '../../hooks/useOffersQuery'
import { useI18n } from '../../hooks/useI18n'
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary'
import { cn } from '../../utils/cn'

function AdminOffersPage() {
  const { t } = useI18n()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const queryClient = useQueryClient()
  const [offerToDelete, setOfferToDelete] = useState<number | null>(null)
  const { data: offers = [], isLoading: isLoadingOffers } = useOffersQuery({ source: 'admin' })
  const { mutateAsync: createOfferMutation, isPending: isUploadingOffer } = useCreateOfferMutation()
  const { mutateAsync: deleteOfferMutation, isPending: isDeletingOffer } = useDeleteOfferMutation()

  async function handleDeleteImage() {
    if (offerToDelete === null) return

    try {
      await deleteOfferMutation(offerToDelete)
      await queryClient.invalidateQueries({ queryKey: ['offers', 'admin'] })
      toast.success(t('admin.offerRemoved'))
    } catch {
      toast.error(t('admin.offerRemoveError'))
    } finally {
      setOfferToDelete(null)
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
        toast.success(t('admin.offerUploaded'))
      })
      .catch(() => {
        toast.error(t('admin.offerUploadError'))
      })
      .finally(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      })
  }

  return (
    <div className="space-y-6">
      <label
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink/15 bg-white px-6 py-8 text-center transition-colors focus-within:border-champagne hover:border-champagne hover:bg-champagne/[0.03] sm:flex-row sm:gap-4 sm:text-start',
          isUploadingOffer && 'pointer-events-none opacity-70',
        )}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-champagne/15 text-champagne-dark">
          {isUploadingOffer ? <LoaderCircle className="h-6 w-6 animate-spin" /> : <CloudUpload className="h-6 w-6" />}
        </span>
        <span>
          <span className="block text-sm font-semibold text-ink">
            {isUploadingOffer ? t('admin.uploading') : t('admin.uploadOfferImage')}
          </span>
          <span className="mt-0.5 block text-xs text-ink-muted">
            {t('admin.imageFormats')} · {t('admin.uploadOfferHint')}
          </span>
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          disabled={isUploadingOffer}
        />
      </label>

      {isLoadingOffers ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="aspect-[4/3] animate-pulse rounded-2xl bg-ink/[0.05]" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <AdminEmptyState icon={Image} title={t('admin.noOffersUploaded')} description={t('admin.pages.offers')} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <article
              key={offer.id}
              className="group relative overflow-hidden rounded-2xl border border-ink/[0.08] bg-white"
            >
              <img
                src={getOptimizedCloudinaryUrl(offer.imageUrl, { width: 600 })}
                alt={t('offers.imageAlt', { number: offer.id })}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="flex items-center justify-between gap-2 px-3.5 py-3">
                <span className="text-xs font-medium text-ink-muted">#{offer.id}</span>
                <button
                  type="button"
                  disabled={isDeletingOffer}
                  onClick={() => setOfferToDelete(offer.id)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('common.remove')}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={offerToDelete !== null}
        title={t('admin.deleteOfferTitle')}
        message={t('admin.deleteOfferConfirm')}
        confirmLabel={t('common.remove')}
        isPending={isDeletingOffer}
        onConfirm={() => void handleDeleteImage()}
        onCancel={() => setOfferToDelete(null)}
      />
    </div>
  )
}

export default AdminOffersPage
