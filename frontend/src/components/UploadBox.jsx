import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUploadCloud, FiImage, FiX, FiZap } from 'react-icons/fi'
import { predictImage } from '../services/api'
import toast from 'react-hot-toast'
import { ButtonSpinner } from './LoadingSpinner'
import ResultCard from './ResultCard'

export default function UploadBox({ onNewResult }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const onDrop = useCallback((accepted) => {
    const f = accepted[0]
    if (!f) return
    setFile(f)
    setResult(null)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: () => toast.error('Invalid file. Use images under 10MB.'),
  })

  const handlePredict = async () => {
    if (!file) return
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await predictImage(form)
      const data = res.data
      const resultObj = {
        prediction: data.prediction || data.label || data.class,
        confidence: data.confidence ?? data.score ?? 0,
        imageUrl: preview,
        timestamp: new Date().toISOString(),
        filename: file.name,
      }
      setResult(resultObj)
      if (onNewResult) onNewResult(resultObj)
      toast.success('Detection complete!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Prediction failed. Check server.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
  }

  return (
    <div className="space-y-5">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
          isDragActive
            ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
            : 'border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/5 bg-slate-900/40'
        }`}
      >
        <input {...getInputProps()} />

        {/* Scan line when dragging */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ top: '-10%' }}
              animate={{ top: '110%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-10 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full h-64 object-contain bg-slate-900/60 rounded-xl" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleClear() }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-800/90 border border-slate-600 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all flex items-center justify-center"
            >
              <FiX />
            </button>
            <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-1.5 text-xs text-slate-300 flex items-center gap-1.5">
              <FiImage className="text-cyan-400" />
              {file?.name}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
            <motion.div
              animate={{ y: isDragActive ? -8 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400 text-2xl"
            >
              <FiUploadCloud />
            </motion.div>
            <p className="text-slate-300 font-semibold mb-1">
              {isDragActive ? 'Drop your image here' : 'Drag & drop image here'}
            </p>
            <p className="text-slate-500 text-sm">or click to browse — PNG, JPG, WEBP up to 10MB</p>
          </div>
        )}
      </div>

      {/* Predict Button */}
      <AnimatePresence>
        {file && !result && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={handlePredict}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2.5 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <ButtonSpinner />
                Analyzing Image...
              </>
            ) : (
              <>
                <FiZap className="text-lg" />
                Run AI Detection
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <ResultCard
            prediction={result.prediction}
            confidence={result.confidence}
            imageUrl={result.imageUrl}
            timestamp={result.timestamp}
          />
        )}
      </AnimatePresence>
    </div>
  )
}