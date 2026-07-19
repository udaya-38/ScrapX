import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card } from '@/components/ui/Card'
import { Link } from 'react-router-dom'
import { formatCurrency } from '@/lib/utils'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useDataStore } from '@/store/dataStore'
import { toast } from '@/components/ui/Toast'
import type { ScrapListing } from '@/types/database'

export default function Wishlist() {
  const { user } = useAuthStore()
  const { listings, wishlist, toggleWishlist } = useDataStore()
  const addToCart = useCartStore((s) => s.addItem)

  const wishlistedItems = listings.filter((l) => wishlist.includes(l.id))

  const moveToCart = (listing: ScrapListing) => {
    if (!user) { toast.error('Login required', 'Please log in to use the cart.'); return }
    addToCart({ id: `${listing.id}-wl-${Date.now()}`, buyer_id: user.id, listing_id: listing.id, quantity: listing.min_quantity, created_at: new Date().toISOString(), listing })
    toggleWishlist(listing.id)
    toast.success('Moved to cart!', listing.title)
  }

  return (
    <DashboardLayout title="Wishlist" subtitle={`${wishlistedItems.length} saved items`}>
      {wishlistedItems.length === 0 ? (
        <EmptyState
          icon={<Heart size={40} className="text-slate-300" />}
          title="Your wishlist is empty"
          description="Save items from the marketplace to your wishlist."
          action={<Link to="/marketplace" className="text-sm text-blue-600 hover:underline">Browse Marketplace</Link>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlistedItems.map((listing) => (
            <Card key={listing.id} padding="none">
              <div className="relative">
                <div className="h-40 bg-slate-100 overflow-hidden rounded-t-xl">
                  {listing.images?.[0]?.image_url ? (
                    <img src={listing.images[0].image_url} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">{listing.category?.icon}</div>
                  )}
                </div>
                <button
                  onClick={() => toggleWishlist(listing.id)}
                  className="absolute top-2 right-2 h-7 w-7 bg-white rounded-full shadow flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/marketplace/${listing.id}`}>
                  <h3 className="text-sm font-semibold text-slate-900 hover:text-blue-600 line-clamp-2 mb-1">{listing.title}</h3>
                </Link>
                <p className="text-xs text-slate-400 mb-3">{listing.city}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(listing.price_per_unit)}<span className="text-xs font-normal text-slate-400">/{listing.unit}</span></p>
                  <button
                    onClick={() => moveToCart(listing)}
                    className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ShoppingCart size={13} /> Add to cart
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
