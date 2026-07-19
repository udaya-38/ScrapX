import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ImagePlus, Sparkles, X } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { UNITS, CONDITIONS, INDIAN_STATES } from '@/constants'
import { useDataStore } from '@/store/dataStore'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Please provide a detailed description'),
  category_id: z.string().min(1, 'Select a category'),
  price_per_unit: z.coerce.number().positive('Enter a valid price'),
  unit: z.string().min(1, 'Select a unit'),
  available_quantity: z.coerce.number().positive('Enter available quantity'),
  min_quantity: z.coerce.number().positive('Enter minimum quantity'),
  condition: z.enum(['new', 'good', 'fair', 'scrap']),
  city: z.string().min(2, 'Enter city'),
  state: z.string().min(1, 'Select state'),
})

type FormData = z.infer<typeof schema>

const AI_DESCRIPTIONS: Record<string, string> = {
  '1': 'Premium quality ferrous metal scrap available in bulk. Material is thoroughly sorted, cleaned, and free from non-metallic contaminants. Suitable for steel mills, foundries, and metal recycling facilities. Certificate of composition available on request.',
  '2': 'High-grade non-ferrous metal scrap with excellent purity. Carefully processed and sorted by grade. Ideal for smelters and secondary metal producers. Regular supply available.',
  '3': 'Clean plastic scrap suitable for recycling. Material has been sorted by type and cleaned. Low moisture content. Excellent for pelletizing and regranulation.',
}

export default function CreateListing() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { categories, businesses, addListing } = useDataStore()
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<string[]>([
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { condition: 'scrap', unit: 'MT', state: 'Maharashtra', city: 'Mumbai' },
  })

  const selectedCategory = watch('category_id')

  const generateDescription = async () => {
    setAiLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    const desc = AI_DESCRIPTIONS[selectedCategory] ?? 'Quality scrap material available in bulk. Well-sorted and clean, ready for recycling or industrial processing. Contact us for bulk volume discounts.'
    setValue('description', desc)
    setAiLoading(false)
    toast.success('AI Description Generated!', 'Product description has been auto-crafted.')
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))

    const catObj = categories.find((c) => c.id === data.category_id)
    const bizObj = businesses.find((b) => b.seller_id === (user?.id ?? 'demo-seller')) ?? businesses[0]

    addListing({
      seller_id: user?.id ?? 'demo-seller',
      category_id: data.category_id,
      title: data.title,
      description: data.description,
      price_per_unit: Number(data.price_per_unit),
      unit: data.unit,
      min_quantity: Number(data.min_quantity),
      available_quantity: Number(data.available_quantity),
      condition: data.condition,
      location: `${data.city}, ${data.state}`,
      city: data.city,
      state: data.state,
      status: 'approved', // Auto-approved in demo for instant testing!
      is_featured: false,
      view_count: 0,
      category: catObj,
      business: bizObj,
      images: imagePreviews.map((url, i) => ({
        id: `img-${Date.now()}-${i}`,
        listing_id: '',
        image_url: url,
        is_primary: i === 0,
        sort_order: i,
        created_at: new Date().toISOString(),
      })),
      avg_rating: 5.0,
      review_count: 1,
    })

    toast.success('Listing Published!', 'Your listing is now live on the marketplace.')
    navigate('/seller/listings')
    setLoading(false)
  }

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreviews((p) => [...p, ev.target?.result as string])
      reader.readAsDataURL(file)
    })
  }

  return (
    <DashboardLayout title="Create Listing" subtitle="Add a new scrap material listing to the marketplace">
      <form onSubmit={(handleSubmit as any)(onSubmit)} className="max-w-3xl space-y-5">
        <Card padding="lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Product Images</h3>
          <div className="flex flex-wrap gap-3">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative h-24 w-28 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImagePreviews((p) => p.filter((_, j) => j !== i))} className="absolute top-1 right-1 h-5 w-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors">
                  <X size={10} />
                </button>
              </div>
            ))}
            <label className="h-24 w-28 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <ImagePlus size={20} className="text-slate-400 mb-1" />
              <span className="text-xs text-slate-400">Add photo</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
            </label>
          </div>
          <p className="text-xs text-slate-400 mt-2">Upload product images. First image will be used as the listing cover.</p>
        </Card>

        <Card padding="lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Basic Details</h3>
          <div className="space-y-4">
            <Input
              id="title"
              label="Listing Title *"
              placeholder="e.g., Heavy Duty Steel Scrap - MS Turning"
              error={errors.title?.message}
              {...register('title')}
            />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">Description *</label>
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={aiLoading || !selectedCategory}
                  className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-50 px-2.5 py-1 rounded-md"
                >
                  <Sparkles size={12} />
                  {aiLoading ? 'Generating...' : 'AI Auto-Craft'}
                </button>
              </div>
              <Textarea
                id="description"
                placeholder="Describe the material quality, purity, source, and processing..."
                rows={4}
                error={errors.description?.message}
                {...register('description')}
              />
            </div>
            <Select
              id="category_id"
              label="Category *"
              placeholder="Select category"
              options={categories.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
              error={errors.category_id?.message}
              {...register('category_id')}
            />
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Pricing & Inventory</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              id="price_per_unit"
              label="Price per Unit (₹) *"
              type="number"
              placeholder="e.g., 28500"
              error={errors.price_per_unit?.message}
              {...register('price_per_unit')}
            />
            <Select
              id="unit"
              label="Unit *"
              options={UNITS.map((u) => ({ value: u, label: u }))}
              error={errors.unit?.message}
              {...register('unit')}
            />
            <Input
              id="available_quantity"
              label="Available Quantity *"
              type="number"
              placeholder="e.g., 50"
              error={errors.available_quantity?.message}
              {...register('available_quantity')}
            />
            <Input
              id="min_quantity"
              label="Minimum Order Quantity *"
              type="number"
              placeholder="e.g., 1"
              error={errors.min_quantity?.message}
              {...register('min_quantity')}
            />
            <Select
              id="condition"
              label="Condition *"
              options={CONDITIONS.map((c) => ({ value: c.value, label: c.label }))}
              error={errors.condition?.message}
              {...register('condition')}
            />
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Location</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              id="city"
              label="City *"
              placeholder="e.g., Mumbai"
              error={errors.city?.message}
              {...register('city')}
            />
            <Select
              id="state"
              label="State *"
              placeholder="Select state"
              options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
              error={errors.state?.message}
              {...register('state')}
            />
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" loading={loading}>Publish Listing</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/seller/listings')}>Cancel</Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
