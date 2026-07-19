import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Package } from 'lucide-react'
import { useState } from 'react'
import { ORDER_STATUSES } from '@/constants'
import { useDataStore } from '@/store/dataStore'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/components/ui/Toast'

export default function BuyerOrders() {
  const { user } = useAuthStore()
  const { orders, updateOrderStatus } = useDataStore()
  const [filterStatus, setFilterStatus] = useState('')

  const buyerOrders = orders.filter((o) => !user || o.buyer_id === user.id || o.buyer_id === 'demo-buyer')
  const filtered = buyerOrders.filter((o) => !filterStatus || o.status === filterStatus)

  const handleCancelOrder = (id: string) => {
    updateOrderStatus(id, 'cancelled')
    toast.success('Order Cancelled', 'Your order has been cancelled.')
  }

  return (
    <DashboardLayout title="My Orders" subtitle="Track and manage your purchase orders">
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setFilterStatus('')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!filterStatus ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          All Orders ({buyerOrders.length})
        </button>
        {ORDER_STATUSES.slice(0, 5).map((s) => (
          <button
            key={s.value}
            onClick={() => setFilterStatus(s.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === s.value ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState type="orders" title="No orders found" description="You haven't placed any orders matching this filter." action={<Button variant="outline">Browse Marketplace</Button>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Card key={order.id} padding="none" hover>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Package size={14} className="text-slate-400" />
                      <span className="text-sm font-semibold text-slate-900">Order #{order.order_number}</span>
                    </div>
                    <p className="text-xs text-slate-400">Placed on {formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900 mb-1">{formatCurrency(order.total_amount)}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Order progress */}
                <div className="flex items-center gap-1 mb-4">
                  {['pending', 'accepted', 'packed', 'shipped', 'delivered'].map((step, i, arr) => {
                    const statusIndex = arr.indexOf(order.status)
                    const isCompleted = i <= statusIndex
                    const isCurrent = i === statusIndex
                    return (
                      <div key={step} className="flex items-center flex-1">
                        <div className={`h-2 w-2 rounded-full flex-shrink-0 ${isCompleted ? 'bg-blue-600' : 'bg-slate-200'} ${isCurrent ? 'ring-2 ring-blue-200' : ''}`} />
                        {i < arr.length - 1 && <div className={`flex-1 h-0.5 ${i < statusIndex ? 'bg-blue-600' : 'bg-slate-200'}`} />}
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Payment: {order.payment_method.replace(/_/g, ' ')}</span>
                  {order.status === 'pending' && (
                    <Button variant="danger" size="xs" onClick={() => handleCancelOrder(order.id)}>Cancel Order</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
