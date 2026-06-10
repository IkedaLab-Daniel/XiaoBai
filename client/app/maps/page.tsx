"use client"

import { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Bookmark, Settings, Upload } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { mapStorage, Region, PREDEFINED_REGIONS } from '../lib/mapStorage'
import ImportDialog from '../components/ImportDialog'
import SavedPlacesView from '../components/SavedPlacesView'

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent mb-2"></div>
        <p className="text-foreground opacity-70">Loading map...</p>
      </div>
    </div>
  )
})

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
            {view === 'map' && <MapViewContainer />}
            {view === 'saved' && <SavedPlacesView />}
          </>
        )}
      </div>
    </div>
  )
}

// Regions View Component
function RegionsView({ installedRegions, onUpdate }: { installedRegions: Region[], onUpdate: () => void }) {
  const [showImportDialog, setShowImportDialog] = useState(false)

  const handleImportSuccess = (region: Region) => {
    setShowImportDialog(false)
    onUpdate()
  }

  const installedIds = new Set(installedRegions.map(r => r.id))

  return (
    <div className="space-y-4">
      {/* Import Button */}
      <button
        onClick={() => setShowImportDialog(true)}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl p-4 flex items-center justify-center gap-2 font-medium transition-colors"
      >
        <Upload size={20} />
        Import Map Data from Files
      </button>

      {/* Import Dialog */}
      <ImportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onSuccess={handleImportSuccess}
      />

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

// Map View Component
function MapViewContainer() {
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null)

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
    // Could show a dialog to save this location
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-sm text-foreground opacity-70 mb-2">
          Tap on the map to select a location and save it to your places.
        </p>
        {selectedLocation && (
          <p className="text-xs text-green-600">
            Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </p>
        )}
      </div>
      
      <div className="h-[60vh] bg-white rounded-2xl overflow-hidden shadow-sm">
        <MapView onLocationSelect={handleLocationSelect} />
      </div>
    </div>
  )
}


// Made with Bob
