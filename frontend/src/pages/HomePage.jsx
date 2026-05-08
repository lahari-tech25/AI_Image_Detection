import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiZap, FiShield, FiCpu, FiEye, FiArrowRight,
  FiGithub, FiLayers, FiTarget, FiTrendingUp
} from 'react-icons/fi'
import Navbar from '../components/Navbar'

const features = [
  {
    icon: FiCpu,
    title: 'Neural Processing',
    desc: 'Deep learning models trained on millions of images for unparalleled accuracy.',
    color: 'cyan',
  },
  {
    icon: FiZap,
    title: 'Real-Time Detection',
    desc: 'Sub-second inference powered by optimized FastAPI backend deployment.',
    color: 'purple',
  },
  {
    icon: FiShield,
    title: 'Secure & Private',
    desc: 'JWT authentication, role-based access control, and encrypted data pipelines.',
    color: 'rose',
  },
  {
    icon: FiTarget,
    title: 'High Precision',
    desc: 'Confidence scoring with detailed per-class probability breakdowns.',
    color: 'emerald',
  },
  {
    icon: FiLayers,
    title: 'Multi-Class Support',
    desc: 'Detect and classify hundreds of object categories in a single pass.',
    color: 'orange',
  },
  {
    icon: FiTrendingUp,
    title: 'Analytics Dashboard',
    desc: 'Track your predictions, monitor trends, and visualize model performance.',
    color: 'blue',
  },
]

const colorMap = {
  cyan:    'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400',
  purple:  'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400',
  rose:    'from-rose-500/20 to-rose-600/5 border-rose-500/20 text-rose-400',
  emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
  orange:  'from-orange-500/20 to-orange-600/5 border-orange-500/20 text-orange-400',
  blue:    'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
}

// Animated floating particle
function Particle({ style }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-cyan-400/40"
      style={style}
      animate={{ y: [-20, 20, -20], opacity: [0.2, 0.8, 0.2] }}
      transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 4 }}
    />
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('neuraleye_user') || 'null')

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : '/user')
  }, [])

  const particles = Array.from({ length: 24 }, (_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
  }))

  return (
    <div className="min-h-screen animated-gradient grid-bg relative overflow-hidden">
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((style, i) => <Particle key={i} style={style} />)}
      </div>

      {/* Glow orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/25 text-cyan-400 text-xs font-semibold font-mono mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            AI-Powered Image Intelligence Platform
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight"
          >
            <span className="text-white">See Beyond with</span>
            <br />
            <span className="gradient-text">Neural Vision</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-body"
          >
            Upload any image and let our deep learning models classify, detect, and analyze
            with real-time confidence scoring and detailed results.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
              Get Started Free <FiArrowRight />
            </Link>
            <Link to="/login" className="btn-secondary flex items-center gap-2 text-base px-8 py-4">
              Sign In
            </Link>
          </motion.div>

          {/* Floating hero image / visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-20 float-anim"
          >
            <div className="relative max-w-3xl mx-auto">
              <div className="glass rounded-3xl p-1 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 pulse-glow">
                {/* Mock dashboard preview */}
                <div className="bg-slate-900/80 rounded-[calc(1.5rem-4px)] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <div className="flex-1 mx-4 h-5 bg-slate-800 rounded-md" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {['Total Scans: 1,284', 'Accuracy: 97.3%', 'Active Users: 42'].map((item, i) => (
                      <div key={i} className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-center">
                        <p className="text-cyan-400 text-xs font-mono font-bold">{item.split(': ')[1]}</p>
                        <p className="text-slate-500 text-xs mt-1">{item.split(': ')[0]}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <div className="w-40 h-28 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center justify-center">
                      <div className="text-center">
                        <FiEye className="text-cyan-400 text-2xl mx-auto mb-1" />
                        <p className="text-slate-400 text-xs">Drop Image</p>
                      </div>
                    </div>
                    <div className="flex-1 bg-slate-800/60 rounded-xl border border-slate-700/50 p-3">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-slate-300 text-xs font-semibold">Prediction: <span className="text-cyan-400">Cat</span></p>
                        <span className="text-xs font-mono text-emerald-400">94.8%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '94.8%' }}
                          transition={{ delay: 1.5, duration: 1.2, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        />
                      </div>
                      <div className="mt-3 space-y-1.5">
                        {[['Dog', '3.1%', 'w-[3%]'], ['Bird', '1.6%', 'w-[2%]'], ['Rabbit', '0.5%', 'w-[1%]']].map(([label, pct, w]) => (
                          <div key={label} className="flex items-center gap-2">
                            <p className="text-slate-500 text-xs w-12">{label}</p>
                            <div className="flex-1 h-1 bg-slate-700 rounded-full">
                              <div className={`${w} h-full bg-slate-500 rounded-full`} />
                            </div>
                            <p className="text-slate-500 text-xs w-8 text-right">{pct}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">Platform Features</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Built for AI-Scale Vision
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Everything you need to deploy, monitor, and scale image detection workflows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color }, i) => {
              const c = colorMap[color]
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className={`rounded-2xl bg-gradient-to-br ${c} border p-6 backdrop-blur-sm`}
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c} border flex items-center justify-center mb-4 text-lg`}>
                    <Icon />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl border border-cyan-500/20 p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 relative">
              Start Detecting Today
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto relative">
              Join thousands of developers using NeuralEye for production image intelligence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              <Link to="/register" className="btn-primary flex items-center gap-2 px-8 py-4">
                Create Free Account <FiArrowRight />
              </Link>
              <Link to="/login" className="btn-secondary px-8 py-4">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-cyan-500/10 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <FiEye className="text-white text-xs" />
            </div>
            <span className="font-display text-sm font-bold text-white tracking-wider">
              NEURAL<span className="text-cyan-400">EYE</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm">© 2024 NeuralEye. AI Image Detection Platform.</p>
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <Link to="/login" className="hover:text-cyan-400 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-cyan-400 transition-colors">Register</Link>
            <a href="#" className="hover:text-cyan-400 transition-colors"><FiGithub /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}