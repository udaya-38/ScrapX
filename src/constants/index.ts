// Scrap material categories
export const CATEGORIES = [
  { id: 'ferrous', name: 'Ferrous Metals', icon: '⚙️', color: '#64748b', slug: 'ferrous-metals' },
  { id: 'non-ferrous', name: 'Non-Ferrous Metals', icon: '🔩', color: '#f59e0b', slug: 'non-ferrous-metals' },
  { id: 'plastics', name: 'Plastics', icon: '♻️', color: '#22c55e', slug: 'plastics' },
  { id: 'paper', name: 'Paper & Cardboard', icon: '📦', color: '#84cc16', slug: 'paper-cardboard' },
  { id: 'electronics', name: 'E-Waste', icon: '💻', color: '#8b5cf6', slug: 'e-waste' },
  { id: 'rubber', name: 'Rubber', icon: '🔄', color: '#ef4444', slug: 'rubber' },
  { id: 'glass', name: 'Glass', icon: '🪟', color: '#06b6d4', slug: 'glass' },
  { id: 'textiles', name: 'Textiles', icon: '🧵', color: '#ec4899', slug: 'textiles' },
  { id: 'wood', name: 'Wood & Timber', icon: '🌲', color: '#a3623a', slug: 'wood-timber' },
  { id: 'chemicals', name: 'Industrial Chemicals', icon: '🧪', color: '#f97316', slug: 'industrial-chemicals' },
]

export const UNITS = ['kg', 'ton', 'MT', 'piece', 'litre', 'bundle', 'box', 'set']

export const CONDITIONS: { value: string; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: 'text-green-600 bg-green-50' },
  { value: 'good', label: 'Good', color: 'text-blue-600 bg-blue-50' },
  { value: 'fair', label: 'Fair', color: 'text-yellow-600 bg-yellow-50' },
  { value: 'scrap', label: 'Scrap', color: 'text-red-600 bg-red-50' },
]

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  { value: 'accepted', label: 'Accepted', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { value: 'packed', label: 'Packed', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { value: 'shipped', label: 'Shipped', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  { value: 'delivered', label: 'Delivered', color: 'text-green-700 bg-green-50 border-green-200' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-red-700 bg-red-50 border-red-200' },
  { value: 'rejected', label: 'Rejected', color: 'text-gray-700 bg-gray-50 border-gray-200' },
]

export const LISTING_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'text-gray-600 bg-gray-100' },
  { value: 'pending_review', label: 'Pending Review', color: 'text-yellow-600 bg-yellow-50' },
  { value: 'approved', label: 'Approved', color: 'text-green-600 bg-green-50' },
  { value: 'rejected', label: 'Rejected', color: 'text-red-600 bg-red-50' },
  { value: 'paused', label: 'Paused', color: 'text-gray-500 bg-gray-50' },
]

export const PAYMENT_METHODS = [
  { value: 'upi', label: 'UPI Payment', description: 'Pay via UPI (GPay, PhonePe, BHIM)', icon: '📱' },
  { value: 'bank_transfer', label: 'Bank Transfer', description: 'NEFT / RTGS / IMPS transfer', icon: '🏦' },
  { value: 'cash_on_delivery', label: 'Cash on Delivery', description: 'Pay when you receive the goods', icon: '💵' },
]

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi',
]

export const NAV_ITEMS = {
  buyer: [
    { label: 'Dashboard', href: '/buyer', icon: 'LayoutDashboard' },
    { label: 'Marketplace', href: '/marketplace', icon: 'ShoppingBag' },
    { label: 'My Orders', href: '/buyer/orders', icon: 'Package' },
    { label: 'Wishlist', href: '/buyer/wishlist', icon: 'Heart' },
    { label: 'Cart', href: '/buyer/cart', icon: 'ShoppingCart' },
    { label: 'Profile', href: '/buyer/profile', icon: 'User' },
  ],
  seller: [
    { label: 'Dashboard', href: '/seller', icon: 'LayoutDashboard' },
    { label: 'Listings', href: '/seller/listings', icon: 'Package2' },
    { label: 'Inventory', href: '/seller/inventory', icon: 'Boxes' },
    { label: 'Orders', href: '/seller/orders', icon: 'ClipboardList' },
    { label: 'Analytics', href: '/seller/analytics', icon: 'BarChart3' },
    { label: 'Business Profile', href: '/seller/profile', icon: 'Building2' },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { label: 'Users', href: '/admin/users', icon: 'Users' },
    { label: 'Businesses', href: '/admin/businesses', icon: 'Building2' },
    { label: 'Listings', href: '/admin/listings', icon: 'Package2' },
    { label: 'Orders', href: '/admin/orders', icon: 'ClipboardList' },
    { label: 'Categories', href: '/admin/categories', icon: 'Tag' },
    { label: 'Reports', href: '/admin/reports', icon: 'BarChart3' },
  ],
}
