import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Recycle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from '@/components/ui/Toast'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const result = await signIn(data.email, data.password)
    setLoading(false)

    if (result.success && result.profile) {
      toast.success('Welcome back!', `Logged in as ${result.profile.full_name}`)
      if (result.profile.role === 'admin') navigate('/admin')
      else if (result.profile.role === 'seller') navigate('/seller')
      else navigate('/buyer')
    } else {
      toast.error('Login failed', result.error ?? 'Invalid credentials')
    }
  }

  const handleDemoLogin = async (role: 'admin' | 'seller' | 'buyer') => {
    setLoading(true)
    const result = await signIn(role)
    setLoading(false)

    if (result.success && result.profile) {
      toast.success('Demo Login Successful!', `Signed in as ${result.profile.full_name} (${role.toUpperCase()})`)
      if (role === 'admin') navigate('/admin')
      else if (role === 'seller') navigate('/seller')
      else navigate('/buyer')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center p-4">
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
          <h1 className="text-2xl font-bold text-slate-900">Welcome to ScrapX</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your professional scrap trading account</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              id="password"
              label="Password"
              placeholder="Enter your password"
              leftIcon={<Lock size={15} />}
              showPasswordToggle
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600" {...register('rememberMe')} />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <Link to="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Instant Demo Access</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['admin', 'seller', 'buyer'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleDemoLogin(role)}
                disabled={loading}
                className="text-xs py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all capitalize font-semibold flex flex-col items-center justify-center gap-1 disabled:opacity-50"
              >
                <span>{role === 'admin' ? '👑 Admin' : role === 'seller' ? '🏭 Seller' : '🛒 Buyer'}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-blue-600 font-medium hover:underline">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
