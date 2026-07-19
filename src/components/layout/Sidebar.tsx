import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  LayoutDashboard, ShoppingBag, Package, Heart, ShoppingCart, User,
  Package2, Boxes, ClipboardList, BarChart3, Building2, Users, Tag, X, ChevronLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { Avatar } from '@/components/ui/Avatar'
import type { UserRole } from '@/types/database'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard, ShoppingBag, Package, Heart, ShoppingCart, User,
  Package2, Boxes, ClipboardList, BarChart3, Building2, Users, Tag,
}

const NAV_ITEMS: Record<UserRole, { label: string; href: string; icon: string }[]> = {
  buyer: [
    { label: 'Dashboard', href: '/buyer', icon: 'LayoutDashboard' },
    { label: 'Marketplace', href: '/marketplace', icon: 'ShoppingBag' },
    { label: 'My Orders', href: '/buyer/orders', icon: 'Package' },
    { label: 'Wishlist', href: '/buyer/wishlist', icon: 'Heart' },
    { label: 'Cart', href: '/buyer/cart', icon: 'ShoppingCart' },
    { label: 'Profile', href: '/buyer/profile', icon: 'User' },
  ],
  seller: [
    { label: 'Dashboard', href: '/seller', icon: 'LayoutDashboard' },
    { label: 'Listings', href: '/seller/listings', icon: 'Package2' },
    { label: 'Inventory', href: '/seller/inventory', icon: 'Boxes' },
    { label: 'Orders', href: '/seller/orders', icon: 'ClipboardList' },
    { label: 'Analytics', href: '/seller/analytics', icon: 'BarChart3' },
    { label: 'Business Profile', href: '/seller/profile', icon: 'Building2' },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { label: 'Users', href: '/admin/users', icon: 'Users' },
    { label: 'Businesses', href: '/admin/businesses', icon: 'Building2' },
    { label: 'Listings', href: '/admin/listings', icon: 'Package2' },
    { label: 'Orders', href: '/admin/orders', icon: 'ClipboardList' },
    { label: 'Categories', href: '/admin/categories', icon: 'Tag' },
    { label: 'Reports', href: '/admin/reports', icon: 'BarChart3' },
  ],
}

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { user, role } = useAuthStore()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const items = role ? NAV_ITEMS[role] : []

  const roleColors: Record<UserRole, string> = {
    admin: 'bg-purple-600',
    seller: 'bg-blue-600',
    buyer: 'bg-teal-600',
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className={cn('flex items-center gap-3 px-4 h-16 border-b border-slate-100 flex-shrink-0', collapsed && 'justify-center')}>
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">SX</span>
        </div>
        {!collapsed && (
          <span className="text-slate-900 font-bold text-base">
            Scrap<span className="text-blue-600">X</span>
          </span>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="ml-auto p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors hidden lg:block"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? LayoutDashboard
            const isActive = item.href === '/buyer' || item.href === '/seller' || item.href === '/admin'
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href)

            return (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                    collapsed && 'justify-center px-2',
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={17} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User profile area */}
      {!collapsed && user && (
        <div className="p-4 border-t border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar src={user.avatar_url} name={user.full_name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.full_name}</p>
              <span className={cn('text-xs px-1.5 py-0.5 rounded text-white font-medium capitalize', role ? roleColors[role] : 'bg-slate-400')}>
                {role}
              </span>
            </div>
          </div>
        </div>
      )}

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="m-2 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors hidden lg:flex items-center justify-center"
        >
          <ChevronLeft size={14} className="rotate-180" />
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-white border-r border-slate-100 transition-all duration-300 flex-shrink-0',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-xl"
            >
              <button
                onClick={onMobileClose}
                className="absolute right-3 top-3 p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
