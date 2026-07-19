import { PackageSearch, ShoppingBag, Users, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  type?: 'listings' | 'orders' | 'users' | 'search' | 'generic'
}

const typeIcons = {
  listings: <PackageSearch size={40} className="text-slate-300" />,
  orders: <ShoppingBag size={40} className="text-slate-300" />,
  users: <Users size={40} className="text-slate-300" />,
  search: <PackageSearch size={40} className="text-slate-300" />,
  generic: <AlertCircle size={40} className="text-slate-300" />,
}

export function EmptyState({ icon, title, description, action, className, type = 'generic' }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="mb-4">
        {icon ?? typeIcons[type]}
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-400 max-w-xs mb-4">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
