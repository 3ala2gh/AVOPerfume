import { useEffect, useMemo, type InputHTMLAttributes, type Ref } from 'react'
import { ImagePlus } from 'lucide-react'
import { useI18n } from '../../hooks/useI18n'
import { cn } from '../../utils/cn'

type ImagePickerProps = {
  id: string
  file: File | null | undefined
  existingUrl?: string | null
  invalid?: boolean
  inputProps: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }
}

export default function ImagePicker({ id, file, existingUrl, invalid, inputProps }: ImagePickerProps) {
  const { t } = useI18n()
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  useEffect(() => {
    if (!previewUrl) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const shownUrl = previewUrl ?? existingUrl ?? null

  return (
    <label
      htmlFor={id}
      className={cn(
        'group flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed p-4 transition-colors focus-within:border-champagne hover:border-champagne hover:bg-champagne/[0.04]',
        invalid ? 'border-red-300 bg-red-50/40' : 'border-ink/15 bg-ivory/60',
      )}
    >
      {shownUrl ? (
        <img
          src={shownUrl}
          alt=""
          className="h-20 w-20 shrink-0 rounded-lg border border-ink/10 bg-white object-contain"
        />
      ) : (
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-white text-champagne shadow-sm">
          <ImagePlus className="h-7 w-7" />
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink group-hover:text-champagne-dark">
          {shownUrl ? t('admin.changeImage') : t('admin.chooseImage')}
        </span>
        <span className="mt-0.5 block truncate text-xs text-ink-muted">
          {file?.name ?? t('admin.imageFormats')}
        </span>
      </span>
      <input id={id} type="file" accept="image/*" className="sr-only" {...inputProps} />
    </label>
  )
}
