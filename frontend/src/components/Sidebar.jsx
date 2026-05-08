import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiEye, FiUploadCloud, FiClock, FiLogOut,
  FiGrid, FiUsers, FiBarChart2, FiSettings, FiDatabase
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const userLinks = [
  { icon: FiGrid, label: 'Dashboard', href: '#dashboard' },
  { icon: FiUploadCloud, label: 'Upload & Detect', href: '#upload' },
  { icon: FiClock, label: 'History', href: '#history' },
]

const adminLinks = [
  { icon: FiGrid, label: 'Overview', href: '#overview' },
  { icon: FiUsers, label: 'Users', href: '#users' },
  { icon: FiBarChart2, label: 'Analytics', href: '#analytics' },
  { icon: FiDatabase, label: 'Dataset', href: '#dataset' },
  { icon: FiClock, label: 'Predictions', href: '#predictions' },
]

export default function Sidebar({ role = 'user', activeSection, setActiveSection }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('neuraleye_user') || 'null')
  const links = role === 'admin' ? adminLinks : userLinks

  const handleLogout = () => {
    localStorage.removeItem('neuraleye_user')
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="hidden lg:flex flex-col w-64 min-h-screen glass border-r border-cyan-500/10 fixed left-0 top-0 z-40"
    >
      {/* Logo */}
      <div className="p-6 border-b border-cyan-500/10">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <FiEye className="text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-md" />
          </div>
          <span className="font-display text-sm font-bold text-white tracking-wider">
            NEURAL<span className="text-cyan-400">EYE</span>
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-cyan-500/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
            {(user?.name || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-sm font-semibold truncate">{user?.name || 'User'}</p>
            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 capitalize">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-widest font-display">
          {role === 'admin' ? 'Admin Panel' : 'Navigation'}
        </p>
        {links.map(({ icon: Icon, label, href }) => {
          const sectionId = href.replace('#', '')
          const isActive = activeSection === sectionId
          return (
            <button
              key={label}
              onClick={() => setActiveSection && setActiveSection(sectionId)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`text-base ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              {label}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-cyan-500/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </motion.aside>
  )
}