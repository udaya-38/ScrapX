import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500 shadow-sm',
      secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400',
      outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-400',
      ghost: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500 shadow-sm',
      success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus-visible:ring-green-500 shadow-sm',
    }

    const sizes = {
      xs: 'px-2.5 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-2.5 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    )
  }
)
Button.displayName = 'Button'

export default Button
