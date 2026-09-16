import { useEffect, type ReactNode } from 'react'
import { useI18n } from '../../hooks/useI18n'
import type { PerfumeSize } from '../../types/product'
import {
  getPerfumeSizePrice,
  PERFUME_SIZE_OPTIONS,
  type Perfume,
} from '../home/catalogData'
import Button from '../common/ui/Button'
import SalePrice from './SalePrice'
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
            ? 'relative aspect-square'
            : 'perfume-modal-details__image relative aspect-square w-full overflow-hidden sm:aspect-[9/16]'
        }
      >
        <img
          src={getOptimizedCloudinaryUrl(perfume.image, { width: 1200 })}
          srcSet={getCloudinarySrcSet(perfume.image, [600, 900, 1200, 1600])}
          sizes={isPage ? '(min-width: 768px) 50vw, 100vw' : '45vw'}
          alt={perfume.name}
          className={
            isPage
              ? 'h-full w-full object-contain'
              : 'h-full w-full object-contain sm:object-cover'
          }
          decoding="async"
        />
      </div>

      <div className={isPage ? 'p-6 md:p-10' : 'min-w-0 p-3 sm:p-6 md:p-8'}>
        <div className={isPage ? 'mb-6' : 'mb-3 sm:mb-6'}>
          <p
            className={
              isPage
                ? 'mb-2 text-xs uppercase tracking-[0.18em] text-black/50'
                : 'mb-1 text-[10px] uppercase tracking-[0.12em] text-black/50 sm:mb-2 sm:text-xs sm:tracking-[0.18em]'
            }
          >
            {categoryLabel(perfume.category, perfume.categoryAr)}
          </p>
          {showGender ? (
            <p
              className={
                isPage
                  ? 'mb-3 text-xs uppercase tracking-[0.16em] text-black/45'
                  : 'mb-2 text-[10px] uppercase tracking-[0.12em] text-black/45 sm:mb-3 sm:text-xs sm:tracking-[0.16em]'
              }
            >
              {genderLabel(perfume.gender)}
            </p>
          ) : null}
          <h1
            className={
              isPage
                ? 'mb-4 text-3xl tracking-wide md:text-4xl'
                : 'mb-2 break-words text-lg tracking-wide sm:mb-4 sm:text-3xl md:text-4xl'
            }
          >
            {perfume.name}
          </h1>
          <p
            className={
              isPage
                ? 'mb-4 text-2xl tracking-wide md:text-3xl'
                : 'mb-3 text-base tracking-wide sm:mb-4 sm:text-2xl md:text-3xl'
            }
          >
            <SalePrice price={getPerfumeSizePrice(perfume, selectedSize)} originalPrice={perfume.sizes.find((item) => item.size === selectedSize)?.originalPrice} />
          </p>

          <div
            className={
              isPage
                ? 'mb-6 grid grid-cols-4 gap-2'
                : 'mb-3 grid grid-cols-2 gap-1 sm:mb-6 sm:grid-cols-4 sm:gap-2'
            }
          >
            {availableSizes.map((size) => {
              const isActive = selectedSize === size

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectSize(size)}
                  className={`min-w-0 border text-center transition-colors ${
                    isPage ? 'px-2 py-2' : 'px-0.5 py-1.5 sm:px-2 sm:py-2'
                  } ${
                    isActive
                      ? 'border-black bg-black text-white'
                      : 'border-black/20 hover:border-black'
                  }`}
                >
                  <span
                    className={
                      isPage
                        ? 'block text-xs tracking-wide'
                        : 'block text-[9px] tracking-wide sm:text-xs'
                    }
                  >
                    {size}
                  </span>
                  <span
                    className={
                      isPage
                        ? 'block text-sm font-medium'
                        : 'block text-[10px] font-medium sm:text-sm'
                    }
                  >
                    <SalePrice price={getPerfumeSizePrice(perfume, size)} originalPrice={perfume.sizes.find((item) => item.size === size)?.originalPrice} />
                  </span>
                </button>
              )
            })}
          </div>

          <p
            className={
              isPage
                ? 'text-base leading-relaxed text-black/70 md:text-lg'
                : 'perfume-modal-details__description line-clamp-4 text-xs leading-relaxed text-black/70 sm:line-clamp-none sm:text-base md:text-lg'
            }
          >
            {perfume.description}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            onClick={onAddToCart}
            className={
              isPage
                ? 'w-full rounded-none py-4 tracking-wide'
                : 'w-full rounded-none px-2 py-2 text-xs tracking-wide sm:py-4 sm:text-sm'
            }
          >
            {t('common.addToCart')}
          </Button>
          {secondaryAction}
        </div>
      </div>
    </div>
  )
}
