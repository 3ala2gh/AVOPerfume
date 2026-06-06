import type { ReactNode } from 'react'
import { useI18n } from '../../hooks/useI18n'
import type { PerfumeSize } from '../../types/product'
import {
  getPerfumeSizePrice,
  PERFUME_SIZE_OPTIONS,
  type Perfume,
} from '../home/catalogData'
import Button from '../common/ui/Button'
import {
  getCloudinarySrcSet,
  getOptimizedCloudinaryUrl,
} from '../../utils/cloudinary'

type PerfumeDetailsProps = {
  perfume: Perfume
  selectedSize: PerfumeSize
  onSelectSize: (size: PerfumeSize) => void
  onAddToCart: () => void
  secondaryAction?: ReactNode
  showGender?: boolean
  variant?: 'modal' | 'page'
}

export default function PerfumeDetails({
  perfume,
  selectedSize,
  onSelectSize,
  onAddToCart,
  secondaryAction,
  showGender = false,
  variant = 'modal',
}: PerfumeDetailsProps) {
  const { t, categoryLabel, genderLabel } = useI18n()
  const isPage = variant === 'page'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div
        className={
          isPage
            ? 'relative aspect-square'
            : 'relative flex min-h-[170px] items-center justify-center bg-gray-100 p-1 sm:min-h-[210px] md:min-h-[360px]'
        }
      >
        <img
          src={getOptimizedCloudinaryUrl(perfume.image, { width: 1200 })}
          srcSet={getCloudinarySrcSet(perfume.image, [600, 900, 1200, 1600])}
          sizes="(min-width: 768px) 50vw, 100vw"
          alt={perfume.name}
          className={
            isPage
              ? 'h-full w-full object-contain'
              : 'max-h-[160px] w-full object-contain sm:max-h-[200px] md:max-h-[340px]'
          }
          decoding="async"
        />
      </div>

      <div className="p-6 md:p-10">
        <div className="mb-6">
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-black/50">
            {categoryLabel(perfume.category, perfume.categoryAr)}
          </p>
          {showGender ? (
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-black/45">
              {genderLabel(perfume.gender)}
            </p>
          ) : null}
          <h1 className="mb-4 text-3xl tracking-wide md:text-4xl">{perfume.name}</h1>
          <p className="mb-4 text-2xl tracking-wide md:text-3xl">
            {getPerfumeSizePrice(perfume, selectedSize)} {t('common.jod')}
          </p>

          <div className="mb-6 grid grid-cols-3 gap-2">
            {PERFUME_SIZE_OPTIONS.map((size) => {
              const isActive = selectedSize === size

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectSize(size)}
                  className={`border px-2 py-2 text-center transition-colors ${
                    isActive
                      ? 'border-black bg-black text-white'
                      : 'border-black/20 hover:border-black'
                  }`}
                >
                  <span className="block text-xs tracking-wide">{size}</span>
                  <span className="block text-sm font-medium">
                    {getPerfumeSizePrice(perfume, size)} {t('common.jod')}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="text-base leading-relaxed text-black/70 md:text-lg">
            {perfume.description}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            onClick={onAddToCart}
            className="w-full rounded-none py-4 tracking-wide"
          >
            {t('common.addToCart')}
          </Button>
          {secondaryAction}
        </div>
      </div>
    </div>
  )
}
