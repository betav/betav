import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LogIn } from 'lucide-react'
import { Button } from '../../components/ui/button.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Label } from '../../components/ui/label.jsx'
import { login } from '../../lib/api.js'
import { COMPANY_NAME } from '../../lib/config.js'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
  remember: z.boolean().optional(),
})

export default function AdminLogin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email, password, remember }) => {
    setLoading(true)
    try {
      const data = await login(email, password)
      const token = data.token || data.record?.token
      if (!token) throw new Error('No token received')
      localStorage.setItem('admin_token', token)
      if (remember) localStorage.setItem('admin_email', email)
      toast.success('Logged in successfully')
      navigate('/admin')
    } catch (err) {
      toast.error(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-dark px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-4 shadow-xl shadow-gold/30">
            <span className="text-charcoal-dark font-black">AE</span>
          </div>
          <h1 className="text-2xl font-black text-white">{COMPANY_NAME}</h1>
          <p className="text-silver/50 text-sm mt-1">Admin Dashboard</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-gold/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-silver/70 mb-1.5 block">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="admin@example.com"
                className="bg-charcoal border-gold/20 text-white placeholder:text-silver/30 focus:border-gold"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="text-silver/70 mb-1.5 block">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="bg-charcoal border-gold/20 text-white placeholder:text-silver/30 focus:border-gold"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" {...register('remember')} className="accent-gold" />
              <Label htmlFor="remember" className="text-silver/50 text-sm cursor-pointer">Remember me</Label>
            </div>

            <Button type="submit" variant="gold" size="lg" disabled={loading} className="w-full gap-2">
              <LogIn className="h-4 w-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
