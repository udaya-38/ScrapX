import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Bell, Search, ChevronDown, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import NotificationBell from '@/components/shared/NotificationBell'

export default function Navbar() {
  const { user, role, signOut } = useAuthStore()
  const cartItems = useCartStore((s) => s.totalItems())
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin'
    if (role === 'seller') return '/seller'
    return '/buyer'
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SX</span>
            </div>
            <span className="text-slate-900 font-bold text-lg hidden sm:block">
              Scrap<span className="text-blue-600">X</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search scrap materials, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-1 ml-auto">
            {!user ? (
              <>
                <Link to="/marketplace" className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 hidden sm:block">
                  Browse
                </Link>
                <Link
                  to="/auth/login"
                  className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {/* Cart (buyers only) */}
                {role === 'buyer' && (
                  <Link to="/buyer/cart" className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                    <ShoppingCart size={18} />
                    {cartItems > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {cartItems > 9 ? '9+' : cartItems}
                      </span>
                    )}
                  </Link>
                )}

                {/* Notifications */}
                <NotificationBell />

                {/* User menu */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Avatar src={user.avatar_url} name={user.full_name} size="sm" />
                    <span className="text-sm font-medium text-slate-700 hidden lg:block max-w-[120px] truncate">
                      {user.full_name}
                    </span>
                    <ChevronDown size={14} className="text-slate-400 hidden lg:block" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-slate-100 shadow-dropdown py-1 z-50"
                      >
                        <div className="px-3 py-2 border-b border-slate-50">
                          <p className="text-sm font-medium text-slate-900 truncate">{user.full_name}</p>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <LayoutDashboard size={14} /> Dashboard
                        </Link>
                        <Link
                          to={`${getDashboardPath()}/profile`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <User size={14} /> Profile
                        </Link>
                        <div className="border-t border-slate-50 mt-1 pt-1">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={14} /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden pb-3 overflow-hidden"
            >
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search scrap materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
