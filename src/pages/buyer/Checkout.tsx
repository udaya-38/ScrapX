import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useDataStore } from '@/store/dataStore'
import { formatCurrency } from '@/lib/utils'
import { PAYMENT_METHODS } from '@/constants'
import { toast } from '@/components/ui/Toast'
import { CheckCircle, MapPin } from 'lucide-react'

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const { addOrder } = useDataStore()
  const navigate = useNavigate()
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'bank_transfer' | 'cash_on_delivery'>('bank_transfer')
  const [address, setAddress] = useState('45, MG Road, Industrial Area, Bangalore - 560001')
  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(false)

  const tax = totalAmount() * 0.18
  const grand = totalAmount() + tax

  const placeOrder = async () => {
    if (!address.trim()) { toast.error('Address required', 'Please enter a shipping address.'); return }
    setPlacing(true)
    await new Promise((r) => setTimeout(r, 800))

    const firstSeller = items[0]?.listing?.seller_id ?? 'demo-seller'

    addOrder({
      buyer_id: user?.id ?? 'demo-buyer',
      seller_id: firstSeller,
      status: 'pending',
      payment_method: selectedPayment,
      subtotal: totalAmount(),
      tax_amount: tax,
      total_amount: grand,
      shipping_address: address,
      buyer: user ?? undefined,
    })

    clearCart()
    setPlaced(true)
    setPlacing(false)
    toast.success('Order placed successfully!', 'Your purchase order has been generated.')
  }

  if (placed) {
    return (
      <DashboardLayout title="Order Placed!" subtitle="Your order has been submitted">
        <div className="max-w-md mx-auto text-center py-16">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Order Confirmed! 🎉</h2>
          <p className="text-slate-500 text-sm mb-6">Your order has been placed with <strong>Pending</strong> status. The seller will review and accept it shortly.</p>
          <Button onClick={() => navigate('/buyer/orders')}>View My Orders</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Checkout" subtitle="Review your order and choose payment summary option">
      <div className="grid lg:grid-cols-[1fr,340px] gap-6 max-w-5xl">
        <div className="space-y-5">
          <Card padding="lg">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin size={15} className="text-slate-400" /> Shipping Address
            </h3>
            <textarea
              placeholder="Enter full delivery address including city, state, pincode..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </Card>

          <Card padding="lg">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Payment Summary Option</h3>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <label key={method.value} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${selectedPayment === method.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={selectedPayment === method.value}
                    onChange={() => setSelectedPayment(method.value as any)}
                    className="text-blue-600"
                  />
                  <span className="text-xl">{method.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{method.label}</p>
                    <p className="text-xs text-slate-400">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Items ({items.length})</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <span className="flex-1 text-slate-700 truncate">{item.listing?.title}</span>
                  <span className="text-slate-500">{item.quantity} {item.listing?.unit}</span>
                  <span className="font-medium text-slate-900">{formatCurrency((item.listing?.price_per_unit ?? 0) * item.quantity)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card padding="lg" className="sticky top-20">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Payment Summary</h3>
            <div className="space-y-2.5 text-sm mb-5">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{formatCurrency(totalAmount())}</span></div>
              <div className="flex justify-between text-slate-600"><span>GST (18%)</span><span>{formatCurrency(tax)}</span></div>
              <div className="flex justify-between text-slate-400 text-xs"><span>Shipping</span><span>As per agreement</span></div>
              <div className="flex justify-between font-bold text-slate-900 text-base border-t border-slate-100 pt-3 mt-1">
                <span>Total</span><span>{formatCurrency(grand)}</span>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4 text-xs text-amber-700">
              ⚠️ This is a payment summary only. No external gateway is required.
            </div>
            <Button className="w-full" loading={placing} onClick={placeOrder}>
              Place Order — {formatCurrency(grand)}
            </Button>
            <p className="text-xs text-slate-400 text-center mt-3">Order status will be set to <strong>Pending</strong></p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
