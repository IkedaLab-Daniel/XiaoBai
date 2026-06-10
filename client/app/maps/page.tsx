"use client"

import { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Search, Bookmark, Settings, Upload, Download } from 'lucide-react'
import Link from 'next/link'
import { mapStorage, Region, PREDEFINED_REGIONS } from '../lib/mapStorage'

export default function MapsPage() {
  const [view, setView] = useState<'map' | 'regions' | 'saved'>('regions')
  const [installedRegions, setInstalledRegions] = useState<Region[]>([])
  const [storageInfo, setStorageInfo] = useState({ usage: 0, quota: 0, percentUsed: 0 })
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const regions = await mapStorage.getAllRegions()
      const storage = await mapStorage.getStorageInfo()
      setInstalledRegions(regions)
      setStorageInfo(storage)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={24} className="text-foreground" />
              </button>
            </Link>
            <h1 className="text-xl font-bold text-foreground">XiaoBai's Map</h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Settings size={24} className="text-foreground" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={() => setView('regions')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              view === 'regions'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500'
            }`}
          >
            Regions
          </button>
          <button
            onClick={() => setView('map')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              view === 'map'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500'
            }`}
          >
            Map View
          </button>
          <button
            onClick={() => setView('saved')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              view === 'saved'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500'
            }`}
          >
            Saved Places
          </button>
        </div>
      </div>

      {/* Storage Info Bar */}
      <div className="bg-green-50 px-4 py-3 border-b border-green-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground">Storage Used</span>
          <span className="font-medium text-green-700">
            {formatBytes(storageInfo.usage)} / {formatBytes(storageInfo.quota)}
          </span>
        </div>
        <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 transition-all duration-300"
            style={{ width: `${Math.min(storageInfo.percentUsed, 100)}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent"></div>
            <p className="mt-4 text-foreground opacity-70">Loading...</p>
          </div>
        ) : (
          <>
            {view === 'regions' && <RegionsView installedRegions={installedRegions} onUpdate={loadData} />}
            {view === 'map' && <MapView />}
            {view === 'saved' && <SavedPlacesView />}
          </>
        )}
      </div>
    </div>
  )
}

// Regions View Component
function RegionsView({ installedRegions, onUpdate }: { installedRegions: Region[], onUpdate: () => void }) {
  const [importing, setImporting] = useState(false)

  const handleImport = async () => {
    setImporting(true)
    try {
      // Create file input element
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.mbtiles,.json'
      input.multiple = true
      
      input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement).files
        if (files) {
          // Process files here
          alert(`Selected ${files.length} file(s). Import functionality will be implemented.`)
          onUpdate()
        }
      }
      
      input.click()
    } catch (error) {
      console.error('Import failed:', error)
      alert('Failed to import map data')
    } finally {
      setImporting(false)
    }
  }

  const installedIds = new Set(installedRegions.map(r => r.id))

  return (
    <div className="space-y-4">
      {/* Import Button */}
      <button
        onClick={handleImport}
        disabled={importing}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl p-4 flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50"
      >
        <Upload size={20} />
        {importing ? 'Importing...' : 'Import Map Data from Files'}
      </button>

      {/* Installed Regions */}
      {installedRegions.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-3">Installed Regions</h3>
          <div className="space-y-3">
            {installedRegions.map((region) => (
              <RegionCard key={region.id} region={region} installed={true} onUpdate={onUpdate} />
            ))}
          </div>
        </div>
      )}

      {/* Available Regions */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">Available Regions</h3>
        <div className="space-y-3">
          {PREDEFINED_REGIONS.filter(r => !installedIds.has(r.id)).map((region) => (
            <RegionCard
              key={region.id}
              region={{ ...region, installed: false, lastUsed: new Date() }}
              installed={false}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Region Card Component
function RegionCard({ region, installed, onUpdate }: { region: Region, installed: boolean, onUpdate: () => void }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete ${region.name}? This will free up ${formatBytes(region.size)}.`)) return
    
    setDeleting(true)
    try {
      await mapStorage.deleteRegion(region.id)
      onUpdate()
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete region')
    } finally {
      setDeleting(false)
    }
  }

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return mb.toFixed(0) + ' MB'
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={18} className={installed ? 'text-green-600' : 'text-gray-400'} />
            <h4 className="font-bold text-foreground">{region.name}</h4>
          </div>
          <p className="text-sm text-foreground opacity-70">{region.country}</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-foreground opacity-60">
            <span>{formatBytes(region.size)}</span>
            <span>•</span>
            <span>{region.tileCount.toLocaleString()} tiles</span>
          </div>
        </div>
        
        {installed ? (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        ) : (
          <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
            Not Installed
          </div>
        )}
      </div>
    </div>
  )
}

// Map View Component (Placeholder)
function MapView() {
  return (
    <div className="bg-white rounded-2xl p-8 text-center">
      <MapPin size={48} className="mx-auto text-green-600 mb-4" />
      <h3 className="text-xl font-bold text-foreground mb-2">Map View</h3>
      <p className="text-foreground opacity-70 mb-4">
        Interactive map will be displayed here once regions are installed.
      </p>
      <p className="text-sm text-foreground opacity-50">
        Install a region to start exploring offline maps.
      </p>
    </div>
  )
}

// Saved Places View Component (Placeholder)
function SavedPlacesView() {
  return (
    <div className="bg-white rounded-2xl p-8 text-center">
      <Bookmark size={48} className="mx-auto text-green-600 mb-4" />
      <h3 className="text-xl font-bold text-foreground mb-2">Saved Places</h3>
      <p className="text-foreground opacity-70 mb-4">
        Your bookmarked locations will appear here.
      </p>
      <p className="text-sm text-foreground opacity-50">
        Save places while exploring the map to access them quickly.
      </p>
    </div>
  )
}

// Made with Bob
