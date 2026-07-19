import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'
import type { OrderStatus } from '@/types/database'
import { CheckCircle, X, Package, Truck } from 'lucide-react'
import { useDataStore } from '@/store/dataStore'
import { useAuthStore } from '@/store/authStore'

const STATUS_FLOW: Record<string, { next: OrderStatus; label: string; icon: React.ReactNode; color: string }> = {
  pending: { next: 'accepted', label: 'Accept Order', icon: <CheckCircle size={13} />, color: 'primary' },
  accepted: { next: 'packed', label: 'Mark Packed', icon: <Package size={13} />, color: 'primary' },
  packed: { next: 'shipped', label: 'Mark Shipped', icon: <Truck size={13} />, color: 'primary' },
  shipped: { next: 'delivered', label: 'Mark Delivered', icon: <CheckCircle size={13} />, color: 'success' },
}

export default function SellerOrders() {
  const { user } = useAuthStore()
  const { orders, updateOrderStatus } = useDataStore()
  const [filterStatus, setFilterStatus] = useState('')

  const sellerId = user?.id ?? 'demo-seller'
  const sellerOrders = orders.filter((o) => o.seller_id === sellerId || o.seller_id === 'demo-seller')

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status)
    toast.success('Order status updated', `Order status set to ${status}.`)
  }

  const filtered = sellerOrders.filter((o) => !filterStatus || o.status === filterStatus)

  return (
    <DashboardLayout title="Orders" subtitle="Manage customer scrap purchase orders">
      <div className="flex flex-wrap gap-2 mb-5">
        {['', 'pending', 'accepted', 'packed', 'shipped', 'delivered', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {s === '' ? `All (${sellerOrders.length})` : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState type="orders" title="No orders" description="No orders match this filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const nextAction = STATUS_FLOW[order.status]
            return (
              <Card key={order.id} padding="lg">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Order #{order.order_number}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Placed: {formatDate(order.created_at)}</p>
                    {order.buyer && (
                      <p className="text-xs text-slate-500 mt-0.5">Buyer: {order.buyer.full_name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-900 mb-1.5">{formatCurrency(order.total_amount)}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-3">Payment: {order.payment_method.replace(/_/g, ' ')} · Address: {order.shipping_address}</p>

                {(order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'rejected') && (
                  <div className="flex gap-2 pt-3 border-t border-slate-50">
                    {nextAction && (
                      <Button
                        size="sm"
                        variant={nextAction.color as 'primary' | 'success'}
                        leftIcon={nextAction.icon}
                        onClick={() => handleUpdateStatus(order.id, nextAction.next)}
                      >
                        {nextAction.label}
                      </Button>
                    )}
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="danger"
                        leftIcon={<X size={13} />}
                        onClick={() => handleUpdateStatus(order.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
