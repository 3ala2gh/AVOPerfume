import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useI18n } from "../../hooks/useI18n";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: ReactNode;
};

const sizeClassMap = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  full: "max-w-[95vw]",
} as const;

export default function Modal({
  isOpen,
  onClose,
  title,
  size = "lg",
  children,
}: ModalProps) {
  const { t } = useI18n();
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-2 backdrop-blur-sm sm:p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title ?? "Modal"}
            className={`relative max-h-[95vh] w-full overflow-y-auto bg-white shadow-lift ${sizeClassMap[size]}`}
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white/90 text-ink backdrop-blur-sm transition-all duration-300 hover:border-champagne hover:bg-champagne hover:text-white"
              aria-label={t('common.closeModal')}
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
