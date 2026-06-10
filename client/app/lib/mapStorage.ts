import localforage from 'localforage';

// Configure storage instances
const mapTilesStore = localforage.createInstance({
  name: 'XiaoBaiMaps',
  storeName: 'tiles',
  description: 'Offline map tiles storage'
});

const regionsStore = localforage.createInstance({
  name: 'XiaoBaiMaps',
  storeName: 'regions',
  description: 'Map regions metadata'
});

const savedPlacesStore = localforage.createInstance({
  name: 'XiaoBaiMaps',
  storeName: 'savedPlaces',
  description: 'User saved places'
});

// Types
export interface Region {
  id: string;
  name: string;
  country: string;
  bounds: [[number, number], [number, number]]; // [[minLng, minLat], [maxLng, maxLat]]
  size: number; // bytes
  tileCount: number;
  installed: boolean;
  lastUsed: Date;
  zoomLevels: [number, number]; // [min, max]
}

export interface SavedPlace {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  category: 'hotel' | 'restaurant' | 'attraction' | 'transport' | 'other';
  notes?: string;
  photos?: string[]; // base64 encoded
  created: Date;
  region: string;
}

export interface MapTile {
  key: string; // format: "z/x/y"
  data: Blob;
  region: string;
  timestamp: Date;
}

// Storage utilities
export const mapStorage = {
  // Tiles
  async saveTile(z: number, x: number, y: number, data: Blob, region: string): Promise<void> {
    const key = `${z}/${x}/${y}`;
    await mapTilesStore.setItem(key, {
      data,
      region,
      timestamp: new Date()
    });
  },

  async getTile(z: number, x: number, y: number): Promise<Blob | null> {
    const key = `${z}/${x}/${y}`;
    const tile = await mapTilesStore.getItem<MapTile>(key);
    return tile ? tile.data : null;
  },

  async deleteTilesByRegion(regionId: string): Promise<void> {
    const keys = await mapTilesStore.keys();
    const deletePromises = keys.map(async (key) => {
      const tile = await mapTilesStore.getItem<MapTile>(key);
      if (tile && tile.region === regionId) {
        await mapTilesStore.removeItem(key);
      }
    });
    await Promise.all(deletePromises);
  },

  // Regions
  async saveRegion(region: Region): Promise<void> {
    await regionsStore.setItem(region.id, region);
  },

  async getRegion(id: string): Promise<Region | null> {
    return await regionsStore.getItem<Region>(id);
  },

  async getAllRegions(): Promise<Region[]> {
    const regions: Region[] = [];
    await regionsStore.iterate<Region, void>((value) => {
      regions.push(value);
    });
    return regions;
  },

  async deleteRegion(id: string): Promise<void> {
    await regionsStore.removeItem(id);
    await this.deleteTilesByRegion(id);
  },

  async updateRegionLastUsed(id: string): Promise<void> {
    const region = await this.getRegion(id);
    if (region) {
      region.lastUsed = new Date();
      await this.saveRegion(region);
    }
  },

  // Saved Places
  async savePlace(place: SavedPlace): Promise<void> {
    await savedPlacesStore.setItem(place.id, place);
  },

  async getPlace(id: string): Promise<SavedPlace | null> {
    return await savedPlacesStore.getItem<SavedPlace>(id);
  },

  async getAllPlaces(): Promise<SavedPlace[]> {
    const places: SavedPlace[] = [];
    await savedPlacesStore.iterate<SavedPlace, void>((value) => {
      places.push(value);
    });
    return places.sort((a, b) => b.created.getTime() - a.created.getTime());
  },

  async getPlacesByRegion(regionId: string): Promise<SavedPlace[]> {
    const allPlaces = await this.getAllPlaces();
    return allPlaces.filter(place => place.region === regionId);
  },

  async deletePlace(id: string): Promise<void> {
    await savedPlacesStore.removeItem(id);
  },

  // Storage info
  async getStorageInfo(): Promise<{
    usage: number;
    quota: number;
    percentUsed: number;
  }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;
      
      return {
        usage,
        quota,
        percentUsed
      };
    }
    
    return {
      usage: 0,
      quota: 0,
      percentUsed: 0
    };
  },

  async clearAllData(): Promise<void> {
    await mapTilesStore.clear();
    await regionsStore.clear();
    await savedPlacesStore.clear();
  }
};

// Predefined regions for China and Philippines
export const PREDEFINED_REGIONS: Array<Omit<Region, 'installed' | 'lastUsed'>> = [
  {
    id: 'china-beijing',
    name: 'Beijing',
    country: 'China',
    bounds: [[115.7, 39.4], [117.4, 41.6]],
    size: 85000000, // 85MB estimated
    tileCount: 12000,
    zoomLevels: [0, 15]
  },
  {
    id: 'china-shanghai',
    name: 'Shanghai',
    country: 'China',
    bounds: [[120.8, 30.7], [122.0, 31.9]],
    size: 75000000, // 75MB
    tileCount: 10000,
    zoomLevels: [0, 15]
  },
  {
    id: 'china-guangzhou',
    name: 'Guangzhou',
    country: 'China',
    bounds: [[112.9, 22.6], [113.8, 23.6]],
    size: 65000000, // 65MB
    tileCount: 9000,
    zoomLevels: [0, 15]
  },
  {
    id: 'philippines-manila',
    name: 'Metro Manila',
    country: 'Philippines',
    bounds: [[120.9, 14.4], [121.2, 14.8]],
    size: 55000000, // 55MB
    tileCount: 8000,
    zoomLevels: [0, 15]
  },
  {
    id: 'philippines-cebu',
    name: 'Cebu',
    country: 'Philippines',
    bounds: [[123.7, 10.2], [124.0, 10.5]],
    size: 35000000, // 35MB
    tileCount: 5000,
    zoomLevels: [0, 15]
  },
  {
    id: 'philippines-davao',
    name: 'Davao',
    country: 'Philippines',
    bounds: [[125.4, 7.0], [125.8, 7.3]],
    size: 30000000, // 30MB
    tileCount: 4500,
    zoomLevels: [0, 15]
  }
];

// Made with Bob
