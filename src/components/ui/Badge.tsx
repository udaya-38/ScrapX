import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
  size?: 'sm' | 'md'
}

export function Badge({ className, variant = 'default', size = 'sm', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    primary: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-indigo-50 text-indigo-700',
    outline: 'border border-slate-200 text-slate-600 bg-transparent',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

interface StatusBadgeProps {
  status: string
  className?: string
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-50 text-yellow-700' },
  accepted: { label: 'Accepted', className: 'bg-blue-50 text-blue-700' },
  packed: { label: 'Packed', className: 'bg-purple-50 text-purple-700' },
  shipped: { label: 'Shipped', className: 'bg-indigo-50 text-indigo-700' },
  delivered: { label: 'Delivered', className: 'bg-green-50 text-green-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-700' },
  rejected: { label: 'Rejected', className: 'bg-slate-100 text-slate-600' },
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-500' },
  pending_review: { label: 'Pending Review', className: 'bg-yellow-50 text-yellow-700' },
  approved: { label: 'Approved', className: 'bg-green-50 text-green-700' },
  paused: { label: 'Paused', className: 'bg-slate-100 text-slate-500' },
  active: { label: 'Active', className: 'bg-green-50 text-green-700' },
  suspended: { label: 'Suspended', className: 'bg-red-50 text-red-700' },
  verified: { label: 'Verified', className: 'bg-blue-50 text-blue-700' },
  unverified: { label: 'Unverified', className: 'bg-yellow-50 text-yellow-700' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? { label: status, className: 'bg-slate-100 text-slate-600' }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full', config.className, className)}>
      {config.label}
    </span>
  )
}
