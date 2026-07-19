import { useState, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  active: string
  setActive: (value: string) => void
}

const TabsContext = createContext<TabsContextValue>({ active: '', setActive: () => {} })

interface TabsProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
  onChange?: (value: string) => void
}

export function Tabs({ defaultValue, children, className, onChange }: TabsProps) {
  const [active, setActive] = useState(defaultValue)
  const handleChange = (v: string) => { setActive(v); onChange?.(v) }
  return (
    <TabsContext.Provider value={{ active, setActive: handleChange }}>
      <div className={cn('', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center gap-1 border-b border-slate-200', className)}>
      {children}
    </div>
  )
}

interface TabTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function TabTrigger({ value, children, className, disabled }: TabTriggerProps) {
  const { active, setActive } = useContext(TabsContext)
  const isActive = active === value
  return (
    <button
      onClick={() => !disabled && setActive(value)}
      disabled={disabled}
      className={cn(
        'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all duration-200 whitespace-nowrap',
        isActive
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { active } = useContext(TabsContext)
  if (active !== value) return null
  return <div className={cn('animate-fade-in', className)}>{children}</div>
}
