import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Recycle, ArrowRight, ShieldCheck, Zap, BarChart3, Users,
  Star, CheckCircle, Package2, TrendingUp
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { MOCK_CATEGORIES, MOCK_LISTINGS } from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'

const features = [
  { icon: ShieldCheck, title: 'Verified Sellers', desc: 'Every seller is KYC-verified with GST validation and business documentation.' },
  { icon: Zap, title: 'Instant Listings', desc: 'List your scrap materials in minutes. AI auto-fills description and suggests pricing.' },
  { icon: BarChart3, title: 'Business Analytics', desc: 'Track revenue, inventory, orders, and growth with real-time dashboards.' },
  { icon: Users, title: 'Large Network', desc: 'Connect with 400+ verified buyers and sellers across 20 Indian states.' },
]

const stats = [
  { value: '₹40L+', label: 'Monthly Trade Volume' },
  { value: '400+', label: 'Verified Businesses' },
  { value: '234', label: 'Active Listings' },
  { value: '1,800+', label: 'Orders Completed' },
]

export default function LandingPage() {
  const featuredListings = MOCK_LISTINGS.filter((l) => l.is_featured).slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full px-4 py-1.5 text-sm mb-6">
              <Recycle size={14} /> India's #1 Scrap Trading Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Buy. Sell. Recycle.<br />
              <span className="text-blue-400">Professionally.</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              ScrapX connects verified scrap buyers and sellers across India. 
              Digitize your trading with smart inventory, real-time orders, and AI-powered insights.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/auth/register">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-base transition-colors flex items-center gap-2"
                >
                  Get Started Free <ArrowRight size={16} />
                </motion.button>
              </Link>
              <Link to="/marketplace">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 rounded-xl font-semibold text-base transition-colors"
                >
                  Browse Marketplace
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-800 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
            >
              <p className="text-3xl font-bold text-blue-400 mb-1">{s.value}</p>
              <p className="text-sm text-slate-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Browse by Category</h2>
          <p className="text-slate-500 text-center text-sm mb-8">Find materials across all major scrap categories</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {MOCK_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.2 }}
              >
                <Link to={`/marketplace?category=${cat.id}`}>
                  <div className="bg-white rounded-xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group text-center">
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{cat.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{cat.listing_count} listings</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Listings</h2>
              <p className="text-sm text-slate-400 mt-1">Handpicked premium scrap listings</p>
            </div>
            <Link to="/marketplace" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
              >
                <Link to={`/marketplace/${listing.id}`}>
                  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group h-full flex flex-col">
                    <div className="h-48 bg-slate-100 overflow-hidden relative">
                      {listing.images?.[0]?.image_url && (
                        <img src={listing.images[0].image_url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      {listing.business?.is_verified && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5 text-xs text-green-600 font-medium">
                          <CheckCircle size={10} /> Verified
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-xs text-blue-600 font-medium mb-1">{listing.category?.name}</p>
                      <h3 className="text-base font-semibold text-slate-900 mb-1 line-clamp-2">{listing.title}</h3>
                      <p className="text-xs text-slate-400 mb-auto">{listing.city}, {listing.state}</p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                        <div>
                          <p className="text-lg font-bold text-slate-900">{formatCurrency(listing.price_per_unit)}</p>
                          <p className="text-xs text-slate-400">per {listing.unit}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star size={13} className="text-yellow-400 fill-yellow-400" />
                          <span className="font-medium text-slate-600">{listing.avg_rating?.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Why choose ScrapX?</h2>
          <p className="text-slate-500 text-center text-sm mb-10">Enterprise-grade tools for modern scrap traders</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -12 : 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="bg-white rounded-2xl border border-slate-100 p-6 flex gap-4"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">{f.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Ready to trade smarter?</h2>
          <p className="text-blue-100 mb-8">Join 400+ businesses already trading on ScrapX.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/auth/register">
              <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold text-base transition-colors">
                Start as Seller
              </button>
            </Link>
            <Link to="/auth/register">
              <button className="border-2 border-white/40 text-white hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold text-base transition-colors">
                Register as Buyer
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">SX</span>
            </div>
            <span className="text-white font-semibold">ScrapX</span>
            <span className="text-xs ml-1">Buy. Sell. Recycle.</span>
          </div>
          <p className="text-xs">© 2024 ScrapX. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
            <Link to="/auth/register" className="hover:text-white transition-colors">Register</Link>
            <Link to="/auth/login" className="hover:text-white transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
