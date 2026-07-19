export type UserRole = 'admin' | 'seller' | 'buyer'
export type OrderStatus = 'pending' | 'accepted' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'rejected'
export type ListingStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'paused'
export type PaymentMethod = 'upi' | 'bank_transfer' | 'cash_on_delivery'
export type ScrapCondition = 'new' | 'good' | 'fair' | 'scrap'

export interface Profile {
  id: string
  email: string
  full_name: string
  username: string
  phone?: string
  avatar_url?: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Business {
  id: string
  seller_id: string
  company_name: string
  logo_url?: string
  banner_url?: string
  owner_name: string
  contact_number: string
  email: string
  gst_number?: string
  registration_number?: string
  address: string
  city: string
  state: string
  pincode: string
  description?: string
  years_of_experience: number
  is_verified: boolean
  verification_date?: string
  created_at: string
  updated_at: string
  // joined
  seller?: Profile
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  is_active: boolean
  listing_count?: number
  created_at: string
}

export interface ScrapListing {
  id: string
  seller_id: string
  category_id: string
  title: string
  description: string
  price_per_unit: number
  unit: string
  min_quantity: number
  available_quantity: number
  condition: ScrapCondition
  location: string
  city: string
  state: string
  status: ListingStatus
  is_featured: boolean
  view_count: number
  created_at: string
  updated_at: string
  // joined
  seller?: Profile
  business?: Business
  category?: Category
  images?: ListingImage[]
  inventory?: Inventory
  avg_rating?: number
  review_count?: number
}

export interface ListingImage {
  id: string
  listing_id: string
  image_url: string
  is_primary: boolean
  sort_order: number
  created_at: string
}

export interface Inventory {
  id: string
  listing_id: string
  available_stock: number
  reserved_stock: number
  sold_stock: number
  low_stock_threshold: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  buyer_id: string
  listing_id: string
  quantity: number
  created_at: string
  listing?: ScrapListing
}

export interface Order {
  id: string
  order_number: string
  buyer_id: string
  seller_id: string
  status: OrderStatus
  payment_method: PaymentMethod
  subtotal: number
  tax_amount: number
  total_amount: number
  shipping_address: string
  notes?: string
  created_at: string
  updated_at: string
  // joined
  buyer?: Profile
  seller?: Profile
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  listing_id: string
  quantity: number
  unit_price: number
  total_price: number
  listing?: ScrapListing
}

export interface WishlistItem {
  id: string
  buyer_id: string
  listing_id: string
  created_at: string
  listing?: ScrapListing
}

export interface Review {
  id: string
  buyer_id: string
  listing_id: string
  seller_id: string
  rating: number
  title?: string
  comment?: string
  is_approved: boolean
  created_at: string
  buyer?: Profile
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'order' | 'listing' | 'review' | 'system' | 'verification'
  is_read: boolean
  link?: string
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  listing_id?: string
  seller_id?: string
  reason: string
  description?: string
  status: 'pending' | 'resolved' | 'dismissed'
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id?: string
  action: string
  entity_type: string
  entity_id?: string
  metadata?: Record<string, unknown>
  created_at: string
}

export interface DashboardStats {
  total_revenue?: number
  total_orders: number
  active_listings?: number
  pending_orders: number
  total_users?: number
  total_sellers?: number
  total_buyers?: number
}

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      businesses: { Row: Business; Insert: Partial<Business>; Update: Partial<Business> }
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category> }
      scrap_listings: { Row: ScrapListing; Insert: Partial<ScrapListing>; Update: Partial<ScrapListing> }
      listing_images: { Row: ListingImage; Insert: Partial<ListingImage>; Update: Partial<ListingImage> }
      inventory: { Row: Inventory; Insert: Partial<Inventory>; Update: Partial<Inventory> }
      cart_items: { Row: CartItem; Insert: Partial<CartItem>; Update: Partial<CartItem> }
      orders: { Row: Order; Insert: Partial<Order>; Update: Partial<Order> }
      order_items: { Row: OrderItem; Insert: Partial<OrderItem>; Update: Partial<OrderItem> }
      wishlist: { Row: WishlistItem; Insert: Partial<WishlistItem>; Update: Partial<WishlistItem> }
      reviews: { Row: Review; Insert: Partial<Review>; Update: Partial<Review> }
      notifications: { Row: Notification; Insert: Partial<Notification>; Update: Partial<Notification> }
      reports: { Row: Report; Insert: Partial<Report>; Update: Partial<Report> }
      activity_logs: { Row: ActivityLog; Insert: Partial<ActivityLog>; Update: Partial<ActivityLog> }
    }
  }
}
