import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiEye, FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('neuraleye_user') || 'null')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('neuraleye_user')
    toast.success('Logged out successfully')
    navigate('/')
  }

  const isHome = location.pathname === '/'

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome ? 'glass border-b border-cyan-500/10 shadow-lg shadow-black/40' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-all">
                <FiEye className="text-white text-sm" />
              </div>
              <div className="absolute inset-0 rounded-lg bg-cyan-400/20 blur-md group-hover:blur-lg transition-all" />
            </div>
            <span className="font-display text-base font-bold text-white tracking-wider">
              NEURAL<span className="text-cyan-400">EYE</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <>
                <Link to="/" className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors">Home</Link>
                <Link to="/login" className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <FiUser className="text-cyan-400" />
                  <span className="text-slate-300">{user.name || user.email}</span>
                  <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {user.role}
                  </span>
                </div>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/user'}
                  className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-rose-400 text-sm font-medium transition-colors">
                  <FiLogOut /> Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-400 hover:text-cyan-400 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-cyan-500/10"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {!user ? (
                <>
                  <Link to="/" onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 py-2 transition-colors">Home</Link>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 py-2 transition-colors">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center text-sm py-2">Get Started</Link>
                </>
              ) : (
                <>
                  <Link to={user.role === 'admin' ? '/admin' : '/user'} onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 py-2 transition-colors">Dashboard</Link>
                  <button onClick={handleLogout} className="text-left text-rose-400 hover:text-rose-300 py-2 transition-colors">Logout</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}