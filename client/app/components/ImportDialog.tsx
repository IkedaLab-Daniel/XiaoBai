"use client"

import { useState } from 'react'
import { X, Upload, AlertCircle, CheckCircle } from 'lucide-react'
import { importMBTilesFile, validateMBTilesFile } from '../lib/mbtilesParser'
import { Region } from '../lib/mapStorage'

interface ImportDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (region: Region) => void
}

export default function ImportDialog({ isOpen, onClose, onSuccess }: ImportDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setSuccess(false)
    
    const validation = validateMBTilesFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
  }

  const handleImport = async () => {
    if (!selectedFile) return

    setImporting(true)
    setError(null)
    setProgress(0)
    setMessage('Starting import...')

    try {
      const region = await importMBTilesFile(selectedFile, (prog, msg) => {
        setProgress(prog)
        setMessage(msg)
      })

      setSuccess(true)
      setMessage('Import completed successfully!')
      
      setTimeout(() => {
        onSuccess(region)
        handleClose()
      }, 1500)
    } catch (err) {
      setError((err as Error).message)
      setImporting(false)
    }
  }

  const handleClose = () => {
    if (importing) return
    setSelectedFile(null)
    setError(null)
    setSuccess(false)
    setProgress(0)
    setMessage('')
    onClose()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Import Map Data</h2>
          <button
            onClick={handleClose}
            disabled={importing}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* File Input */}
          {!importing && !success && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select MBTiles File
              </label>
              <input
                type="file"
                accept=".mbtiles,.osm.pbf,.pbf"
                onChange={handleFileSelect}
                className="block w-full text-sm text-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100
                  cursor-pointer"
              />
              <p className="mt-2 text-xs text-foreground opacity-60">
                Supported formats: .mbtiles, .osm.pbf (max 500MB)
              </p>
              <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-800 font-medium mb-1">📝 Note:</p>
                <p className="text-xs text-blue-700">
                  <strong>.osm.pbf files</strong> are raw OpenStreetMap data and need to be converted to .mbtiles format first.
                  Use tools like <strong>tilemaker</strong> or <strong>tippecanoe</strong> to convert them.
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  For testing, you can download pre-converted .mbtiles files from:
                  <br/>• <a href="https://openmaptiles.com/" target="_blank" rel="noopener" className="underline">OpenMapTiles</a>
                  <br/>• <a href="https://protomaps.com/" target="_blank" rel="noopener" className="underline">Protomaps</a>
                </p>
              </div>
            </div>
          )}

          {/* Selected File Info */}
          {selectedFile && !importing && !success && (
            <div className="bg-green-50 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Upload size={20} className="text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-foreground opacity-70">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress */}
          {importing && (
            <div className="space-y-3">
              <div className="bg-green-50 rounded-2xl p-4">
                <p className="text-sm font-medium text-foreground mb-2">{message}</p>
                <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-foreground opacity-60 mt-2">
                  {Math.round(progress)}% complete
                </p>
              </div>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Import Successful!</p>
                  <p className="text-sm text-green-700">{message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Import Failed</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {!importing && !success && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-foreground rounded-full font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!selectedFile}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Made with Bob
