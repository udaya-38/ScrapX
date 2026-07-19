import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useCartStore } from '@/store/cartStore'
import { EmptyState } from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Cart() {
  const { items, removeItem, updateQuantity, totalAmount, totalItems, clearCart } = useCartStore()
  const navigate = useNavigate()
  const tax = totalAmount() * 0.18
  const grandTotal = totalAmount() + tax

  return (
    <DashboardLayout title="Shopping Cart" subtitle={`${totalItems()} items in your cart`}>
      {items.length === 0 ? (
        <EmptyState
          type="orders"
          title="Your cart is empty"
          description="Browse the marketplace and add items to your cart."
          action={
            <Link to="/marketplace">
              <Button leftIcon={<ShoppingBag size={15} />}>Browse Marketplace</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid lg:grid-cols-[1fr,320px] gap-6">
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} padding="md">
                <div className="flex gap-4">
                  <div className="h-16 w-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    {item.listing?.images?.[0]?.image_url ? (
                      <img src={item.listing.images[0].image_url} alt={item.listing.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate mb-0.5">
                      {item.listing?.title ?? 'Unknown Listing'}
                    </p>
                    <p className="text-xs text-slate-400 mb-2">
                      {formatCurrency(item.listing?.price_per_unit ?? 0)} / {item.listing?.unit}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="h-7 w-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-7 w-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-900 mb-2">
                      {formatCurrency((item.listing?.price_per_unit ?? 0) * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
            <button onClick={clearCart} className="text-xs text-red-500 hover:text-red-700 mt-2">
              Clear cart
            </button>
          </div>

          <div>
            <Card padding="lg">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Order Summary</h3>
              <div className="space-y-2.5 text-sm mb-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItems()} items)</span>
                  <span>{formatCurrency(totalAmount())}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>Shipping</span>
                  <span>Negotiated</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-base border-t border-slate-100 pt-2.5 mt-2.5">
                  <span>Estimated Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => navigate('/buyer/checkout')}>
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
