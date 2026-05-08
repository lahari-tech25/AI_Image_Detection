import React from 'react'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiAlertTriangle, FiImage } from 'react-icons/fi'

export default function ResultCard({ prediction, confidence, imageUrl, timestamp }) {
  if (!prediction) return null

  const pct = Math.round((confidence || 0) * 100)
  const isHigh = pct >= 80
  const isMed = pct >= 50 && pct < 80

  const barColor = isHigh ? 'from-emerald-400 to-cyan-400' : isMed ? 'from-yellow-400 to-orange-400' : 'from-rose-400 to-pink-400'
  const badgeColor = isHigh ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' : isMed ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25' : 'bg-rose-500/15 text-rose-400 border-rose-500/25'
  const Icon = isHigh ? FiCheckCircle : FiAlertTriangle

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl overflow-hidden border border-cyan-500/15 shadow-xl shadow-black/40"
    >
      {/* Image preview */}
      {imageUrl && (
        <div className="relative h-40 bg-slate-900 overflow-hidden">
          <img src={imageUrl} alt="Analyzed" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-slate-400 text-xs">
            <FiImage /> Analyzed Image
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1 font-semibold">Detection Result</p>
            <p className="text-slate-100 text-lg font-bold capitalize">{prediction}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold ${badgeColor}`}>
            <Icon className="text-sm" />
            {pct}%
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Confidence</span>
            <span className="font-mono">{pct}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className={`h-full rounded-full bg-gradient-to-r ${barColor} shadow-lg`}
            />
          </div>
        </div>

        {/* Timestamp */}
        {timestamp && (
          <p className="mt-3 text-slate-600 text-xs font-mono">
            {new Date(timestamp).toLocaleString()}
          </p>
        )}
      </div>
    </motion.div>
  )
}