import { TrendingUp, Package, ShoppingBag, Heart, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { useDataStore } from '@/store/dataStore'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function BuyerDashboard() {
  const { user } = useAuthStore()
  const { orders, listings, wishlist } = useDataStore()
  const { totalItems } = useCartStore()

  const buyerOrders = orders.filter((o) => !user || o.buyer_id === user.id || o.buyer_id === 'demo-buyer')
  const totalSpent = buyerOrders.reduce((sum, o) => sum + o.total_amount, 0)
  const recentOrders = buyerOrders.slice(0, 3)
  const recommendations = listings.filter((l) => l.is_featured).slice(0, 3)

  const stats = [
    { label: 'Total Orders', value: String(buyerOrders.length), icon: Package, color: 'bg-blue-50 text-blue-600', change: '+3 this month' },
    { label: 'Total Spent', value: formatCurrency(totalSpent), icon: TrendingUp, color: 'bg-green-50 text-green-600', change: '+₹1.2L this month' },
    { label: 'Wishlist Items', value: String(wishlist.length), icon: Heart, color: 'bg-pink-50 text-pink-600', change: 'Available for order' },
    { label: 'Cart Items', value: String(totalItems()), icon: ShoppingBag, color: 'bg-purple-50 text-purple-600', change: 'Ready to checkout' },
  ]

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.full_name?.split(' ')[0] ?? 'Buyer'}! 👋`}
      subtitle="Here's what's happening with your purchase orders"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} padding="md">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-0.5">{stat.value}</p>
              <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr,380px] gap-6">
        <Card padding="none">
          <div className="flex items-center justify-between p-5 border-b border-slate-50">
            <h2 className="text-base font-semibold text-slate-900">Recent Orders</h2>
            <Link to="/buyer/orders" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-900">#{order.order_number}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(order.total_amount)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="none">
          <div className="flex items-center justify-between p-5 border-b border-slate-50">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Recommended for You</h2>
              <p className="text-xs text-blue-500 mt-0.5">✨ AI-powered picks</p>
            </div>
            <Link to="/marketplace" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Browse <ArrowRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recommendations.map((listing) => (
              <Link key={listing.id} to={`/marketplace/${listing.id}`} className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors">
                <div className="h-12 w-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  {listing.images?.[0]?.image_url ? (
                    <img src={listing.images[0].image_url} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">{listing.category?.icon}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{listing.title}</p>
                  <p className="text-xs text-slate-400">{listing.city}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(listing.price_per_unit)}</p>
                  <p className="text-xs text-slate-400">/{listing.unit}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/marketplace">
            <Button variant="outline" leftIcon={<ShoppingBag size={15} />}>Browse Marketplace</Button>
          </Link>
          <Link to="/buyer/cart">
            <Button variant="outline" leftIcon={<Package size={15} />}>View Cart</Button>
          </Link>
          <Link to="/buyer/wishlist">
            <Button variant="outline" leftIcon={<Heart size={15} />}>My Wishlist</Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
