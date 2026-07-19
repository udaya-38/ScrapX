import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from '@/components/ui/Toast'
import { ProtectedRoute, GuestRoute } from '@/components/shared/ProtectedRoute'
import { useAuthStore } from '@/store/authStore'

// Pages
import Landing from '@/pages/Landing'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import Marketplace from '@/pages/marketplace/Marketplace'
import ListingDetail from '@/pages/marketplace/ListingDetail'

// Buyer
import BuyerDashboard from '@/pages/buyer/Dashboard'
import BuyerOrders from '@/pages/buyer/Orders'
import Cart from '@/pages/buyer/Cart'
import Checkout from '@/pages/buyer/Checkout'
import Wishlist from '@/pages/buyer/Wishlist'
import BuyerProfile from '@/pages/buyer/Profile'

// Seller
import SellerDashboard from '@/pages/seller/Dashboard'
import SellerListings from '@/pages/seller/Listings'
import CreateListing from '@/pages/seller/CreateListing'
import Inventory from '@/pages/seller/Inventory'
import SellerOrders from '@/pages/seller/Orders'
import Analytics from '@/pages/seller/Analytics'
import SellerProfile from '@/pages/seller/Profile'

// Admin
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminUsers from '@/pages/admin/Users'
import AdminBusinesses from '@/pages/admin/Businesses'
import AdminListings from '@/pages/admin/Listings'
import AdminOrders from '@/pages/admin/Orders'
import AdminCategories from '@/pages/admin/Categories'
import AdminReports from '@/pages/admin/Reports'

function AppInitializer({ children }: { children: React.ReactNode }) {
  const { initialize, initialized } = useAuthStore()
  useEffect(() => { initialize() }, [initialize])
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInitializer>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<ListingDetail />} />

          {/* Auth (guests only) */}
          <Route element={<GuestRoute />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Buyer routes */}
          <Route element={<ProtectedRoute allowedRoles={['buyer']} />}>
            <Route path="/buyer" element={<BuyerDashboard />} />
            <Route path="/buyer/orders" element={<BuyerOrders />} />
            <Route path="/buyer/cart" element={<Cart />} />
            <Route path="/buyer/checkout" element={<Checkout />} />
            <Route path="/buyer/wishlist" element={<Wishlist />} />
            <Route path="/buyer/profile" element={<BuyerProfile />} />
          </Route>

          {/* Seller routes */}
          <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/seller/listings" element={<SellerListings />} />
            <Route path="/seller/listings/create" element={<CreateListing />} />
            <Route path="/seller/listings/edit/:id" element={<CreateListing />} />
            <Route path="/seller/inventory" element={<Inventory />} />
            <Route path="/seller/orders" element={<SellerOrders />} />
            <Route path="/seller/analytics" element={<Analytics />} />
            <Route path="/seller/profile" element={<SellerProfile />} />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/businesses" element={<AdminBusinesses />} />
            <Route path="/admin/listings" element={<AdminListings />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-3">
              <p className="text-4xl font-bold text-slate-900">404</p>
              <p className="text-slate-500">Page not found</p>
              <a href="/" className="text-blue-600 hover:underline text-sm">Go back home</a>
            </div>
          } />
        </Routes>
        <Toaster />
      </AppInitializer>
    </BrowserRouter>
  )
}
