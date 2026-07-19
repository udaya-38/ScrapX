import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'
import { useDataStore } from '@/store/dataStore'
import { useAuthStore } from '@/store/authStore'

export default function SellerListings() {
  const { user } = useAuthStore()
  const { listings, toggleListingStatus, deleteListing } = useDataStore()
  const [filterStatus, setFilterStatus] = useState('')

  const sellerId = user?.id ?? 'demo-seller'
  const sellerListings = listings.filter((l) => l.seller_id === sellerId || l.seller_id === 'demo-seller')

  const filtered = sellerListings.filter((l) => !filterStatus || l.status === filterStatus)

  const handleToggleStatus = (id: string) => {
    toggleListingStatus(id)
    toast.success('Status updated', 'Listing status toggled successfully.')
  }

  const handleDelete = (id: string) => {
    deleteListing(id)
    toast.success('Listing deleted', 'The listing has been removed.')
  }

  return (
    <DashboardLayout
      title="My Listings"
      subtitle="Manage your scrap inventory listings"
      actions={
        <Link to="/seller/listings/create">
          <Button leftIcon={<Plus size={15} />}>New Listing</Button>
        </Link>
      }
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {['', 'approved', 'pending_review', 'paused', 'draft', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${filterStatus === status ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {status === '' ? `All (${sellerListings.length})` : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          type="listings"
          title="No listings found"
          description="Create your scrap listing to start selling on ScrapX."
          action={
            <Link to="/seller/listings/create">
              <Button leftIcon={<Plus size={15} />}>Create Listing</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map((listing) => (
            <Card key={listing.id} padding="none">
              <div className="flex gap-4 p-4">
                <div className="h-16 w-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  {listing.images?.[0]?.image_url ? (
                    <img src={listing.images[0].image_url} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">{listing.category?.icon}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{listing.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{listing.category?.name} · {listing.city}</p>
                    </div>
                    <StatusBadge status={listing.status} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-900">{formatCurrency(listing.price_per_unit)}/{listing.unit}</span>
                    <span>Stock: {listing.available_quantity} {listing.unit}</span>
                    <span>Views: {listing.view_count}</span>
                    <span>Added: {formatDate(listing.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link to={`/marketplace/${listing.id}`}>
                    <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Preview">
                      <Eye size={15} />
                    </button>
                  </Link>
                  {(listing.status === 'approved' || listing.status === 'paused') && (
                    <button
                      onClick={() => handleToggleStatus(listing.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      title={listing.status === 'approved' ? 'Pause' : 'Activate'}
                    >
                      {listing.status === 'approved' ? <EyeOff size={15} /> : <CheckCircle2 size={15} className="text-green-500" />}
                    </button>
                  )}
                  <Link to={`/seller/listings/edit/${listing.id}`}>
                    <button className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Edit">
                      <Edit2 size={15} />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
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
