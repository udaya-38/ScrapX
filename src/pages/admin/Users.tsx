import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Search, UserX, UserCheck } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useDataStore } from '@/store/dataStore'
import { toast } from '@/components/ui/Toast'

export default function AdminUsers() {
  const { users, toggleUserStatus } = useDataStore()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const handleToggleStatus = (id: string, name: string, active: boolean) => {
    toggleUserStatus(id)
    toast.success(active ? 'User Suspended' : 'User Activated', `${name}'s account status has been updated.`)
  }

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = !roleFilter || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <DashboardLayout title="Users" subtitle="Manage all platform users and permissions">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {['', 'buyer', 'seller', 'admin'].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${roleFilter === role ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {role === '' ? 'All Users' : role.charAt(0).toUpperCase() + role.slice(1) + 's'}
          </button>
        ))}
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">User</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Role</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.full_name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900">{user.full_name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={user.role} />
                  </td>
                  <td className="px-5 py-3 text-slate-400">{formatDate(user.created_at)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={user.is_active ? 'active' : 'suspended'} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      size="xs"
                      variant={user.is_active ? 'danger' : 'success'}
                      leftIcon={user.is_active ? <UserX size={12} /> : <UserCheck size={12} />}
                      onClick={() => handleToggleStatus(user.id, user.full_name, user.is_active)}
                    >
                      {user.is_active ? 'Suspend' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
