-- =============================================
-- ScrapX Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('admin', 'seller', 'buyer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BUSINESSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  owner_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT NOT NULL,
  gst_number TEXT,
  registration_number TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT,
  description TEXT,
  years_of_experience INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SCRAP LISTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS scrap_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_unit NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  min_quantity NUMERIC NOT NULL DEFAULT 1,
  available_quantity NUMERIC NOT NULL DEFAULT 0,
  condition TEXT NOT NULL DEFAULT 'scrap' CHECK (condition IN ('new', 'good', 'fair', 'scrap')),
  location TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'paused')),
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- LISTING IMAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES scrap_listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INVENTORY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL UNIQUE REFERENCES scrap_listings(id) ON DELETE CASCADE,
  available_stock NUMERIC DEFAULT 0,
  reserved_stock NUMERIC DEFAULT 0,
  sold_stock NUMERIC DEFAULT 0,
  low_stock_threshold NUMERIC DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CART ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES scrap_listings(id) ON DELETE CASCADE,
  quantity NUMERIC NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(buyer_id, listing_id)
);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'packed', 'shipped', 'delivered', 'cancelled', 'rejected')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('upi', 'bank_transfer', 'cash_on_delivery')),
  subtotal NUMERIC NOT NULL,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  shipping_address TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES scrap_listings(id),
  quantity NUMERIC NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL
);

-- =============================================
-- WISHLIST TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES scrap_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(buyer_id, listing_id)
);

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  listing_id UUID NOT NULL REFERENCES scrap_listings(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system' CHECK (type IN ('order', 'listing', 'review', 'system', 'verification')),
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- REPORTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id),
  listing_id UUID REFERENCES scrap_listings(id),
  seller_id UUID REFERENCES profiles(id),
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ACTIVITY LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrap_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own profile, admins read all
CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: public read
CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);

-- Listings: approved listings are public, sellers manage their own
CREATE POLICY "Approved listings are public" ON scrap_listings FOR SELECT USING (status = 'approved' OR seller_id = auth.uid());
CREATE POLICY "Sellers can insert listings" ON scrap_listings FOR INSERT WITH CHECK (seller_id = auth.uid());
CREATE POLICY "Sellers can update own listings" ON scrap_listings FOR UPDATE USING (seller_id = auth.uid());
CREATE POLICY "Sellers can delete own listings" ON scrap_listings FOR DELETE USING (seller_id = auth.uid());

-- Listing images: public read
CREATE POLICY "Listing images are public" ON listing_images FOR SELECT USING (true);

-- Cart: users manage their own cart
CREATE POLICY "Users manage own cart" ON cart_items FOR ALL USING (buyer_id = auth.uid());

-- Orders: buyers and sellers see their own orders
CREATE POLICY "Buyers see own orders" ON orders FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());
CREATE POLICY "Buyers can insert orders" ON orders FOR INSERT WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Sellers can update order status" ON orders FOR UPDATE USING (seller_id = auth.uid() OR buyer_id = auth.uid());

-- Wishlist: users manage own wishlist
CREATE POLICY "Users manage own wishlist" ON wishlist FOR ALL USING (buyer_id = auth.uid());

-- Reviews: public read, buyers insert
CREATE POLICY "Reviews are public" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Buyers can insert reviews" ON reviews FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- Notifications: users see own notifications
CREATE POLICY "Users see own notifications" ON notifications FOR ALL USING (user_id = auth.uid());

-- Businesses: public read
CREATE POLICY "Businesses are public" ON businesses FOR SELECT USING (true);
CREATE POLICY "Sellers manage own business" ON businesses FOR ALL USING (seller_id = auth.uid());

-- =============================================
-- SEED CATEGORIES
-- =============================================
INSERT INTO categories (name, slug, icon, color, is_active) VALUES
  ('Ferrous Metals', 'ferrous-metals', '⚙️', '#64748b', true),
  ('Non-Ferrous Metals', 'non-ferrous-metals', '🔩', '#f59e0b', true),
  ('Plastics', 'plastics', '♻️', '#22c55e', true),
  ('Paper & Cardboard', 'paper-cardboard', '📦', '#84cc16', true),
  ('E-Waste', 'e-waste', '💻', '#8b5cf6', true),
  ('Rubber', 'rubber', '🔄', '#ef4444', true),
  ('Glass', 'glass', '🪟', '#06b6d4', true),
  ('Textiles', 'textiles', '🧵', '#ec4899', true)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- FUNCTION: Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    split_part(NEW.email, '@', 1),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
