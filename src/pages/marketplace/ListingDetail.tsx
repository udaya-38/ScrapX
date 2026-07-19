import { useParams, Link } from 'react-router-dom'
import { MapPin, Star, CheckCircle, Heart, ShoppingCart, Phone, Mail, Award, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useDataStore } from '@/store/dataStore'
import { toast } from '@/components/ui/Toast'

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const { listings, wishlist, toggleWishlist } = useDataStore()
  const addToCart = useCartStore((s) => s.addItem)
  const [selectedImg, setSelectedImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  const listing = listings.find((l) => l.id === id)
  const isWishlisted = listing ? wishlist.includes(listing.id) : false

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-2xl font-bold text-slate-900 mb-2">Listing not found</p>
          <Link to="/marketplace" className="text-blue-600 hover:underline">Browse marketplace</Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Login required', 'Please log in to add items to cart.')
      return
    }
    setAddingToCart(true)
    setTimeout(() => {
      addToCart({
        id: `${listing.id}-${Date.now()}`,
        buyer_id: user.id,
        listing_id: listing.id,
        quantity: qty,
        created_at: new Date().toISOString(),
        listing,
      })
      toast.success('Added to cart!', `${listing.title} added to your cart.`)
      setAddingToCart(false)
    }, 300)
  }

  const handleToggleWishlist = () => {
    toggleWishlist(listing.id)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist', listing.title)
  }

  const images = listing.images ?? []
  const totalPrice = listing.price_per_unit * qty

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-slate-600">Home</Link>
          <ChevronRight size={12} />
          <Link to="/marketplace" className="hover:text-slate-600">Marketplace</Link>
          <ChevronRight size={12} />
          <span className="text-slate-600 truncate max-w-[200px]">{listing.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr,380px] gap-8">
          <div>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-6">
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                {images[selectedImg] ? (
                  <img src={images[selectedImg].image_url} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">{listing.category?.icon}</div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImg(i)}
                      className={`h-16 w-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${i === selectedImg ? 'border-blue-500' : 'border-transparent'}`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Card padding="lg">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {listing.category?.icon} {listing.category?.name}
                    </span>
                    {listing.business?.is_verified && (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle size={12} /> Verified Seller
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 mb-1">{listing.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={13} /> {listing.city}, {listing.state}</span>
                    {listing.avg_rating && (
                      <span className="flex items-center gap-1">
                        <Star size={13} className="text-yellow-400 fill-yellow-400" />
                        {listing.avg_rating.toFixed(1)} ({listing.review_count} reviews)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl mb-6">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Condition</p>
                  <p className="text-sm font-semibold text-slate-900 capitalize">{listing.condition}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Available</p>
                  <p className="text-sm font-semibold text-slate-900">{listing.available_quantity} {listing.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Min. Order</p>
                  <p className="text-sm font-semibold text-slate-900">{listing.min_quantity} {listing.unit}</p>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{listing.description}</p>

              <p className="text-xs text-slate-400 mt-4">Listed on {formatDate(listing.created_at)}</p>
            </Card>
          </div>

          <div className="space-y-4">
            <Card padding="lg">
              <div className="mb-4">
                <p className="text-xs text-slate-400 mb-1">Price per {listing.unit}</p>
                <p className="text-3xl font-bold text-slate-900">{formatCurrency(listing.price_per_unit)}</p>
              </div>

              <div className="mb-5">
                <label className="text-xs font-medium text-slate-600 block mb-1.5">Quantity ({listing.unit})</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty(Math.max(listing.min_quantity, qty - 1))}
                    className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-lg hover:bg-slate-50 transition-colors"
                  >—</button>
                  <input
                    type="number"
                    value={qty}
                    min={listing.min_quantity}
                    max={listing.available_quantity}
                    onChange={(e) => setQty(Math.max(listing.min_quantity, Math.min(listing.available_quantity, Number(e.target.value))))}
                    className="flex-1 text-center border border-slate-200 rounded-lg py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setQty(Math.min(listing.available_quantity, qty + 1))}
                    className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-lg hover:bg-slate-50 transition-colors"
                  >+</button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Total Estimate</span>
                  <span className="text-xl font-bold text-blue-700">{formatCurrency(totalPrice)}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">+ Applicable taxes & shipping</p>
              </div>

              <div className="space-y-2.5">
                <Button className="w-full" onClick={handleAddToCart} loading={addingToCart} leftIcon={<ShoppingCart size={15} />}>
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-full" onClick={handleToggleWishlist} leftIcon={<Heart size={15} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />}>
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </Button>
              </div>
            </Card>

            {listing.business && (
              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={listing.business.company_name} size="lg" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-slate-900">{listing.business.company_name}</p>
                      {listing.business.is_verified && (
                        <CheckCircle size={14} className="text-green-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{listing.business.city}, {listing.business.state}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-slate-400" />
                    <span>{listing.business.years_of_experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <span>{listing.business.contact_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span>{listing.business.email}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
