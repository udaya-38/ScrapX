import { Bell } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatRelativeTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useDataStore } from '@/store/dataStore'

const typeColors: Record<string, string> = {
  order: 'bg-blue-50 text-blue-600',
  listing: 'bg-green-50 text-green-600',
  review: 'bg-yellow-50 text-yellow-600',
  system: 'bg-slate-100 text-slate-600',
  verification: 'bg-purple-50 text-purple-600',
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { notifications, markNotificationRead, clearNotifications } = useDataStore()
  const ref = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.is_read).length

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl border border-slate-100 shadow-dropdown z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={() => notifications.forEach((n) => markNotificationRead(n.id))} className="text-xs text-blue-600 hover:underline">
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      'flex gap-3 px-4 py-3 border-b border-slate-50 last:border-0 cursor-pointer transition-colors',
                      !n.is_read ? 'bg-blue-50/40' : 'hover:bg-slate-50'
                    )}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <div className={cn('h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0', typeColors[n.type])}>
                      {n.type === 'order' ? '📦' : n.type === 'listing' ? '✅' : n.type === 'review' ? '⭐' : '🔔'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm', !n.is_read ? 'font-medium text-slate-900' : 'text-slate-700')}>{n.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-xs text-slate-300 mt-1">{formatRelativeTime(n.created_at)}</p>
                    </div>
                    {!n.is_read && (
                      <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
