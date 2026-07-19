import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { User, Mail, Phone, MapPin } from 'lucide-react'
import { toast } from '@/components/ui/Toast'

export default function BuyerProfile() {
  const { user, updateProfile } = useAuthStore()
  const [fullName, setFullName] = useState(user?.full_name ?? 'Industrial Buyer')
  const [phone, setPhone] = useState(user?.phone ?? '+91 9123456789')
  const [email, setEmail] = useState(user?.email ?? 'buyer@scrapx.com')
  const [address, setAddress] = useState('45, MG Road, Industrial Area, Bangalore')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ full_name: fullName, phone, email })
    toast.success('Profile Saved!', 'Your account information has been updated.')
  }

  return (
    <DashboardLayout title="My Profile" subtitle="Manage your account details and buyer preferences">
      <form onSubmit={handleSave} className="max-w-2xl grid gap-5">
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={fullName} size="xl" />
            <div>
              <h3 className="text-base font-semibold text-slate-900">{fullName}</h3>
              <p className="text-sm text-slate-500">{email}</p>
              <span className="inline-flex mt-1 text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">Buyer Account</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} leftIcon={<User size={14} />} />
            <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail size={14} />} />
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} leftIcon={<Phone size={14} />} />
            <Input label="Username" defaultValue={user?.username ?? 'industrial_buyer01'} leftIcon={<User size={14} />} readOnly />
          </div>
          <div className="mt-4">
            <Input label="Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} leftIcon={<MapPin size={14} />} />
          </div>
          <div className="mt-5 flex gap-3">
            <Button type="submit">Save Changes</Button>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Preferred Categories</h3>
          <div className="flex flex-wrap gap-2">
            {['Ferrous Metals', 'Non-Ferrous Metals', 'Plastics', 'E-Waste'].map((cat) => (
              <span key={cat} className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium cursor-pointer hover:bg-blue-100 transition-colors">
                {cat}
              </span>
            ))}
          </div>
        </Card>
      </form>
    </DashboardLayout>
  )
}
