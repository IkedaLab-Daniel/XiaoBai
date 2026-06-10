"use client"

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { mapStorage } from '../lib/mapStorage'

interface MapViewProps {
  center?: [number, number]
  zoom?: number
  onLocationSelect?: (lat: number, lng: number) => void
}

export default function MapView({ 
  center = [39.9042, 116.4074], // Beijing default
  zoom = 13,
  onLocationSelect 
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return

    // Initialize map
    const map = L.map(mapContainer.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: false
    })

    // Create custom tile layer class for offline tiles
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const OfflineTileLayer = L.TileLayer.extend({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createTile: function(coords: any, done: any) {
        const tile = document.createElement('img')
        
        // Load tile from IndexedDB
        mapStorage.getTile(coords.z, coords.x, coords.y).then(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            tile.src = url
            tile.onload = () => {
              URL.revokeObjectURL(url)
              done(undefined, tile)
            }
            tile.onerror = () => {
              URL.revokeObjectURL(url)
              this._showPlaceholder(tile, 'Error')
              done(undefined, tile)
            }
          } else {
            this._showPlaceholder(tile, 'No Tile')
            done(undefined, tile)
          }
        }).catch(() => {
          this._showPlaceholder(tile, 'Error')
          done(undefined, tile)
        })

        return tile
      },
      
      _showPlaceholder: function(tile: HTMLImageElement, text: string) {
        const svg = `<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
          <rect width="256" height="256" fill="#f0f0f0"/>
          <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#999" text-anchor="middle" dy=".3em">${text}</text>
        </svg>`
        tile.src = 'data:image/svg+xml;base64,' + btoa(svg)
      }
    })

    // Add offline tile layer
    // @ts-expect-error - Custom tile layer extension
    const offlineLayer = new OfflineTileLayer('', {
      maxZoom: 18,
      minZoom: 0,
    })
    offlineLayer.addTo(map)

    // Add zoom controls
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map)

    // Add scale
    L.control.scale({
      position: 'bottomleft',
      imperial: false
    }).addTo(map)

    // Handle map clicks
    if (onLocationSelect) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng)
      })
    }

    mapInstance.current = map

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [center, zoom, onLocationSelect])

  const getCurrentLocation = () => {
    if (!mapInstance.current) return
    
    setIsLocating(true)
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation([latitude, longitude])
          
          if (mapInstance.current) {
            mapInstance.current.setView([latitude, longitude], 15)
            
            // Add marker for current location
            L.marker([latitude, longitude], {
              icon: L.divIcon({
                className: 'current-location-marker',
                html: '<div style="width: 20px; height: 20px; background: #4CAF50; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
            }).addTo(mapInstance.current)
          }
          
          setIsLocating(false)
        },
        (error) => {
          console.error('Geolocation error:', error)
          alert('Unable to get your location. Please enable location services.')
          setIsLocating(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      alert('Geolocation is not supported by your browser')
      setIsLocating(false)
    }
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-2xl overflow-hidden" />
      
      {/* Location Button */}
      <button
        onClick={getCurrentLocation}
        disabled={isLocating}
        className="absolute bottom-24 right-4 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-colors disabled:opacity-50"
        title="Get current location"
      >
        {isLocating ? (
          <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  )
}

// Made with Bob
