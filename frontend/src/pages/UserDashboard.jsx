import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGrid, FiUploadCloud, FiClock, FiLogOut,
  FiMenu, FiX, FiZap, FiImage, FiTrendingUp,
  FiCheckCircle, FiTrash2
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import UploadBox from '../components/UploadBox'
import StatCard from '../components/StatCard'

// History table row
function HistoryRow({ item, index, onDelete }) {
  const pct = Math.round((item.confidence || 0) * 100)
  const isHigh = pct >= 80
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors group"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-700" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
              <FiImage className="text-slate-500 text-sm" />
            </div>
          )}
          <span className="text-slate-300 text-sm truncate max-w-[120px]">{item.filename || 'image.jpg'}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-cyan-400 font-semibold text-sm capitalize">{item.prediction}</span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isHigh ? 'bg-emerald-400' : pct >= 50 ? 'bg-yellow-400' : 'bg-rose-400'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className={`text-xs font-mono font-bold ${isHigh ? 'text-emerald-400' : pct >= 50 ? 'text-yellow-400' : 'text-rose-400'}`}>
            {pct}%
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-slate-500 text-xs font-mono">
        {new Date(item.timestamp).toLocaleString()}
      </td>
      <td className="py-3 px-4">
        <button
          onClick={() => onDelete(index)}
          className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition-all p-1 rounded-lg hover:bg-rose-500/10"
        >
          <FiTrash2 className="text-sm" />
        </button>
      </td>
    </motion.tr>
  )
}

export default function UserDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('neuraleye_user') || 'null')
  const [activeSection, setActiveSection] = useState('dashboard')
  const [history, setHistory] = useState([])
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Load history from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('neuraleye_history') || '[]')
    setHistory(saved)
  }, [])

  const handleNewResult = (result) => {
    const updated = [result, ...history].slice(0, 50) // keep last 50
    setHistory(updated)
    localStorage.setItem('neuraleye_history', JSON.stringify(updated))
  }

  const handleDeleteHistory = (index) => {
    const updated = history.filter((_, i) => i !== index)
    setHistory(updated)
    localStorage.setItem('neuraleye_history', JSON.stringify(updated))
    toast.success('Entry removed')
  }

  const handleClearHistory = () => {
    setHistory([])
    localStorage.removeItem('neuraleye_history')
    toast.success('History cleared')
  }

  const handleLogout = () => {
    localStorage.removeItem('neuraleye_user')
    toast.success('Logged out')
    navigate('/')
  }

  const avgConfidence = history.length
    ? Math.round(history.reduce((sum, h) => sum + (h.confidence || 0), 0) / history.length * 100)
    : 0

  const sections = {
    dashboard: (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-bold text-white mb-1">Overview</h2>
          <p className="text-slate-500 text-sm">Your activity summary</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={FiImage} label="Total Scans" value={history.length} color="cyan" delay={0} />
          <StatCard icon={FiCheckCircle} label="Avg Confidence" value={`${avgConfidence}%`} color="green" delay={0.1} />
          <StatCard icon={FiTrendingUp} label="This Session" value={history.length} color="purple" delay={0.2} />
        </div>

        {/* Recent results */}
        <div className="glass rounded-2xl border border-cyan-500/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800/60">
            <h3 className="text-slate-200 font-semibold text-sm">Recent Predictions</h3>
          </div>
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <FiZap className="text-2xl mx-auto mb-2 text-slate-700" />
              No predictions yet. Upload an image to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/60">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Image</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Prediction</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Confidence</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Time</th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 5).map((item, i) => (
                    <HistoryRow key={i} item={item} index={i} onDelete={handleDeleteHistory} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    ),

    upload: (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="font-display text-xl font-bold text-white mb-1">Upload & Detect</h2>
          <p className="text-slate-500 text-sm">Upload an image and run AI detection</p>
        </div>
        <UploadBox onNewResult={handleNewResult} />
      </div>
    ),

    history: (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-1">Prediction History</h2>
            <p className="text-slate-500 text-sm">{history.length} total predictions</p>
          </div>
          {history.length > 0 && (
            <button onClick={handleClearHistory} className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors">
              <FiTrash2 /> Clear All
            </button>
          )}
        </div>

        <div className="glass rounded-2xl border border-cyan-500/10 overflow-hidden">
          {history.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <FiClock className="text-3xl mx-auto mb-3 text-slate-700" />
              <p className="text-sm">No history yet</p>
              <button onClick={() => setActiveSection('upload')} className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                Make your first prediction →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/60 bg-slate-900/40">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Image</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Prediction</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Confidence</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Time</th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, i) => (
                    <HistoryRow key={i} item={item} index={i} onDelete={handleDeleteHistory} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    ),
  }

  return (
    <div className="min-h-screen bg-slate-950 grid-bg flex">
      {/* Desktop sidebar */}
      <Sidebar role="user" activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden"
            >
              <Sidebar role="user" activeSection={activeSection} setActiveSection={(s) => { setActiveSection(s); setMobileSidebarOpen(false) }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass border-b border-cyan-500/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <FiMenu size={20} />
            </button>
            <div>
              <h1 className="text-slate-100 font-semibold text-sm capitalize">{activeSection}</h1>
              <p className="text-slate-500 text-xs">User Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {(user?.name || user?.email || 'U')[0].toUpperCase()}
              </div>
              <span className="text-slate-300 text-sm">{user?.name || user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-500/10"
            >
              <FiLogOut className="text-sm" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {/* Welcome banner */}
          {activeSection === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-lg">
                  <FiZap />
                </div>
                <div>
                  <p className="text-white font-semibold">Welcome back, {user?.name || 'Explorer'}! 👋</p>
                  <p className="text-slate-400 text-sm">Ready to analyze some images?{' '}
                    <button onClick={() => setActiveSection('upload')} className="text-cyan-400 hover:underline">
                      Upload one now →
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {sections[activeSection] || sections.dashboard}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}