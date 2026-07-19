import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: string
  type: ToastType
  title: string
  message?: string
}

// Simple global toast store
let toasts: ToastItem[] = []
let listeners: Array<(t: ToastItem[]) => void> = []

function notify() { listeners.forEach((l) => l([...toasts])) }

export const toast = {
  success: (title: string, message?: string) => addToast('success', title, message),
  error: (title: string, message?: string) => addToast('error', title, message),
  warning: (title: string, message?: string) => addToast('warning', title, message),
  info: (title: string, message?: string) => addToast('info', title, message),
}

function addToast(type: ToastType, title: string, message?: string) {
  const id = Math.random().toString(36).slice(2)
  toasts = [...toasts, { id, type, title, message }]
  notify()
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    notify()
  }, 5000)
}

const icons = {
  success: <CheckCircle size={16} className="text-green-500 flex-shrink-0" />,
  error: <XCircle size={16} className="text-red-500 flex-shrink-0" />,
  warning: <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0" />,
  info: <Info size={16} className="text-blue-500 flex-shrink-0" />,
}

const colors = {
  success: 'border-green-100',
  error: 'border-red-100',
  warning: 'border-yellow-100',
  info: 'border-blue-100',
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    listeners.push(setItems)
    return () => { listeners = listeners.filter((l) => l !== setItems) }
  }, [])

  const dismiss = (id: string) => {
    toasts = toasts.filter((t) => t.id !== id)
    notify()
  }

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            className={cn(
              'bg-white rounded-xl border shadow-lg p-4 flex items-start gap-3 pointer-events-auto',
              colors[t.type]
            )}
          >
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{t.title}</p>
              {t.message && <p className="text-xs text-slate-500 mt-0.5">{t.message}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
