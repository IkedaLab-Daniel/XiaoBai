"use client"

import { useState } from 'react'
import { Search, X, MapPin } from 'lucide-react'
import { SavedPlace } from '../lib/mapStorage'

interface MapSearchProps {
  places: SavedPlace[]
  onSelectPlace: (place: SavedPlace) => void
}

export default function MapSearch({ places, onSelectPlace }: MapSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredPlaces = query.trim()
    ? places.filter(place =>
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        place.notes?.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const handleSelect = (place: SavedPlace) => {
    onSelectPlace(place)
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search saved places..."
          className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 text-foreground"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && query && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Results Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-20">
            {filteredPlaces.length > 0 ? (
              <div className="p-2">
                {filteredPlaces.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => handleSelect(place)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{place.name}</p>
                        <p className="text-sm text-foreground opacity-60 truncate">
                          {place.coordinates[1].toFixed(4)}, {place.coordinates[0].toFixed(4)}
                        </p>
                        {place.notes && (
                          <p className="text-xs text-foreground opacity-50 truncate mt-1">
                            {place.notes}
                          </p>
                        )}
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                        {place.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-foreground opacity-60">No places found</p>
                <p className="text-xs text-foreground opacity-40 mt-1">
                  Try a different search term
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Made with Bob
