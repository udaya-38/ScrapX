import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Phone, Recycle, Building2, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

const schema = z.object({
  full_name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  role: z.enum(['buyer', 'seller']),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine((v) => v, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function Register() {
  const navigate = useNavigate()
  const { registerUser } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'buyer' },
  })

  const watchRole = watch('role')

  const handleRoleSelect = (role: 'buyer' | 'seller') => {
    setValue('role', role)
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const profile = await registerUser({
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      phone: data.phone,
    })
    setLoading(false)

    toast.success('Account created successfully!', `Welcome to ScrapX, ${profile.full_name}!`)
    if (profile.role === 'seller') {
      navigate('/seller')
    } else {
      navigate('/buyer')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center p-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-500/20">
            <Recycle size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
          <p className="text-slate-500 text-sm mt-1">Join ScrapX — India's enterprise scrap trading platform</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">I want to</p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'buyer', label: 'Buy Scrap', desc: 'Find & purchase materials', icon: ShoppingBag },
                  { value: 'seller', label: 'Sell Scrap', desc: 'List & manage inventory', icon: Building2 },
                ] as const).map((option) => {
                  const Icon = option.icon
                  const isSelected = watchRole === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleRoleSelect(option.value)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all text-center',
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      )}
                    >
                      <Icon size={20} />
                      <span className="text-sm font-semibold">{option.label}</span>
                      <span className="text-xs opacity-70">{option.desc}</span>
                    </button>
                  )
                })}
              </div>
              <input type="hidden" {...register('role')} />
            </div>

            <Input
              id="full_name"
              label="Full Name"
              placeholder="Your full name"
              leftIcon={<User size={15} />}
              error={errors.full_name?.message}
              {...register('full_name')}
            />
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={15} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              id="phone"
              label="Phone Number (optional)"
              type="tel"
              placeholder="+91 9876543210"
              leftIcon={<Phone size={15} />}
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              id="password"
              label="Password"
              placeholder="Min 8 characters"
              leftIcon={<Lock size={15} />}
              showPasswordToggle
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              id="confirmPassword"
              label="Confirm Password"
              placeholder="Repeat your password"
              leftIcon={<Lock size={15} />}
              showPasswordToggle
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-blue-600 mt-0.5"
                {...register('agreeTerms')}
              />
              <span className="text-sm text-slate-600">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-xs text-red-500">{errors.agreeTerms.message}</p>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
