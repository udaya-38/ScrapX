import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  xs: { container: 'h-6 w-6', text: 'text-xs' },
  sm: { container: 'h-8 w-8', text: 'text-xs' },
  md: { container: 'h-9 w-9', text: 'text-sm' },
  lg: { container: 'h-11 w-11', text: 'text-base' },
  xl: { container: 'h-16 w-16', text: 'text-xl' },
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const { container, text } = sizeMap[size]

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'Avatar'}
        className={cn('rounded-full object-cover flex-shrink-0', container, className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold flex-shrink-0',
        container, text, className
      )}
    >
      {name ? getInitials(name) : '?'}
    </div>
  )
}
