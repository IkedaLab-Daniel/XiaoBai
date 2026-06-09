"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapboxViewProps {
  center?: [number, number]
  zoom?: number
  onLocationSelect?: (lat: number, lng: number) => void
}

export default function MapboxView({ 
  center = [116.4074, 39.9042], // Beijing default [lat, lng]
  zoom = 13,
  onLocationSelect 
}: MapboxViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // For now, use online tiles with a note about offline support
    // Vector tile rendering from IndexedDB requires a custom tile server or protocol handler
    // which is complex to implement in the browser
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', // Free, no API key needed
      center: [center[1], center[0]], // Mapbox uses [lng, lat]
      zoom: zoom,
      attributionControl: false
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left')

    // Handle map clicks
    if (onLocationSelect) {
      map.current.on('click', (e) => {
        onLocationSelect(e.lngLat.lat, e.lngLat.lng)
      })
    }

    console.log('Mapbox GL map initialized')
    console.log('Note: Offline vector tiles require a tile server. Using online tiles for now.')

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [center, zoom, onLocationSelect])

  const getCurrentLocation = () => {
    if (!map.current) return
    
    setIsLocating(true)
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation([latitude, longitude])
          map.current?.flyTo({
            center: [longitude, latitude],
            zoom: 15
          })
          setIsLocating(false)
        },
        (error) => {
          console.error('Geolocation error:', error)
          alert('Unable to get your location')
          setIsLocating(false)
        }
      )
    } else {
      alert('Geolocation is not supported by your browser')
      setIsLocating(false)
    }
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Location Button */}
      <button
        onClick={getCurrentLocation}
        disabled={isLocating}
        className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 z-10"
        title="Get current location"
      >
        <svg
          className={`w-5 h-5 text-gray-700 ${isLocating ? 'animate-pulse' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Current Location Marker */}
      {currentLocation && (
        <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg text-sm z-10">
          <p className="text-gray-600">Current Location:</p>
          <p className="font-mono text-xs">
            {currentLocation[0].toFixed(6)}, {currentLocation[1].toFixed(6)}
          </p>
        </div>
      )}
    </div>
  )
}

// Made with Bob
