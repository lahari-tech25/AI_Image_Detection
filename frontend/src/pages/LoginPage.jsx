import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi'
import { loginUser } from '../services/api'
import toast from 'react-hot-toast'
import { ButtonSpinner } from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Min 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await loginUser(form)
      const user = res.data
      localStorage.setItem('neuraleye_user', JSON.stringify(user))
      toast.success(`Welcome back, ${user.name || user.email}!`)
      navigate(user.role === 'admin' ? '/admin' : '/user')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Check credentials.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen animated-gradient grid-bg flex flex-col">
      {/* Glow orbs */}
      <div className="fixed top-1/3 left-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="glass-strong rounded-3xl p-8 shadow-2xl shadow-black/60 border border-cyan-500/15">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-cyan-500/30"
              >
                <FiLogIn className="text-white text-2xl" />
              </motion.div>
              <h1 className="font-display text-2xl font-bold text-white mb-1">Welcome Back</h1>
              <p className="text-slate-400 text-sm">Sign in to your NeuralEye account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`input-field pl-11 ${errors.email ? 'border-rose-500/60 focus:border-rose-500/80' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-rose-400 text-xs mt-1.5">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`input-field pl-11 pr-12 ${errors.password ? 'border-rose-500/60 focus:border-rose-500/80' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-400 text-xs mt-1.5">{errors.password}</p>}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary flex items-center justify-center gap-2.5 py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <><ButtonSpinner /> Signing In...</>
                ) : (
                  <><FiLogIn /> Sign In</>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Create one free
                </Link>
              </p>
            </div>

            {/* Role hint */}
            <div className="mt-5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <p className="text-slate-500 text-xs text-center font-mono">
                🔐 Role-based redirect: <span className="text-cyan-400">admin → /admin</span> · <span className="text-purple-400">user → /user</span>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link to="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}