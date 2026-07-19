import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { useDataStore } from '@/store/dataStore'
import { Building2, CheckCircle, Phone, Mail, MapPin } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import Select from '@/components/ui/Select'
import { INDIAN_STATES } from '@/constants'

export default function SellerProfile() {
  const { user, updateProfile } = useAuthStore()
  const { businesses, updateBusinessProfile } = useDataStore()
  const [saving, setSaving] = useState(false)

  const biz = businesses.find((b) => b.seller_id === user?.id) ?? businesses[0]

  const [companyName, setCompanyName] = useState(biz?.company_name ?? 'ABC Metal Recyclers')
  const [ownerName, setOwnerName] = useState(biz?.owner_name ?? user?.full_name ?? 'Rajesh Sharma')
  const [phone, setPhone] = useState(biz?.contact_number ?? user?.phone ?? '+91-9876543210')
  const [email, setEmail] = useState(biz?.email ?? user?.email ?? 'seller@scrapx.com')
  const [address, setAddress] = useState(biz?.address ?? '123, MIDC Industrial Area, Andheri East')
  const [city, setCity] = useState(biz?.city ?? 'Mumbai')
  const [state, setState] = useState(biz?.state ?? 'Maharashtra')
  const [desc, setDesc] = useState(biz?.description ?? 'Leading scrap metal trading company based in Mumbai.')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 400))

    if (user) {
      updateProfile({ full_name: ownerName, phone, email })
    }
    if (biz) {
      updateBusinessProfile(biz.id, {
        company_name: companyName,
        owner_name: ownerName,
        contact_number: phone,
        email,
        address,
        city,
        state,
        description: desc,
      })
    }

    toast.success('Profile Saved!', 'Your seller business profile has been updated.')
    setSaving(false)
  }

  return (
    <DashboardLayout title="Business Profile" subtitle="Manage your seller profile and business information">
      <form onSubmit={handleSave} className="max-w-3xl space-y-5">
        <Card padding="none">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl relative">
            <div className="absolute bottom-0 left-6 translate-y-1/2">
              <div className="h-16 w-16 rounded-xl bg-white border-2 border-white shadow-lg flex items-center justify-center">
                <Building2 size={28} className="text-blue-600" />
              </div>
            </div>
          </div>
          <div className="pt-12 pb-4 px-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{companyName}</h3>
                {biz?.is_verified && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                    <CheckCircle size={10} /> Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400">{city}, {state} · {biz?.years_of_experience ?? 12} years experience</p>
            </div>
            <Button variant="outline" size="sm" type="button" onClick={() => toast.info('Photo upload', 'Cover banner updated.')}>Change Cover</Button>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Business Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Company Name *" value={companyName} onChange={(e) => setCompanyName(e.target.value)} leftIcon={<Building2 size={14} />} />
            <Input label="Owner Name *" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
            <Input label="Contact Number *" value={phone} onChange={(e) => setPhone(e.target.value)} leftIcon={<Phone size={14} />} />
            <Input label="Business Email *" value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail size={14} />} />
            <Input label="GST Number" defaultValue={biz?.gst_number ?? 'GST27ABCDE1234F1Z5'} readOnly />
            <Input label="Registration Number" defaultValue={biz?.registration_number ?? 'REG-MH-2012-0941'} readOnly />
          </div>
          <div className="mt-4">
            <Textarea label="Business Description" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Business Address</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="Street Address *" value={address} onChange={(e) => setAddress(e.target.value)} leftIcon={<MapPin size={14} />} />
            </div>
            <Input label="City *" value={city} onChange={(e) => setCity(e.target.value)} />
            <Select label="State *" options={INDIAN_STATES.map((s) => ({ value: s, label: s }))} value={state} onChange={(e) => setState(e.target.value)} />
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" loading={saving}>Save Profile</Button>
          <Button variant="outline" type="button" onClick={() => toast.success('Verification Request Sent', 'Submitted for review.')}>Request Verification</Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
