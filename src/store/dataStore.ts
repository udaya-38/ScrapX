import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ScrapListing, Order, Business, Category, Profile, Notification, OrderStatus, ListingStatus } from '@/types/database'
import { MOCK_CATEGORIES, MOCK_LISTINGS, MOCK_ORDERS, MOCK_USERS, MOCK_BUSINESSES, MOCK_NOTIFICATIONS } from '@/lib/mockData'

interface DataState {
  listings: ScrapListing[]
  orders: Order[]
  categories: Category[]
  businesses: Business[]
  users: Profile[]
  notifications: Notification[]
  wishlist: string[] // listing IDs

  // Actions - Listings
  addListing: (listing: Omit<ScrapListing, 'id' | 'created_at' | 'updated_at'>) => ScrapListing
  updateListing: (id: string, updates: Partial<ScrapListing>) => void
  deleteListing: (id: string) => void
  toggleListingStatus: (id: string, status?: ListingStatus) => void

  // Actions - Orders
  addOrder: (order: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>) => Order
  updateOrderStatus: (id: string, status: OrderStatus) => void

  // Actions - Businesses
  toggleBusinessVerification: (id: string, is_verified: boolean) => void
  updateBusinessProfile: (id: string, updates: Partial<Business>) => void

  // Actions - Users
  toggleUserStatus: (id: string) => void
  addUserProfile: (profile: Profile) => void
  updateUserProfile: (id: string, updates: Partial<Profile>) => void

  // Actions - Categories
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
  toggleCategoryStatus: (id: string) => void

  // Actions - Wishlist
  toggleWishlist: (listingId: string) => void

  // Actions - Notifications
  markNotificationRead: (id: string) => void
  clearNotifications: () => void

  // Reset
  resetData: () => void
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      listings: MOCK_LISTINGS,
      orders: MOCK_ORDERS,
      categories: MOCK_CATEGORIES,
      businesses: MOCK_BUSINESSES,
      users: MOCK_USERS,
      notifications: MOCK_NOTIFICATIONS,
      wishlist: ['1', '2', '5', '6'],

      // Listings
      addListing: (newListing) => {
        const id = `lst-${Date.now()}`
        const created: ScrapListing = {
          ...newListing,
          id,
          view_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        set((state) => ({ listings: [created, ...state.listings] }))
        return created
      },

      updateListing: (id, updates) =>
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id ? { ...l, ...updates, updated_at: new Date().toISOString() } : l
          ),
        })),

      deleteListing: (id) =>
        set((state) => ({
          listings: state.listings.filter((l) => l.id !== id),
        })),

      toggleListingStatus: (id, status) =>
        set((state) => ({
          listings: state.listings.map((l) => {
            if (l.id !== id) return l
            const nextStatus: ListingStatus = status
              ? status
              : l.status === 'approved'
              ? 'paused'
              : l.status === 'paused'
              ? 'approved'
              : l.status
            return { ...l, status: nextStatus, updated_at: new Date().toISOString() }
          }),
        })),

      // Orders
      addOrder: (newOrder) => {
        const id = `ord-${Date.now()}`
        const orderNumber = `SX${Math.floor(100 + Math.random() * 900)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
        const created: Order = {
          ...newOrder,
          id,
          order_number: orderNumber,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // Generate seller notification
        const notif: Notification = {
          id: `n-${Date.now()}`,
          user_id: created.seller_id,
          title: 'New Order Received',
          message: `Order #${created.order_number} placed for ₹${created.total_amount.toLocaleString()}`,
          type: 'order',
          is_read: false,
          link: '/seller/orders',
          created_at: new Date().toISOString(),
        }

        set((state) => ({
          orders: [created, ...state.orders],
          notifications: [notif, ...state.notifications],
        }))
        return created
      },

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status, updated_at: new Date().toISOString() } : o
          ),
        })),

      // Businesses
      toggleBusinessVerification: (id, is_verified) =>
        set((state) => ({
          businesses: state.businesses.map((b) =>
            b.id === id
              ? {
                  ...b,
                  is_verified,
                  verification_date: is_verified ? new Date().toISOString() : undefined,
                  updated_at: new Date().toISOString(),
                }
              : b
          ),
          listings: state.listings.map((l) =>
            l.business?.id === id
              ? {
                  ...l,
                  business: { ...l.business, is_verified },
                }
              : l
          ),
        })),

      updateBusinessProfile: (id, updates) =>
        set((state) => ({
          businesses: state.businesses.map((b) =>
            b.id === id ? { ...b, ...updates, updated_at: new Date().toISOString() } : b
          ),
        })),

      // Users
      toggleUserStatus: (id) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, is_active: !u.is_active, updated_at: new Date().toISOString() } : u
          ),
        })),

      addUserProfile: (profile) =>
        set((state) => ({
          users: [...state.users.filter((u) => u.id !== profile.id), profile],
        })),

      updateUserProfile: (id, updates) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, ...updates, updated_at: new Date().toISOString() } : u
          ),
        })),

      // Categories
      addCategory: (newCategory) => {
        const id = `cat-${Date.now()}`
        const created: Category = {
          ...newCategory,
          id,
          created_at: new Date().toISOString(),
        }
        set((state) => ({ categories: [...state.categories, created] }))
      },

      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),

      toggleCategoryStatus: (id) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, is_active: !c.is_active } : c
          ),
        })),

      // Wishlist
      toggleWishlist: (listingId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(listingId)
            ? state.wishlist.filter((id) => id !== listingId)
            : [...state.wishlist, listingId],
        })),

      // Notifications
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
        })),

      clearNotifications: () => set({ notifications: [] }),

      // Reset
      resetData: () =>
        set({
          listings: MOCK_LISTINGS,
          orders: MOCK_ORDERS,
          categories: MOCK_CATEGORIES,
          businesses: MOCK_BUSINESSES,
          users: MOCK_USERS,
          notifications: MOCK_NOTIFICATIONS,
          wishlist: ['1', '2', '5', '6'],
        }),
    }),
    {
      name: 'scrapx-data-store',
    }
  )
)
