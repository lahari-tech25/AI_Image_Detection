import React from 'react'
import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, trend, color = 'cyan', delay = 0 }) {
  const colorMap = {
    cyan:   { bg: 'from-cyan-500/20 to-cyan-600/10',   border: 'border-cyan-500/20',   text: 'text-cyan-400',   icon: 'bg-cyan-500/15 text-cyan-400',   glow: 'shadow-cyan-500/20' },
    purple: { bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20', text: 'text-purple-400', icon: 'bg-purple-500/15 text-purple-400', glow: 'shadow-purple-500/20' },
    rose:   { bg: 'from-rose-500/20 to-rose-600/10',   border: 'border-rose-500/20',   text: 'text-rose-400',   icon: 'bg-rose-500/15 text-rose-400',   glow: 'shadow-rose-500/20' },
    green:  { bg: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: 'bg-emerald-500/15 text-emerald-400', glow: 'shadow-emerald-500/20' },
    orange: { bg: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/20', text: 'text-orange-400', icon: 'bg-orange-500/15 text-orange-400', glow: 'shadow-orange-500/20' },
  }

  const c = colorMap[color] || colorMap.cyan

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border} p-5 shadow-xl ${c.glow} shadow-lg`}
    >
      {/* Background glow */}
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full ${c.icon} blur-2xl opacity-50`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">{label}</p>
          <p className={`text-3xl font-bold font-display ${c.text}`}>{value ?? '—'}</p>
          {trend !== undefined && (
            <p className={`text-xs mt-1 ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% this week
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center text-lg`}>
            <Icon />
          </div>
        )}
      </div>
    </motion.div>
  )
}