import { TrendingUp, Package2, ClipboardList, Boxes, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { useAuthStore } from '@/store/authStore'
import { useDataStore } from '@/store/dataStore'
import { SELLER_REVENUE_DATA } from '@/lib/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function SellerDashboard() {
  const { user } = useAuthStore()
  const { listings, orders } = useDataStore()

  const sellerId = user?.id ?? 'demo-seller'
  const sellerListings = listings.filter((l) => l.seller_id === sellerId || l.seller_id === 'demo-seller')
  const sellerOrders = orders.filter((o) => o.seller_id === sellerId || o.seller_id === 'demo-seller')
  const pendingOrders = sellerOrders.filter((o) => o.status === 'pending')

  const totalRevenue = sellerOrders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total_amount, 1990000)

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'bg-green-50 text-green-600', sub: '+18% this month' },
    { label: 'Active Listings', value: String(sellerListings.filter((l) => l.status === 'approved').length), icon: Package2, color: 'bg-blue-50 text-blue-600', sub: `${sellerListings.length} total listings` },
    { label: 'Pending Orders', value: String(pendingOrders.length), icon: ClipboardList, color: 'bg-yellow-50 text-yellow-600', sub: 'Needs attention' },
    { label: 'Total Inventory', value: `${sellerListings.reduce((s, l) => s + l.available_quantity, 0)} MT`, icon: Boxes, color: 'bg-purple-50 text-purple-600', sub: '1 low stock alert' },
  ]

  return (
    <DashboardLayout
      title={`Hello, ${user?.full_name?.split(' ')[0] ?? 'Seller'}! 👋`}
      subtitle="Your scrap business performance & active inventory"
      actions={
        <Link to="/seller/listings/create">
          <Button size="sm">+ New Listing</Button>
        </Link>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} padding="md">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-0.5">{s.value}</p>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              <p className="text-xs text-green-600 mt-1">{s.sub}</p>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr,320px] gap-6 mb-6">
        <Card padding="none">
          <div className="flex items-center justify-between p-5 border-b border-slate-50">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Revenue Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">Last 7 months performance</p>
            </div>
            <Link to="/seller/analytics" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Full analytics <ArrowRight size={13} />
            </Link>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={SELLER_REVENUE_DATA}>
                <defs>
                  <linearGradient id="sellerRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: any) => formatCurrency(Number(v))} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#sellerRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="none">
          <div className="flex items-center justify-between p-5 border-b border-slate-50">
            <h2 className="text-sm font-semibold text-slate-900">Pending Orders</h2>
            <Link to="/seller/orders" className="text-sm text-blue-600 hover:underline flex items-center gap-1">View all <ArrowRight size={13} /></Link>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">#{order.order_number}</p>
                  <p className="text-xs text-slate-400">{formatDate(order.created_at)}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
            {pendingOrders.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">No pending orders requiring action</p>
            )}
          </div>
        </Card>
      </div>

      <Card padding="md">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm flex-shrink-0">✨</div>
          <div>
            <p className="text-sm font-semibold text-slate-900 mb-1">AI Business Insight</p>
            <p className="text-sm text-slate-600">
              Your <strong>Aluminum Extrusion Scrap</strong> listing is trending — 3x more views this week compared to last week. 
              Copper prices are up 8% nationally — a good time to list copper scrap if available.
            </p>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  )
}
