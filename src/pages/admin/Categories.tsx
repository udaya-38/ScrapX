import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { useDataStore } from '@/store/dataStore'

export default function AdminCategories() {
  const { categories, addCategory, toggleCategoryStatus, deleteCategory } = useDataStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('📦')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    addCategory({
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      icon: newCatIcon,
      color: '#3b82f6',
      is_active: true,
      listing_count: 0,
    })
    toast.success('Category Added!', `Category "${newCatName}" was created.`)
    setNewCatName('')
    setModalOpen(false)
  }

  return (
    <DashboardLayout
      title="Categories"
      subtitle="Manage scrap material categories and taxonomy"
      actions={<Button leftIcon={<Plus size={15} />} onClick={() => setModalOpen(true)}>Add Category</Button>}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} padding="md">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-2xl bg-blue-50">
                {cat.icon}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete category"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-0.5">{cat.name}</h3>
            <p className="text-xs text-slate-400 mb-3">{cat.listing_count ?? 0} listings</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.is_active ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                {cat.is_active ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => toggleCategoryStatus(cat.id)}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                {cat.is_active ? 'Disable' : 'Enable'}
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Category">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Rare Earth Metals"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            required
          />
          <Input
            label="Emoji Icon"
            placeholder="e.g. 💎"
            value={newCatIcon}
            onChange={(e) => setNewCatIcon(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Category</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
