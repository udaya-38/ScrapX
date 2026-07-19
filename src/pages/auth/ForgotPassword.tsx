import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Recycle, ArrowLeft, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from '@/components/ui/Toast'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setSent(true)
    setLoading(false)
    toast.success('Reset link sent!', `Password reset link dispatched to ${data.email}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-500/20">
            <Recycle size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
          <p className="text-slate-500 text-sm mt-1">We'll send you a link to reset your password</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900 mb-1">Email sent!</h3>
              <p className="text-sm text-slate-500 mb-4">
                Check your inbox for a password reset link.
              </p>
              <Link to="/auth/login" className="text-sm text-blue-600 font-semibold hover:underline">
                Back to login
              </Link>
            </div>
          ) : (
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
              <Button type="submit" className="w-full" loading={loading}>
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        <Link to="/auth/login" className="flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mt-4 transition-colors">
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </motion.div>
    </div>
  )
}
