import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TriangleAlert } from 'lucide-react'
import AdminButton from './AdminButton'
import { useI18n } from '../../hooks/useI18n'

type ConfirmDialogProps = {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  isPending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useI18n()

  useEffect(() => {
    if (!isOpen) return

    // Capture phase + stopPropagation so Escape closes only this dialog, not a modal underneath it.
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      if (!isPending) onCancel()
    }

    window.addEventListener('keydown', handleEscape, true)
    return () => window.removeEventListener('keydown', handleEscape, true)
  }, [isOpen, isPending, onCancel])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="admin-ui fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          onClick={() => !isPending && onCancel()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lift"
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
              <TriangleAlert className="h-5 w-5" />
            </span>
            <h2 id="confirm-dialog-title" className="text-lg font-semibold text-ink">
              {title}
            </h2>
            <p className="mt-1.5 text-sm text-ink-muted">{message}</p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AdminButton variant="outline" onClick={onCancel} disabled={isPending}>
                {t('common.cancel')}
              </AdminButton>
              <AdminButton variant="danger" onClick={onConfirm} isLoading={isPending}>
                {confirmLabel ?? t('admin.confirmDelete')}
              </AdminButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
