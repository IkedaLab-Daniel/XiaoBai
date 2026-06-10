# Offline Routing Implementation Guide

This document outlines the approach for implementing offline routing capabilities in XiaoBai AI Maps.

## Overview

Offline routing allows users to get directions between two points without an internet connection, using pre-downloaded map data.

## Technology Options

### 1. **OSRM (Open Source Routing Machine)** - Recommended
- **Pros:**
  - Fast and efficient
  - Supports multiple routing profiles (car, bike, foot)
  - Can be compiled to WebAssembly
  - Well-documented
- **Cons:**
  - Requires pre-processed routing data
  - Large file sizes (50-200MB per region)
- **Implementation:**
  ```bash
  npm install osrm
  ```

### 2. **GraphHopper**
- **Pros:**
  - Flexible routing engine
  - Good mobile support
  - Multiple routing algorithms
- **Cons:**
  - Larger file sizes
  - More complex setup
- **Implementation:**
  ```bash
  npm install graphhopper-js-api-client
  ```

### 3. **Leaflet Routing Machine with Offline Plugin**
- **Pros:**
  - Easy integration with Leaflet
  - Lightweight
- **Cons:**
  - Limited offline capabilities
  - Requires custom routing data format

## Recommended Approach: OSRM

### Step 1: Prepare Routing Data

1. **Download OSM Data** (same as map tiles)
   - Use Geofabrik extracts
   - Example: Beijing, Manila regions

2. **Process with OSRM**
   ```bash
   # Extract routing graph
   osrm-extract beijing.osm.pbf -p profiles/car.lua
   
   # Contract graph for faster routing
   osrm-contract beijing.osrm
   
   # Generate routing files
   osrm-partition beijing.osrm
   osrm-customize beijing.osrm
   ```

3. **Output Files** (to include in USB flashdrive):
   - `beijing.osrm`
   - `beijing.osrm.edges`
   - `beijing.osrm.geometry`
   - `beijing.osrm.nodes`
   - Total size: ~50-100MB per region

### Step 2: Storage Structure

```typescript
interface RoutingData {
  regionId: string
  profile: 'car' | 'bike' | 'foot'
  data: ArrayBuffer // OSRM routing data
  bounds: [[number, number], [number, number]]
  lastUpdated: Date
}
```

Store in IndexedDB:
```typescript
const routingStore = localforage.createInstance({
  name: 'XiaoBaiMaps',
  storeName: 'routing'
})
```

### Step 3: Implementation

#### A. Create Routing Service

```typescript
// lib/routingService.ts
import OSRM from 'osrm'

class OfflineRoutingService {
  private osrm: OSRM | null = null
  
  async loadRegion(regionId: string): Promise<void> {
    // Load routing data from IndexedDB
    const data = await routingStore.getItem(regionId)
    
    // Initialize OSRM with data
    this.osrm = new OSRM({
      path: data,
      algorithm: 'CH' // Contraction Hierarchies
    })
  }
  
  async getRoute(
    start: [number, number],
    end: [number, number],
    profile: 'car' | 'bike' | 'foot' = 'car'
  ): Promise<Route> {
    if (!this.osrm) {
      throw new Error('Routing data not loaded')
    }
    
    const options = {
      coordinates: [start, end],
      overview: 'full',
      steps: true,
      annotations: true
    }
    
    return new Promise((resolve, reject) => {
      this.osrm.route(options, (err, result) => {
        if (err) reject(err)
        else resolve(this.parseRoute(result))
      })
    })
  }
  
  private parseRoute(result: any): Route {
    const route = result.routes[0]
    
    return {
      distance: route.distance, // meters
      duration: route.duration, // seconds
      geometry: route.geometry, // GeoJSON LineString
      steps: route.legs[0].steps.map(step => ({
        instruction: step.maneuver.instruction,
        distance: step.distance,
        duration: step.duration,
        location: step.maneuver.location
      }))
    }
  }
}

export const routingService = new OfflineRoutingService()
```

#### B. Create Routing UI Component

```typescript
// components/RoutingPanel.tsx
export default function RoutingPanel() {
  const [start, setStart] = useState<[number, number] | null>(null)
  const [end, setEnd] = useState<[number, number] | null>(null)
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(false)
  
  const calculateRoute = async () => {
    if (!start || !end) return
    
    setLoading(true)
    try {
      const result = await routingService.getRoute(start, end)
      setRoute(result)
    } catch (error) {
      alert('Failed to calculate route')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="routing-panel">
      {/* Start/End inputs */}
      {/* Route display */}
      {/* Turn-by-turn directions */}
    </div>
  )
}
```

#### C. Display Route on Map

```typescript
// In MapView component
useEffect(() => {
  if (!route || !mapInstance.current) return
  
  // Draw route line
  const routeLine = L.geoJSON(route.geometry, {
    style: {
      color: '#4CAF50',
      weight: 5,
      opacity: 0.7
    }
  }).addTo(mapInstance.current)
  
  // Add start/end markers
  L.marker(route.start).addTo(mapInstance.current)
  L.marker(route.end).addTo(mapInstance.current)
  
  // Fit bounds to route
  mapInstance.current.fitBounds(routeLine.getBounds())
  
  return () => {
    routeLine.remove()
  }
}, [route])
```

### Step 4: USB Flashdrive Structure

```
XiaoBai_Maps/
├── tiles/
│   ├── beijing.mbtiles
│   └── manila.mbtiles
├── routing/
│   ├── beijing-car.osrm
│   ├── beijing-car.osrm.edges
│   ├── beijing-car.osrm.geometry
│   ├── beijing-car.osrm.nodes
│   ├── manila-car.osrm
│   └── manila-car.osrm.*
└── metadata.json
```

## Alternative: Simple A* Routing

For a simpler implementation without OSRM:

```typescript
// Basic A* pathfinding on road network
class SimpleRouter {
  private roadNetwork: RoadNetwork
  
  findPath(start: [number, number], end: [number, number]): Path {
    // 1. Find nearest road nodes to start/end
    // 2. Run A* algorithm on road network
    // 3. Return path as array of coordinates
  }
}
```

**Pros:**
- Simpler implementation
- Smaller data files
- No external dependencies

**Cons:**
- Slower routing
- Less accurate
- No turn-by-turn instructions

## Storage Requirements

| Region | Tiles | Routing | Total |
|--------|-------|---------|-------|
| Beijing | 85 MB | 60 MB | 145 MB |
| Manila | 55 MB | 35 MB | 90 MB |
| Shanghai | 75 MB | 55 MB | 130 MB |

## Performance Considerations

1. **Lazy Loading**: Load routing data only when needed
2. **Caching**: Cache calculated routes
3. **Web Workers**: Run routing calculations in background
4. **Progressive Enhancement**: Show basic directions first, then detailed steps

## Future Enhancements

1. **Multi-modal routing**: Combine walking + transit
2. **Avoid areas**: Let users mark areas to avoid
3. **Alternative routes**: Show 2-3 route options
4. **Real-time updates**: Update routes based on user location
5. **Route sharing**: Export routes to share with others

## Testing

1. **Unit tests**: Test routing algorithms
2. **Integration tests**: Test with sample data
3. **Performance tests**: Measure routing speed
4. **Mobile tests**: Test on iPhone 14

## Resources

- OSRM Documentation: https://project-osrm.org/
- GraphHopper: https://www.graphhopper.com/
- Leaflet Routing Machine: https://www.liedman.net/leaflet-routing-machine/
- OSM Routing Profiles: https://github.com/Project-OSRM/osrm-backend/tree/master/profiles

## Implementation Priority

1. **Phase 1** (MVP): Basic point-to-point routing with OSRM
2. **Phase 2**: Turn-by-turn navigation UI
3. **Phase 3**: Multiple routing profiles (car/bike/foot)
4. **Phase 4**: Alternative routes and route optimization
5. **Phase 5**: Advanced features (avoid areas, multi-modal)

---

**Note**: Full offline routing implementation requires significant development time and testing. Consider starting with online routing (when available) and progressively adding offline capabilities.