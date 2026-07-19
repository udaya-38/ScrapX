import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { CheckCircle, X } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { useDataStore } from '@/store/dataStore'

export default function AdminBusinesses() {
  const { businesses, toggleBusinessVerification } = useDataStore()
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all')

  const handleVerify = (id: string, name: string, verified: boolean) => {
    toggleBusinessVerification(id, verified)
    toast.success(verified ? 'Business Verified!' : 'Verification Revoked', `${name} status updated.`)
  }

  const filtered = businesses.filter((b) =>
    filterVerified === 'all' ? true : filterVerified === 'verified' ? b.is_verified : !b.is_verified
  )

  return (
    <DashboardLayout title="Businesses" subtitle="Verify and manage seller business profiles">
      <div className="flex gap-2 mb-5">
        {(['all', 'verified', 'unverified'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilterVerified(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${filterVerified === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {f} ({businesses.filter((b) => f === 'all' ? true : f === 'verified' ? b.is_verified : !b.is_verified).length})
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((biz) => (
          <Card key={biz.id} padding="lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={biz.company_name} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{biz.company_name}</p>
                    {biz.is_verified && <CheckCircle size={14} className="text-green-500" />}
                  </div>
                  <p className="text-xs text-slate-400">{biz.owner_name} · {biz.city}, {biz.state}</p>
                  <p className="text-xs text-slate-400">{biz.email} · {biz.years_of_experience}y exp</p>
                  {biz.gst_number && <p className="text-xs text-slate-400 mt-0.5 font-mono">GST: {biz.gst_number}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                {!biz.is_verified ? (
                  <>
                    <Button
                      size="sm"
                      variant="success"
                      leftIcon={<CheckCircle size={13} />}
                      onClick={() => handleVerify(biz.id, biz.company_name, true)}
                    >
                      Verify
                    </Button>
                    <Button size="sm" variant="danger" leftIcon={<X size={13} />} onClick={() => toast.info('Verification Rejected', `${biz.company_name} was rejected.`)}>
                      Reject
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" leftIcon={<X size={13} />} onClick={() => handleVerify(biz.id, biz.company_name, false)}>
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
