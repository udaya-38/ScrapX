import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, X, Star, MapPin, SlidersHorizontal, Grid3X3, List, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency } from '@/lib/utils'
import { useDataStore } from '@/store/dataStore'
import type { ScrapListing } from '@/types/database'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
]

export default function Marketplace() {
  const [searchParams] = useSearchParams()
  const { listings, categories } = useDataStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)

  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? '')
  const [sortBy, setSortBy] = useState('newest')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [selectedState, setSelectedState] = useState('')

  const activeCategories = categories.filter((c) => c.is_active)

  const filtered = useMemo(() => {
    let results = [...listings].filter((l) => l.status === 'approved')

    if (search) {
      const q = search.toLowerCase()
      results = results.filter((l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category?.name.toLowerCase().includes(q)
      )
    }
    if (selectedCategory) {
      results = results.filter((l) => l.category_id === selectedCategory)
    }
    if (verifiedOnly) {
      results = results.filter((l) => l.business?.is_verified)
    }
    if (priceMin) {
      results = results.filter((l) => l.price_per_unit >= Number(priceMin))
    }
    if (priceMax) {
      results = results.filter((l) => l.price_per_unit <= Number(priceMax))
    }
    if (selectedState) {
      results = results.filter((l) => l.state === selectedState)
    }

    results.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price_per_unit - b.price_per_unit
      if (sortBy === 'price_desc') return b.price_per_unit - a.price_per_unit
      if (sortBy === 'rating') return (b.avg_rating ?? 0) - (a.avg_rating ?? 0)
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return results
  }, [listings, search, selectedCategory, verifiedOnly, sortBy, priceMin, priceMax, selectedState])

  const clearFilters = () => {
    setSearch(''); setSelectedCategory(''); setPriceMin(''); setPriceMax(''); setVerifiedOnly(false); setSelectedState('')
  }

  const hasFilters = search || selectedCategory || priceMin || priceMax || verifiedOnly || selectedState

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero banner */}
      <div className="bg-slate-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Scrap Marketplace</h1>
          <p className="text-slate-400 text-sm">Browse {listings.length}+ verified scrap listings across India</p>
          <div className="mt-4 max-w-xl">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by material, category, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/15 text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!selectedCategory ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
            >
              All
            </button>
            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-900">{filtered.length}</span> listings found
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal size={14} /> Filters
              {hasFilters && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
              <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}><Grid3X3 size={15} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}><List size={15} /></button>
            </div>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-white rounded-xl border border-slate-100 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Min Price (₹/MT)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Max Price (₹/MT)</label>
                  <input
                    type="number"
                    placeholder="Any"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All States</option>
                    {['Maharashtra', 'Gujarat', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'West Bengal'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600"
                    />
                    <span className="text-sm text-slate-600">Verified sellers only</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 ? (
          <EmptyState
            type="search"
            title="No listings found"
            description="Try adjusting your search terms or filters to find what you're looking for."
            action={<button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">Clear all filters</button>}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((listing) => (
              <ListingRow key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ListingCard({ listing }: { listing: ScrapListing }) {
  const img = listing.images?.[0]?.image_url

  return (
    <Link to={`/marketplace/${listing.id}`}>
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col group">
        <div className="relative h-44 overflow-hidden bg-slate-100">
          {img ? (
            <img src={img} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {listing.category?.icon ?? '📦'}
            </div>
          )}
          {listing.is_featured && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">Featured</span>
          )}
          {listing.business?.is_verified && (
            <span className="absolute top-2 right-2 bg-white/90 text-green-600 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle size={10} /> Verified
            </span>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">{listing.title}</h3>
          </div>
          <p className="text-xs text-slate-400 mb-2">{listing.category?.name}</p>
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
            <MapPin size={11} />
            <span className="truncate">{listing.city}, {listing.state}</span>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-slate-900">{formatCurrency(listing.price_per_unit)}</p>
              <p className="text-xs text-slate-400">per {listing.unit}</p>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-slate-600">{listing.avg_rating?.toFixed(1) ?? '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function ListingRow({ listing }: { listing: ScrapListing }) {
  const img = listing.images?.[0]?.image_url
  return (
    <Link to={`/marketplace/${listing.id}`}>
      <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
        <div className="h-16 w-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
          {img ? (
            <img src={img} alt={listing.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">{listing.category?.icon}</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-slate-900 truncate">{listing.title}</h3>
            {listing.business?.is_verified && <CheckCircle size={13} className="text-green-500 flex-shrink-0" />}
          </div>
          <p className="text-xs text-slate-400 mb-1">{listing.category?.name} · {listing.city}, {listing.state}</p>
          <p className="text-xs text-slate-500 line-clamp-1">{listing.description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-base font-bold text-slate-900">{formatCurrency(listing.price_per_unit)}</p>
          <p className="text-xs text-slate-400">per {listing.unit}</p>
          <div className="flex items-center gap-1 justify-end mt-1">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-slate-500">{listing.avg_rating?.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
