import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

export function DashboardLayout({ children, title, subtitle, actions }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-slate-100 px-4 sm:px-6 h-16 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1 min-w-0">
            {title && (
              <h1 className="text-base font-semibold text-slate-900 truncate">{title}</h1>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 truncate">{subtitle}</p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
