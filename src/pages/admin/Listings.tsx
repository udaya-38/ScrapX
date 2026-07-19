import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { CheckCircle, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'
import type { ListingStatus } from '@/types/database'
import { useDataStore } from '@/store/dataStore'

export default function AdminListings() {
  const { listings, toggleListingStatus } = useDataStore()
  const [filterStatus, setFilterStatus] = useState('pending_review')

  const handleUpdateStatus = (id: string, status: ListingStatus) => {
    toggleListingStatus(id, status)
    toast.success(`Listing ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'}!`, '')
  }

  const filtered = listings.filter((l) => !filterStatus || l.status === filterStatus)

  return (
    <DashboardLayout title="Listings" subtitle="Review and approve scrap listings">
      <div className="flex flex-wrap gap-2 mb-5">
        {['pending_review', 'approved', 'rejected', 'paused', ''].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {s === '' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            {' '}({listings.filter((l) => !s || l.status === s).length})
          </button>
        ))}
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Listing</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Seller</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500">Price</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((listing) => (
                <tr key={listing.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        {listing.images?.[0]?.image_url ? (
                          <img src={listing.images[0].image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">{listing.category?.icon}</div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm max-w-xs truncate">{listing.title}</p>
                        <p className="text-xs text-slate-400">{listing.category?.name} · {listing.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 text-xs">{listing.business?.company_name ?? '—'}</td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-900">
                    {formatCurrency(listing.price_per_unit)}/{listing.unit}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={listing.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {listing.status === 'pending_review' && (
                        <>
                          <Button size="xs" variant="success" leftIcon={<CheckCircle size={11} />} onClick={() => handleUpdateStatus(listing.id, 'approved')}>Approve</Button>
                          <Button size="xs" variant="danger" leftIcon={<X size={11} />} onClick={() => handleUpdateStatus(listing.id, 'rejected')}>Reject</Button>
                        </>
                      )}
                      {listing.status === 'approved' && (
                        <Button size="xs" variant="outline" onClick={() => handleUpdateStatus(listing.id, 'paused')}>Pause</Button>
                      )}
                      {listing.status === 'paused' && (
                        <Button size="xs" variant="success" onClick={() => handleUpdateStatus(listing.id, 'approved')}>Restore</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-10">No listings with this status.</p>
          )}
        </div>
      </Card>
    </DashboardLayout>
  )
}
