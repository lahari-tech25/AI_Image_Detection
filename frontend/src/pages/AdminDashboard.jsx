import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiUsers, FiBarChart2, FiDatabase, FiClock,
  FiGrid, FiTrendingUp, FiCheckCircle, FiAlertTriangle,
  FiMenu, FiLogOut, FiRefreshCw, FiDownload,
  FiUploadCloud, FiShield, FiActivity
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import { getStats, getUsers, getPredictions } from '../services/api'
import { ButtonSpinner } from '../components/LoadingSpinner'

// Mock data for demo (replace with real API data)
const MOCK_USERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'user', predictions: 47, joined: '2024-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user', predictions: 23, joined: '2024-01-22' },
  { id: 3, name: 'Carol Admin', email: 'carol@example.com', role: 'admin', predictions: 112, joined: '2023-12-01' },
  { id: 4, name: 'David Lee', email: 'david@example.com', role: 'user', predictions: 8, joined: '2024-02-05' },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', role: 'user', predictions: 64, joined: '2024-01-30' },
]

const MOCK_PREDICTIONS = [
  { id: 1, user: 'alice@example.com', label: 'Cat', confidence: 0.947, time: new Date().toISOString() },
  { id: 2, user: 'bob@example.com', label: 'Airplane', confidence: 0.823, time: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, user: 'david@example.com', label: 'Dog', confidence: 0.761, time: new Date(Date.now() - 7200000).toISOString() },
  { id: 4, user: 'eva@example.com', label: 'Car', confidence: 0.912, time: new Date(Date.now() - 10800000).toISOString() },
  { id: 5, user: 'alice@example.com', label: 'Bird', confidence: 0.654, time: new Date(Date.now() - 14400000).toISOString() },
]

function UserRow({ user, index }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <p className="text-slate-200 text-sm font-medium">{user.name}</p>
            <p className="text-slate-500 text-xs">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
          user.role === 'admin'
            ? 'bg-purple-500/15 text-purple-400 border-purple-500/25'
            : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25'
        }`}>
          {user.role === 'admin' ? <FiShield className="inline mr-1" /> : null}
          {user.role}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="text-slate-300 text-sm font-mono">{user.predictions}</span>
      </td>
      <td className="py-3 px-4 text-slate-500 text-xs font-mono">{user.joined}</td>
      <td className="py-3 px-4">
        <span className="px-2 py-1 rounded-md text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
      </td>
    </motion.tr>
  )
}

function PredictionRow({ item, index }) {
  const pct = Math.round(item.confidence * 100)
  const isHigh = pct >= 80
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
    >
      <td className="py-3 px-4 text-slate-500 text-xs font-mono">#{item.id}</td>
      <td className="py-3 px-4 text-slate-400 text-xs">{item.user}</td>
      <td className="py-3 px-4">
        <span className="text-cyan-400 font-semibold text-sm capitalize">{item.label}</span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${isHigh ? 'bg-emerald-400' : pct >= 60 ? 'bg-yellow-400' : 'bg-rose-400'}`} style={{ width: `${pct}%` }} />
          </div>
          <span className={`text-xs font-mono ${isHigh ? 'text-emerald-400' : pct >= 60 ? 'text-yellow-400' : 'text-rose-400'}`}>{pct}%</span>
        </div>
      </td>
      <td className="py-3 px-4 text-slate-500 text-xs font-mono">{new Date(item.time).toLocaleString()}</td>
    </motion.tr>
  )
}

// Simple bar chart
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.value))
  return (
    <div className="flex items-end gap-2 h-24">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / max) * 100}%` }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="w-full rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400 min-h-[4px]"
          />
          <p className="text-slate-500 text-xs">{d.label}</p>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('neuraleye_user') || 'null')
  const [activeSection, setActiveSection] = useState('overview')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ users: 5, predictions: 254, accuracy: 91.3 })
  const [users, setUsers] = useState(MOCK_USERS)
  const [predictions, setPredictions] = useState(MOCK_PREDICTIONS)

  const handleLogout = () => {
    localStorage.removeItem('neuraleye_user')
    toast.success('Logged out')
    navigate('/')
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [sRes, uRes, pRes] = await Promise.allSettled([getStats(), getUsers(), getPredictions()])
      if (sRes.status === 'fulfilled') setStats(sRes.value.data)
      if (uRes.status === 'fulfilled') setUsers(uRes.value.data)
      if (pRes.status === 'fulfilled') setPredictions(pRes.value.data)
      toast.success('Data refreshed')
    } catch {
      toast('Using demo data — connect your FastAPI server', { icon: 'ℹ️' })
    } finally {
      setLoading(false)
    }
  }

  const weeklyData = [
    { label: 'Mon', value: 32 }, { label: 'Tue', value: 48 }, { label: 'Wed', value: 27 },
    { label: 'Thu', value: 61 }, { label: 'Fri', value: 44 }, { label: 'Sat', value: 19 },
    { label: 'Sun', value: 23 },
  ]

  const sections = {
    overview: (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-1">Platform Overview</h2>
            <p className="text-slate-500 text-sm">Real-time analytics and system health</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm transition-colors px-3 py-2 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 disabled:opacity-50"
          >
            {loading ? <ButtonSpinner /> : <FiRefreshCw className={loading ? 'animate-spin' : ''} />}
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FiUsers} label="Total Users" value={stats.users || users.length} color="cyan" trend={12} delay={0} />
          <StatCard icon={FiActivity} label="Total Predictions" value={stats.predictions || predictions.length} color="purple" trend={8} delay={0.1} />
          <StatCard icon={FiCheckCircle} label="Avg Accuracy" value={`${stats.accuracy || 91.3}%`} color="green" trend={2} delay={0.2} />
          <StatCard icon={FiTrendingUp} label="This Week" value={254} color="orange" trend={15} delay={0.3} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Weekly chart */}
          <div className="glass rounded-2xl border border-cyan-500/10 p-5">
            <h3 className="text-slate-200 font-semibold text-sm mb-4">Weekly Predictions</h3>
            <MiniBarChart data={weeklyData} />
          </div>

          {/* Top predictions */}
          <div className="glass rounded-2xl border border-cyan-500/10 p-5">
            <h3 className="text-slate-200 font-semibold text-sm mb-4">Top Categories</h3>
            <div className="space-y-3">
              {[['Cat', 0.78], ['Dog', 0.65], ['Car', 0.52], ['Bird', 0.38], ['Airplane', 0.25]].map(([label, val]) => (
                <div key={label} className="flex items-center gap-3">
                  <p className="text-slate-400 text-xs w-16">{label}</p>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    />
                  </div>
                  <p className="text-cyan-400 text-xs font-mono w-8">{Math.round(val * 100)}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="glass rounded-2xl border border-cyan-500/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800/60 flex justify-between items-center">
            <h3 className="text-slate-200 font-semibold text-sm">Recent Predictions</h3>
            <button onClick={() => setActiveSection('predictions')} className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors">View all →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60 bg-slate-900/40">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">ID</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">User</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Label</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Confidence</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody>
                {predictions.slice(0, 5).map((p, i) => <PredictionRow key={p.id} item={p} index={i} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),

    users: (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-1">User Management</h2>
            <p className="text-slate-500 text-sm">{users.length} registered accounts</p>
          </div>
          <button onClick={fetchData} disabled={loading} className="btn-primary text-sm py-2 px-4 flex items-center gap-2 disabled:opacity-50">
            {loading ? <ButtonSpinner /> : <FiRefreshCw />} Refresh
          </button>
        </div>
        <div className="glass rounded-2xl border border-cyan-500/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60 bg-slate-900/40">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">User</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Role</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Predictions</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Joined</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => <UserRow key={u.id} user={u} index={i} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),

    analytics: (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-bold text-white mb-1">Analytics</h2>
          <p className="text-slate-500 text-sm">Platform performance metrics</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={FiBarChart2} label="Daily Avg" value="36" color="cyan" delay={0} />
          <StatCard icon={FiAlertTriangle} label="Low Confidence" value="12%" color="rose" delay={0.1} />
          <StatCard icon={FiCheckCircle} label="High Confidence" value="71%" color="green" delay={0.2} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass rounded-2xl border border-cyan-500/10 p-5">
            <h3 className="text-slate-200 font-semibold text-sm mb-5">Daily Activity (Last 7 Days)</h3>
            <MiniBarChart data={weeklyData} />
          </div>
          <div className="glass rounded-2xl border border-cyan-500/10 p-5">
            <h3 className="text-slate-200 font-semibold text-sm mb-5">Confidence Distribution</h3>
            <div className="space-y-3">
              {[['90–100%', 0.42, 'emerald'], ['70–89%', 0.29, 'cyan'], ['50–69%', 0.17, 'yellow'], ['< 50%', 0.12, 'rose']].map(([label, val, color]) => (
                <div key={label} className="flex items-center gap-3">
                  <p className="text-slate-400 text-xs w-16">{label}</p>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val * 100}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full bg-${color}-400`}
                    />
                  </div>
                  <p className="text-slate-400 text-xs font-mono w-8">{Math.round(val * 100)}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),

    dataset: (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="font-display text-xl font-bold text-white mb-1">Dataset Management</h2>
          <p className="text-slate-500 text-sm">Upload and manage training datasets</p>
        </div>
        <div className="glass rounded-2xl border border-dashed border-cyan-500/30 p-12 text-center hover:border-cyan-500/50 transition-colors cursor-pointer group">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-cyan-400 text-2xl group-hover:bg-cyan-500/20 transition-colors">
            <FiUploadCloud />
          </div>
          <p className="text-slate-300 font-semibold mb-1">Upload Dataset Archive</p>
          <p className="text-slate-500 text-sm mb-4">ZIP, TAR — Max 500MB</p>
          <button className="btn-primary text-sm py-2 px-5 flex items-center gap-2 mx-auto">
            <FiUploadCloud /> Select Dataset
          </button>
        </div>
        <div className="glass rounded-2xl border border-cyan-500/10 p-5">
          <h3 className="text-slate-200 font-semibold text-sm mb-4">Existing Datasets</h3>
          <div className="space-y-3">
            {[['ImageNet-subset-v2.zip', '247 MB', '12,450 images', '2024-01-15'], ['CIFAR-10-custom.tar', '163 MB', '8,200 images', '2024-01-08']].map(([name, size, count, date]) => (
              <div key={name} className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center text-sm">
                    <FiDatabase />
                  </div>
                  <div>
                    <p className="text-slate-200 text-sm font-medium">{name}</p>
                    <p className="text-slate-500 text-xs">{size} · {count} · {date}</p>
                  </div>
                </div>
                <button className="text-slate-500 hover:text-cyan-400 transition-colors">
                  <FiDownload />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    predictions: (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-bold text-white mb-1">All Predictions</h2>
          <p className="text-slate-500 text-sm">{predictions.length} total records</p>
        </div>
        <div className="glass rounded-2xl border border-cyan-500/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60 bg-slate-900/40">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">ID</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">User</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Label</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Confidence</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((p, i) => <PredictionRow key={p.id} item={p} index={i} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
  }

 

  return (
    <div className="min-h-screen bg-slate-950 grid-bg flex">
      {/* Desktop sidebar */}
      <Sidebar role="admin" activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Mobile overlay */}
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
              <Sidebar role="admin" activeSection={activeSection} setActiveSection={(s) => { setActiveSection(s); setMobileSidebarOpen(false) }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-cyan-500/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-cyan-400 transition-colors">
              <FiMenu size={20} />
            </button>
            <div>
              <h1 className="text-slate-100 font-semibold text-sm capitalize">{activeSection}</h1>
              <p className="text-slate-500 text-xs">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                {(user?.name || 'A')[0].toUpperCase()}
              </div>
              <span className="text-slate-300 text-sm">{user?.name || 'Admin'}</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/15 text-purple-400 border border-purple-500/20 font-mono">admin</span>
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

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Admin banner */}
          {activeSection === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-600/10 border border-purple-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 text-lg">
                  <FiShield />
                </div>
                <div>
                  <p className="text-white font-semibold">Admin Control Panel</p>
                  <p className="text-slate-400 text-sm">Full platform visibility. Manage users, datasets, and monitor AI performance.</p>
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
              {sections[activeSection] || sections.overview}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}