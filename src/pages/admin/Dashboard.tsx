import { Users, Package2, ClipboardList, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { ADMIN_GROWTH_DATA } from '@/lib/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useDataStore } from '@/store/dataStore'

export default function AdminDashboard() {
  const { users, listings, orders, businesses } = useDataStore()

  const pendingListings = listings.filter((l) => l.status === 'pending_review').length
  const pendingBusinesses = businesses.filter((b) => !b.is_verified).length
  const pendingOrders = orders.filter((o) => o.status === 'pending').length

  const stats = [
    { label: 'Total Users', value: String(users.length), icon: Users, color: 'bg-blue-50 text-blue-600', sub: '+67 this month' },
    { label: 'Active Listings', value: String(listings.length), icon: Package2, color: 'bg-green-50 text-green-600', sub: `${pendingListings} pending review` },
    { label: 'Total Orders', value: String(orders.length), icon: ClipboardList, color: 'bg-purple-50 text-purple-600', sub: 'All time' },
    { label: 'Platform Revenue', value: '₹40.1L', icon: TrendingUp, color: 'bg-yellow-50 text-yellow-600', sub: 'This year' },
  ]

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Platform overview, analytics, and moderation">
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
              <p className="text-xs text-blue-600 mt-1">{s.sub}</p>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-6 mb-6">
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Platform Growth</h3>
              <p className="text-xs text-slate-400">Users & Revenue Trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ADMIN_GROWTH_DATA}>
              <defs>
                <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="users" name="Total Users" stroke="#3b82f6" strokeWidth={2} fill="url(#usersGrad)" />
              <Area type="monotone" dataKey="sellers" name="Sellers" stroke="#22c55e" strokeWidth={1.5} fill="none" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card padding="lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Pending Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Listings pending review', count: pendingListings, href: '/admin/listings', color: 'text-yellow-600 bg-yellow-50' },
              { label: 'Business verifications', count: pendingBusinesses, href: '/admin/businesses', color: 'text-blue-600 bg-blue-50' },
              { label: 'Reports to resolve', count: 3, href: '/admin/reports', color: 'text-red-600 bg-red-50' },
              { label: 'Pending orders', count: pendingOrders, href: '/admin/orders', color: 'text-purple-600 bg-purple-50' },
            ].map((item) => (
              <Link key={item.label} to={item.href} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                <span className="text-sm text-slate-600 group-hover:text-slate-900">{item.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.color}`}>{item.count}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Order #</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Buyer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Date</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500">Amount</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-900">#{order.order_number}</td>
                  <td className="px-5 py-3 text-slate-600">{order.buyer?.full_name ?? 'Buyer'}</td>
                  <td className="px-5 py-3 text-slate-400">{formatDate(order.created_at)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-900">{formatCurrency(order.total_amount)}</td>
                  <td className="px-5 py-3 text-right"><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
