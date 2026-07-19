import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { AlertTriangle } from 'lucide-react'
import { useDataStore } from '@/store/dataStore'
import { useAuthStore } from '@/store/authStore'

export default function Inventory() {
  const { user } = useAuthStore()
  const { listings } = useDataStore()

  const sellerId = user?.id ?? 'demo-seller'
  const sellerListings = listings.filter((l) => l.seller_id === sellerId || l.seller_id === 'demo-seller')

  return (
    <DashboardLayout title="Inventory" subtitle="Monitor stock levels across all listings">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Available', value: `${sellerListings.reduce((s, l) => s + l.available_quantity, 0)} MT`, color: 'text-green-600 bg-green-50' },
          { label: 'Reserved', value: '12 MT', color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Sold (All Time)', value: '248 MT', color: 'text-blue-600 bg-blue-50' },
        ].map((item) => (
          <Card key={item.label} padding="md">
            <p className={`text-2xl font-bold mb-0.5 ${item.color.split(' ')[0]}`}>{item.value}</p>
            <p className="text-xs text-slate-400">{item.label}</p>
          </Card>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3 mb-5">
        <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-yellow-800">Low Stock Alert — AI Suggestion</p>
          <p className="text-sm text-yellow-700 mt-0.5">
            "Copper Wire Scrap - Millberry Grade" has only <strong>5 MT</strong> remaining. Based on current market demand trends, 
            consider restocking within the next 7 days to prevent stockouts.
          </p>
        </div>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Stock Levels</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Listing</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Available</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Reserved</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Sold</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sellerListings.map((listing) => {
                const isLow = listing.available_quantity < 10
                return (
                  <tr key={listing.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 text-sm truncate max-w-xs">{listing.title}</p>
                      <p className="text-xs text-slate-400">{listing.category?.name}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${isLow ? 'text-red-600' : 'text-slate-900'}`}>
                        {listing.available_quantity} {listing.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">0 {listing.unit}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{Math.floor(Math.random() * 50 + 5)} {listing.unit}</td>
                    <td className="px-4 py-3 text-right">
                      {isLow ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">Low Stock</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">In Stock</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
