import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'
import type { OrderStatus } from '@/types/database'
import { useDataStore } from '@/store/dataStore'

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useDataStore()
  const [filterStatus, setFilterStatus] = useState('')

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status)
    toast.success('Order Updated', `Order status set to ${status}`)
  }

  const filtered = orders.filter((o) => !filterStatus || o.status === filterStatus)

  return (
    <DashboardLayout title="All Orders" subtitle="View and manage platform purchase orders">
      <div className="flex flex-wrap gap-2 mb-5">
        {['', 'pending', 'accepted', 'packed', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {s === '' ? `All (${orders.length})` : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Order #</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Buyer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Payment</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500">Total</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-900">#{order.order_number}</td>
                  <td className="px-5 py-3 text-slate-600">{order.buyer?.full_name ?? 'Buyer'}</td>
                  <td className="px-5 py-3 text-slate-400">{formatDate(order.created_at)}</td>
                  <td className="px-5 py-3 text-slate-500 capitalize">{order.payment_method.replace(/_/g, ' ')}</td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-900">{formatCurrency(order.total_amount)}</td>
                  <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3 text-right">
                    {order.status === 'pending' && (
                      <div className="flex justify-end gap-1.5">
                        <Button size="xs" variant="success" onClick={() => handleUpdateStatus(order.id, 'accepted')}>Accept</Button>
                        <Button size="xs" variant="danger" onClick={() => handleUpdateStatus(order.id, 'cancelled')}>Cancel</Button>
                      </div>
                    )}
                    {order.status === 'accepted' && (
                      <Button size="xs" variant="primary" onClick={() => handleUpdateStatus(order.id, 'shipped')}>Ship</Button>
                    )}
                    {order.status === 'shipped' && (
                      <Button size="xs" variant="success" onClick={() => handleUpdateStatus(order.id, 'delivered')}>Deliver</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
