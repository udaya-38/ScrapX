import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types/database'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, role } = useAuthStore()

  if (!user) return <Navigate to="/auth/login" replace />
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    if (role === 'admin') return <Navigate to="/admin" replace />
    if (role === 'seller') return <Navigate to="/seller" replace />
    return <Navigate to="/buyer" replace />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { user, role } = useAuthStore()

  if (user) {
    if (role === 'admin') return <Navigate to="/admin" replace />
    if (role === 'seller') return <Navigate to="/seller" replace />
    return <Navigate to="/buyer" replace />
  }

  return <Outlet />
}
