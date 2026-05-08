import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus, FiChevronDown } from 'react-icons/fi'
import { registerUser } from '../services/api'
import toast from 'react-hot-toast'
import { ButtonSpinner } from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
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
      await registerUser(form)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed. Try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field) =>
    `input-field ${errors[field] ? 'border-rose-500/60 focus:border-rose-500/80' : ''}`

  return (
    <div className="min-h-screen animated-gradient grid-bg flex flex-col">
      <div className="fixed top-1/3 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 left-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="glass-strong rounded-3xl p-8 shadow-2xl shadow-black/60 border border-cyan-500/15">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/30"
              >
                <FiUserPlus className="text-white text-2xl" />
              </motion.div>
              <h1 className="font-display text-2xl font-bold text-white mb-1">Create Account</h1>
              <p className="text-slate-400 text-sm">Join NeuralEye — it's free</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`${inputClass('name')} pl-11`}
                  />
                </div>
                {errors.name && <p className="text-rose-400 text-xs mt-1.5">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`${inputClass('email')} pl-11`}
                  />
                </div>
                {errors.email && <p className="text-rose-400 text-xs mt-1.5">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className={`${inputClass('password')} pl-11 pr-12`}
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

              {/* Role */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Account Role</label>
                <div className="relative">
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="input-field appearance-none pr-10 cursor-pointer"
                  >
                    <option value="user">👤 User — Standard Access</option>
                    <option value="admin">🛡️ Admin — Full Access</option>
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
                <p className="text-slate-600 text-xs mt-1.5 font-mono">
                  {form.role === 'admin' ? '⚠️ Admin accounts have full platform access' : 'Users can upload and analyze images'}
                </p>
              </div>

              {/* Password strength indicator */}
              {form.password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => {
                      const strength = Math.min(Math.floor(form.password.length / 3), 4)
                      return (
                        <div
                          key={level}
                          className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                            level <= strength
                              ? strength <= 1 ? 'bg-rose-500' : strength <= 2 ? 'bg-yellow-500' : strength <= 3 ? 'bg-blue-500' : 'bg-emerald-500'
                              : 'bg-slate-700'
                          }`}
                        />
                      )
                    })}
                  </div>
                  <p className="text-xs text-slate-500">
                    Strength: {form.password.length < 3 ? 'Weak' : form.password.length < 6 ? 'Fair' : form.password.length < 9 ? 'Good' : 'Strong'}
                  </p>
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary flex items-center justify-center gap-2.5 py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <><ButtonSpinner /> Creating Account...</>
                ) : (
                  <><FiUserPlus /> Create Account</>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

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