"use client"

import { useState, useEffect } from 'react'
import { Bookmark, MapPin, Trash2, Plus, Edit2 } from 'lucide-react'
import { mapStorage, SavedPlace } from '../lib/mapStorage'

export default function SavedPlacesView() {
  const [places, setPlaces] = useState<SavedPlace[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const loadPlaces = async () => {
    try {
      const allPlaces = await mapStorage.getAllPlaces()
      setPlaces(allPlaces)
    } catch (error) {
      console.error('Failed to load places:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlaces()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this saved place?')) return

    try {
      await mapStorage.deletePlace(id)
      setPlaces(places.filter(p => p.id !== id))
    } catch (error) {
      console.error('Failed to delete place:', error)
      alert('Failed to delete place')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent"></div>
        <p className="mt-4 text-foreground opacity-70">Loading saved places...</p>
      </div>
    )
  }

  if (places.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <Bookmark size={48} className="mx-auto text-green-600 mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">No Saved Places</h3>
        <p className="text-foreground opacity-70 mb-4">
          Your bookmarked locations will appear here.
        </p>
        <button
          onClick={() => setShowAddDialog(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors"
        >
          <Plus size={20} />
          Add Place
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">
          {places.length} Saved {places.length === 1 ? 'Place' : 'Places'}
        </h3>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Places List */}
      <div className="space-y-3">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onDelete={() => handleDelete(place.id)}
          />
        ))}
      </div>

      {/* Add Place Dialog */}
      {showAddDialog && (
        <AddPlaceDialog
          onClose={() => setShowAddDialog(false)}
          onSuccess={() => {
            setShowAddDialog(false)
            loadPlaces()
          }}
        />
      )}
    </div>
  )
}

// Place Card Component
function PlaceCard({ place, onDelete }: { place: SavedPlace, onDelete: () => void }) {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      hotel: '🏨',
      restaurant: '🍽️',
      attraction: '🎭',
      transport: '🚇',
      other: '📍'
    }
    return icons[category] || '📍'
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      hotel: 'bg-blue-100 text-blue-700',
      restaurant: 'bg-orange-100 text-orange-700',
      attraction: 'bg-purple-100 text-purple-700',
      transport: 'bg-green-100 text-green-700',
      other: 'bg-gray-100 text-gray-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{getCategoryIcon(place.category)}</div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground mb-1">{place.name}</h4>
          
          <div className="flex items-center gap-2 text-sm text-foreground opacity-70 mb-2">
            <MapPin size={14} />
            <span className="truncate">
              {place.coordinates[1].toFixed(6)}, {place.coordinates[0].toFixed(6)}
            </span>
          </div>

          {place.notes && (
            <p className="text-sm text-foreground opacity-70 mb-2">{place.notes}</p>
          )}

          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(place.category)}`}>
              {place.category}
            </span>
            <span className="text-xs text-foreground opacity-50">
              {new Date(place.created).toLocaleDateString()}
            </span>
          </div>
        </div>

        <button
          onClick={onDelete}
          className="p-2 hover:bg-red-50 rounded-full transition-colors"
          title="Delete place"
        >
          <Trash2 size={18} className="text-red-600" />
        </button>
      </div>
    </div>
  )
}

// Add Place Dialog Component
function AddPlaceDialog({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [name, setName] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [category, setCategory] = useState<SavedPlace['category']>('other')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim() || !latitude || !longitude) {
      alert('Please fill in all required fields')
      return
    }

    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)

    if (isNaN(lat) || isNaN(lng)) {
      alert('Invalid coordinates')
      return
    }

    setSaving(true)

    try {
      const place: SavedPlace = {
        id: Date.now().toString(),
        name: name.trim(),
        coordinates: [lng, lat],
        category,
        notes: notes.trim() || undefined,
        created: new Date(),
        region: 'unknown' // Will be determined based on coordinates
      }

      await mapStorage.savePlace(place)
      onSuccess()
    } catch (error) {
      console.error('Failed to save place:', error)
      alert('Failed to save place')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-foreground mb-4">Add Saved Place</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Forbidden City"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="39.9042"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="116.4074"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SavedPlace['category'])}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="hotel">🏨 Hotel</option>
              <option value="restaurant">🍽️ Restaurant</option>
              <option value="attraction">🎭 Attraction</option>
              <option value="transport">🚇 Transport</option>
              <option value="other">📍 Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this place..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-foreground rounded-full font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Place'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
