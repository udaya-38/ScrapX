import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, showPasswordToggle, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={cn(
              'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed',
              error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
              leftIcon && 'pl-9',
              (rightIcon || showPasswordToggle) && 'pr-9',
              className
            )}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          {rightIcon && !showPasswordToggle && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export default Input
