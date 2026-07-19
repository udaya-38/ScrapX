import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('skeleton-pulse rounded-md bg-slate-100', className)} />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex justify-between items-center pt-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-100 p-5">
          <Skeleton className="h-8 w-8 rounded-lg mb-3" />
          <Skeleton className="h-7 w-24 mb-1.5" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonText({ lines = 3, className }: SkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3.5', i === lines - 1 ? 'w-4/5' : 'w-full')}
        />
      ))}
    </div>
  )
}
