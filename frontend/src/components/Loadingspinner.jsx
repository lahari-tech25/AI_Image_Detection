import React from 'react'
import { motion } from 'framer-motion'

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizes[size]} rounded-full border-2 border-cyan-500/20`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{ borderTopColor: '#00d4ff' }}
        />
        {/* Inner ring */}
        <motion.div
          className={`absolute inset-1 rounded-full border-2 border-purple-500/20`}
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ borderTopColor: '#a855f7' }}
        />
        {/* Center dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </motion.div>
      </div>
      {text && (
        <motion.p
          className="text-slate-400 text-sm font-body"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

// Full-page loading overlay
export function PageLoader({ text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-slate-300 font-body text-sm">{text}</p>
      </div>
    </div>
  )
}

// Inline button spinner
export function ButtonSpinner() {
  return (
    <motion.div
      className="w-4 h-4 rounded-full border-2 border-white/30"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{ borderTopColor: 'white' }}
    />
  )
}