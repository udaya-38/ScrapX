import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Modal({ open, onClose, title, description, size = 'md', children, footer }: ModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className={cn('relative w-full bg-white rounded-2xl shadow-2xl z-10', sizes[size])}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div>
                {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
                {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            {/* Body */}
            <div className="p-6">{children}</div>
            {/* Footer */}
            {footer && (
              <div className="px-6 pb-6 pt-0 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
