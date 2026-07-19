import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { SELLER_REVENUE_DATA, CATEGORY_BREAKDOWN } from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'

const orderData = SELLER_REVENUE_DATA.map((d) => ({ ...d, cancelled: Math.floor(d.orders * 0.05) }))

export default function Analytics() {
  return (
    <DashboardLayout title="Analytics" subtitle="Performance insights for your business">
      {/* KPI summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: '₹19.9L', sub: 'Lifetime' },
          { label: 'Orders Delivered', value: '113', sub: 'Lifetime' },
          { label: 'Avg Order Value', value: '₹74,200', sub: 'This year' },
          { label: 'Repeat Buyers', value: '34%', sub: 'Of all buyers' },
        ].map((k) => (
          <Card key={k.label} padding="md">
            <p className="text-2xl font-bold text-slate-900 mb-0.5">{k.value}</p>
            <p className="text-xs font-medium text-slate-400">{k.label}</p>
            <p className="text-xs text-slate-300 mt-0.5">{k.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue area chart */}
        <Card padding="lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Revenue (₹)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SELLER_REVENUE_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Orders bar chart */}
        <Card padding="lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="orders" name="Delivered" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" name="Cancelled" fill="#fca5a5" radius={[4, 4, 0, 0]} />
              <Legend iconType="circle" iconSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Category breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Revenue by Category</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={CATEGORY_BREAKDOWN} innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={2}>
                  {CATEGORY_BREAKDOWN.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {CATEGORY_BREAKDOWN.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
                    <span className="text-slate-600">{cat.name}</span>
                  </div>
                  <span className="font-medium text-slate-900">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">AI Insights ✨</h3>
          <div className="space-y-3">
            {[
              { icon: '📈', text: 'Revenue grew 52% from Jan to Jul — excellent growth trajectory.' },
              { icon: '⚡', text: 'Aluminum and Copper listings have 3x higher engagement than average.' },
              { icon: '🎯', text: 'Best performing month: July (₹4.2L). Consider running promotions in slow months.' },
              { icon: '💡', text: 'Adding more photos to your listings could increase click-through rate by ~40%.' },
            ].map((insight, i) => (
              <div key={i} className="flex gap-2.5 text-sm">
                <span className="flex-shrink-0">{insight.icon}</span>
                <span className="text-slate-600">{insight.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
