import { useEffect, type ReactNode } from 'react'
import { useI18n } from '../../hooks/useI18n'
import type { PerfumeSize } from '../../types/product'
import {
  getPerfumeSizePrice,
  PERFUME_SIZE_OPTIONS,
  type Perfume,
} from '../home/catalogData'
import SalePrice from './SalePrice'
import SaleBadge from './SaleBadge'
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
  const availableSizes = PERFUME_SIZE_OPTIONS.filter(
    (size) => perfume.sizes.find((item) => item.size === size)?.enabled !== false,
  )

  useEffect(() => {
    if (availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
      onSelectSize(availableSizes[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfume, selectedSize])

  return (
    <div
      className={
        isPage
          ? 'grid grid-cols-1 md:grid-cols-2'
          : 'perfume-modal-details grid grid-cols-1 items-start sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]'
      }
    >
      <div
        className={
          isPage
            ? 'relative aspect-square bg-sand'
            : 'perfume-modal-details__image relative aspect-square w-full overflow-hidden bg-sand sm:aspect-[9/16]'
        }
      >
        <SaleBadge
          discountPercent={perfume.discountPercent}
          className="absolute left-4 top-4 z-10"
        />
        <img
          src={getOptimizedCloudinaryUrl(perfume.image, { width: 1200 })}
          srcSet={getCloudinarySrcSet(perfume.image, [600, 900, 1200, 1600])}
          sizes={isPage ? '(min-width: 768px) 50vw, 100vw' : '45vw'}
          alt={perfume.name}
          className={
            isPage
              ? 'h-full w-full object-contain p-6'
              : 'h-full w-full object-contain p-4 sm:object-cover sm:p-0'
          }
          decoding="async"
        />
      </div>

      <div className={isPage ? 'p-6 md:p-12' : 'min-w-0 p-4 sm:p-8 md:p-10'}>
        <div className={isPage ? 'mb-8' : 'mb-4 sm:mb-7'}>
          <p className="mb-2 text-[10px] uppercase tracking-widest text-ink-muted">
            {categoryLabel(perfume.category, perfume.categoryAr)}
          </p>
          {showGender ? (
            <p className="mb-3 text-[10px] uppercase tracking-widest text-ink/35">
              {genderLabel(perfume.gender)}
            </p>
          ) : null}

          <h1
            className={
              isPage
                ? 'font-display text-4xl font-light leading-tight tracking-wide md:text-5xl'
                : 'break-words font-display text-2xl font-light leading-tight tracking-wide sm:text-4xl'
            }
          >
            {perfume.name}
          </h1>

          <div className="my-4 h-px w-14 bg-champagne/50 sm:my-5" />

          <p
            className={
              isPage
                ? 'mb-7 text-2xl font-light tracking-wide md:text-3xl'
                : 'mb-4 text-lg font-light tracking-wide sm:mb-6 sm:text-2xl'
            }
          >
            <SalePrice
              price={getPerfumeSizePrice(perfume, selectedSize)}
              originalPrice={
                perfume.sizes.find((item) => item.size === selectedSize)?.originalPrice
              }
            />
          </p>

          <p className="mb-3 text-[10px] uppercase tracking-widest text-ink-muted">
            {t('common.size')}
          </p>
          <div
            className={
              isPage
                ? 'mb-8 grid grid-cols-4 gap-2.5'
                : 'mb-4 grid grid-cols-2 gap-2 sm:mb-6 sm:grid-cols-4 sm:gap-2.5'
            }
          >
            {availableSizes.map((size) => {
              const isActive = selectedSize === size

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectSize(size)}
                  className={`min-w-0 border px-2 py-2.5 text-center transition-all duration-300 ease-luxe ${
                    isActive
                      ? 'border-champagne bg-champagne text-white'
                      : 'border-ink/15 text-ink hover:border-champagne hover:text-champagne'
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-widest">
                    {size}
                  </span>
                  <span className="mt-1 block text-xs font-light">
                    <SalePrice
                      price={getPerfumeSizePrice(perfume, size)}
                      originalPrice={
                        perfume.sizes.find((item) => item.size === size)?.originalPrice
                      }
                    />
                  </span>
                </button>
              )
            })}
          </div>

          <p
            className={
              isPage
                ? 'text-sm font-light leading-relaxed text-ink-muted md:text-base'
                : 'perfume-modal-details__description line-clamp-4 text-xs font-light leading-relaxed text-ink-muted sm:line-clamp-none sm:text-sm'
            }
          >
            {perfume.description}
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onAddToCart}
            className={`w-full bg-ink text-[11px] font-medium uppercase tracking-luxe text-white transition-all duration-500 ease-luxe hover:bg-champagne ${
              isPage ? 'py-4' : 'py-3.5'
            }`}
          >
            {t('common.addToCart')}
          </button>
          {secondaryAction}
        </div>
      </div>
    </div>
  )
}
