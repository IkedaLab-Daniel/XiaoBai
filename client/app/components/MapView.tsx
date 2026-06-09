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
  const [cacheStats, setCacheStats] = useState({ cached: 0, total: 0 })
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return

    // Monitor online/offline status
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Initialize map
    const map = L.map(mapContainer.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: false
    })

    console.log('🗺️ Initializing smart caching tile layer...')
    
    // Create custom tile layer with caching
    const CachingTileLayer = L.TileLayer.extend({
      createTile: function(coords: L.Coords, done: L.DoneCallback) {
        const tile = document.createElement('img')
        const url = this.getTileUrl(coords)
        
        // Try to load from cache first
        mapStorage.getTile(coords.z, coords.x, coords.y).then(cachedBlob => {
          if (cachedBlob) {
            // Load from cache
            const cachedUrl = URL.createObjectURL(cachedBlob)
            tile.onload = () => {
              URL.revokeObjectURL(cachedUrl)
              done(undefined, tile)
            }
            tile.src = cachedUrl
            
            // Update stats
            setCacheStats(prev => ({ ...prev, cached: prev.cached + 1, total: prev.total + 1 }))
          } else if (navigator.onLine) {
            // Download from online source
            fetch(url)
              .then(response => response.blob())
              .then(blob => {
                // Save to cache for offline use
                mapStorage.saveTile(coords.z, coords.x, coords.y, blob, 'online-cache')
                  .then(() => {
                    console.log(`💾 Cached tile: ${coords.z}/${coords.x}/${coords.y}`)
                  })
                
                // Display tile
                const blobUrl = URL.createObjectURL(blob)
                tile.onload = () => {
                  URL.revokeObjectURL(blobUrl)
                  done(undefined, tile)
                }
                tile.onerror = () => {
                  URL.revokeObjectURL(blobUrl)
                  done(new Error('Tile load error'), tile)
                }
                tile.src = blobUrl
                
                // Update stats
                setCacheStats(prev => ({ ...prev, total: prev.total + 1 }))
              })
              .catch(err => {
                console.error('Failed to download tile:', err)
                // Show placeholder
                tile.src = 'data:image/svg+xml;base64,' + btoa(`
                  <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
                    <rect width="256" height="256" fill="#f0f0f0"/>
                    <text x="128" y="128" font-family="Arial" font-size="12" fill="#999" text-anchor="middle">
                      Download Failed
                    </text>
                  </svg>
                `)
                done(new Error('Download failed'), tile)
              })
          } else {
            // Offline and no cache
            tile.src = 'data:image/svg+xml;base64,' + btoa(`
              <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
                <rect width="256" height="256" fill="#fff3cd"/>
                <text x="128" y="120" font-family="Arial" font-size="12" fill="#856404" text-anchor="middle">
                  Offline
                </text>
                <text x="128" y="140" font-family="Arial" font-size="10" fill="#856404" text-anchor="middle">
                  ${coords.z}/${coords.x}/${coords.y}
                </text>
              </svg>
            `)
            done(undefined, tile)
          }
        }).catch(err => {
          console.error('Cache error:', err)
          tile.src = 'data:image/svg+xml;base64,' + btoa(`
            <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
              <rect width="256" height="256" fill="#ffebee"/>
              <text x="128" y="128" font-family="Arial" font-size="14" fill="#c62828" text-anchor="middle">
                Error
              </text>
            </svg>
          `)
          done(new Error('Cache error'), tile)
        })

        return tile
      }
    })

    // Add caching tile layer with OpenStreetMap
    // @ts-expect-error - Custom tile layer extension
    const cachingLayer = new CachingTileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 0,
      attribution: '© OpenStreetMap contributors',
      subdomains: ['a', 'b', 'c']
    })

    cachingLayer.addTo(map)
    console.log('✅ Smart caching tile layer added')

    // Log cache info
    mapStorage.getAllTiles().then(tiles => {
      const cachedCount = tiles.filter(t => t.region === 'online-cache').length
      console.log(`💾 ${cachedCount} tiles already cached`)
    })

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
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
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
          mapInstance.current?.setView([latitude, longitude], 15)
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
      
      {/* Online/Offline Status */}
      <div className={`absolute top-4 left-4 px-3 py-2 rounded-lg shadow-lg text-xs z-[1000] ${
        isOnline ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="font-medium">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        {cacheStats.total > 0 && (
          <p className="mt-1 text-xs opacity-75">
            {cacheStats.cached}/{cacheStats.total} from cache
          </p>
        )}
      </div>

      {/* Location Button */}
      <button
        onClick={getCurrentLocation}
        disabled={isLocating}
        className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 z-[1000]"
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
        <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg text-sm z-[1000]">
          <p className="text-gray-600">Current Location:</p>
          <p className="font-mono text-xs">
            {currentLocation[0].toFixed(6)}, {currentLocation[1].toFixed(6)}
          </p>
        </div>
      )}
    </div>
  )
}
