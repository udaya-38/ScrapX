import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { ADMIN_GROWTH_DATA } from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'

export default function AdminReports() {
  return (
    <DashboardLayout title="Reports" subtitle="Platform analytics and growth metrics">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: '₹40.1L', sub: 'Platform lifetime' },
          { label: 'Active Sellers', value: '93', sub: '+14 this month' },
          { label: 'Active Buyers', value: '289', sub: '+48 this month' },
          { label: 'Listings Created', value: '234', sub: '+28 this month' },
        ].map((k) => (
          <Card key={k.label} padding="md">
            <p className="text-2xl font-bold text-slate-900 mb-0.5">{k.value}</p>
            <p className="text-xs font-medium text-slate-500">{k.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{k.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* User growth */}
        <Card padding="lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ADMIN_GROWTH_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Line type="monotone" dataKey="users" name="Total Users" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sellers" name="Sellers" stroke="#22c55e" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="buyers" name="Buyers" stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue */}
        <Card padding="lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Revenue (₹)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ADMIN_GROWTH_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* AI summary */}
      <Card padding="lg">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">✨ AI Platform Summary</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-600">
          {[
            'Platform is experiencing 234% YoY growth — strongest in the Ferrous Metals and E-Waste categories.',
            'Seller retention rate is 87% — above industry average. Consider seller loyalty programs to push it to 90%.',
            'Top-performing regions: Maharashtra (34%), Karnataka (22%), Delhi (18%). Expand marketing in Gujarat and Rajasthan.',
            'Average time from listing creation to first order: 4.2 days. AI suggests improving search discoverability.',
          ].map((insight, i) => (
            <div key={i} className="flex gap-2.5">
              <span className="text-blue-500 flex-shrink-0">✦</span>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  )
}
