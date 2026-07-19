import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, UserRole } from '@/types/database'
import { MOCK_USERS } from '@/lib/mockData'

interface AuthState {
  user: Profile | null
  role: UserRole | null
  loading: boolean
  initialized: boolean

  setUser: (user: Profile | null) => void
  initialize: () => Promise<void>
  signIn: (roleOrEmail: string, password?: string) => Promise<{ success: boolean; profile?: Profile; error?: string }>
  registerUser: (data: { full_name: string; email: string; role: 'buyer' | 'seller'; phone?: string }) => Promise<Profile>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: MOCK_USERS[1], // Default logged-in demo seller for rich dashboard demonstration
      role: 'seller',
      loading: false,
      initialized: true,

      setUser: (user) => set({ user, role: user?.role ?? null }),

      initialize: async () => {
        set({ loading: false, initialized: true })
      },

      signIn: async (roleOrEmail, password) => {
        set({ loading: true })
        await new Promise((r) => setTimeout(r, 400)) // simulate network delay

        let matched = MOCK_USERS.find(
          (u) => u.role === roleOrEmail || u.email.toLowerCase() === roleOrEmail.toLowerCase()
        )

        if (!matched && roleOrEmail.includes('@')) {
          // Dynamic profile for custom email signin
          matched = {
            id: `usr-${Date.now()}`,
            email: roleOrEmail,
            full_name: roleOrEmail.split('@')[0],
            username: roleOrEmail.split('@')[0],
            role: 'buyer',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        }

        if (matched) {
          set({ user: matched, role: matched.role, loading: false })
          return { success: true, profile: matched }
        }

        set({ loading: false })
        return { success: false, error: 'User not found. Try one of the demo buttons.' }
      },

      registerUser: async (data) => {
        set({ loading: true })
        await new Promise((r) => setTimeout(r, 500))

        const newProfile: Profile = {
          id: `usr-${Date.now()}`,
          email: data.email,
          full_name: data.full_name,
          username: data.email.split('@')[0],
          phone: data.phone ?? '',
          role: data.role,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        set({ user: newProfile, role: newProfile.role, loading: false })
        return newProfile
      },

      signOut: async () => {
        set({ user: null, role: null })
      },

      updateProfile: (updates) => {
        const current = get().user
        if (current) {
          const updated = { ...current, ...updates, updated_at: new Date().toISOString() }
          set({ user: updated })
        }
      },
    }),
    {
      name: 'scrapx-auth-store',
      partialize: (state) => ({ user: state.user, role: state.role }),
    }
  )
)
