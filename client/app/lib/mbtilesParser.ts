// @ts-expect-error - sql.js doesn't have proper TypeScript definitions
import initSqlJs from 'sql.js';
import { mapStorage, Region } from './mapStorage'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Database = any;

interface MBTilesMetadata {
  name: string
  format: string
  bounds: string
  center: string
  minzoom: string
  maxzoom: string
  description?: string
}

export class MBTilesParser {
  private file: File
  private db: Database | null = null

  constructor(file: File) {
    this.file = file
  }

  /**
   * Parse and import MBTiles file
   */
  async import(onProgress?: (progress: number, message: string) => void): Promise<Region> {
    try {
      onProgress?.(0, 'Initializing SQL.js...')
      
      // Initialize SQL.js with local WASM file
      const SQL = await initSqlJs({
        locateFile: (file: string) => `/sql-wasm.wasm`
      })

      onProgress?.(10, 'Reading file...')
      
      // Read file as ArrayBuffer
      const arrayBuffer = await this.file.arrayBuffer()
      
      onProgress?.(20, 'Opening database...')
      
      // Open SQLite database
      this.db = new SQL.Database(new Uint8Array(arrayBuffer))
      
      onProgress?.(30, 'Extracting metadata...')
      
      // Extract metadata
      const metadata = await this.extractMetadata()
      
      onProgress?.(40, 'Creating region...')
      
      // Create region from metadata
      const region: Region = {
        id: this.generateRegionId(metadata.name),
        name: metadata.name,
        country: this.extractCountry(metadata.name),
        bounds: this.parseBounds(metadata.bounds),
        size: this.file.size,
        tileCount: 0, // Will be updated as we import
        installed: true,
        lastUsed: new Date(),
        zoomLevels: [
          parseInt(metadata.minzoom),
          parseInt(metadata.maxzoom)
        ]
      }

      await mapStorage.saveRegion(region)

      onProgress?.(50, 'Importing tiles...')
      
      // Import tiles
      const tileCount = await this.importTiles(region.id, onProgress)
      
      // Update region with tile count
      region.tileCount = tileCount
      await mapStorage.saveRegion(region)

      onProgress?.(100, 'Import complete!')
      
      // Close database
      this.db.close()
      
      return region
    } catch (error) {
      console.error('MBTiles import failed:', error)
      if (this.db) {
        this.db.close()
      }
      throw new Error('Failed to import MBTiles file: ' + (error as Error).message)
    }
  }

  private async extractMetadata(): Promise<MBTilesMetadata> {
    if (!this.db) throw new Error('Database not initialized')

    try {
      // Query metadata table
      const result = this.db.exec('SELECT name, value FROM metadata')
      
      if (result.length === 0) {
        throw new Error('No metadata found in MBTiles file')
      }

      const metadata: Record<string, string> = {}
      result[0].values.forEach((row: unknown[]) => {
        const [name, value] = row
        metadata[name as string] = value as string
      })

      // Provide defaults if metadata is missing
      return {
        name: metadata.name || this.file.name.replace('.mbtiles', ''),
        format: metadata.format || 'pbf',
        bounds: metadata.bounds || '116.0,39.5,117.0,40.5',
        center: metadata.center || '116.4074,39.9042,13',
        minzoom: metadata.minzoom || '0',
        maxzoom: metadata.maxzoom || '14',
        description: metadata.description
      }
    } catch (error) {
      console.error('Failed to extract metadata:', error)
      // Return defaults if metadata extraction fails
      return {
        name: this.file.name.replace('.mbtiles', ''),
        format: 'pbf',
        bounds: '116.0,39.5,117.0,40.5',
        center: '116.4074,39.9042,13',
        minzoom: '0',
        maxzoom: '14'
      }
    }
  }

  private async importTiles(
    regionId: string,
    onProgress?: (progress: number, message: string) => void
  ): Promise<number> {
    if (!this.db) throw new Error('Database not initialized')

    try {
      // Get total tile count
      const countResult = this.db.exec('SELECT COUNT(*) as count FROM tiles')
      const totalTiles = countResult[0]?.values[0]?.[0] as number || 0

      if (totalTiles === 0) {
        console.warn('No tiles found in database')
        return 0
      }

      onProgress?.(50, `Found ${totalTiles} tiles. Starting import...`)

      // Detect tile format from metadata
      const metadataResult = this.db.exec('SELECT value FROM metadata WHERE name = "format"')
      const format = metadataResult[0]?.values[0]?.[0] as string || 'png'
      
      // Determine MIME type based on format
      let mimeType = 'image/png'
      if (format === 'jpg' || format === 'jpeg') {
        mimeType = 'image/jpeg'
      } else if (format === 'pbf') {
        mimeType = 'application/x-protobuf'
      } else if (format === 'webp') {
        mimeType = 'image/webp'
      }

      console.log(`Tile format detected: ${format} (${mimeType})`)
      onProgress?.(52, `Tile format: ${format}`)

      // Query tiles in batches
      const batchSize = 100
      let imported = 0

      // Get tiles
      const tilesResult = this.db.exec(
        'SELECT zoom_level, tile_column, tile_row, tile_data FROM tiles'
      )

      if (tilesResult.length === 0) {
        return 0
      }

      const tiles = tilesResult[0].values

      for (let i = 0; i < tiles.length; i++) {
        const [zoom, col, row, data] = tiles[i]
        
        // Convert TMS coordinates to XYZ (flip Y axis)
        const z = zoom as number
        const x = col as number
        const y = (Math.pow(2, z) - 1) - (row as number) // TMS to XYZ conversion
        
        // Convert tile data to Blob with correct MIME type
        // @ts-expect-error - Type compatibility issue with Uint8Array
        const tileBlob = new Blob([data], {
          type: mimeType
        })
        
        // Save tile to IndexedDB
        await mapStorage.saveTile(z, x, y, tileBlob, regionId)
        
        imported++

        // Update progress every 100 tiles
        if (imported % batchSize === 0 || imported === tiles.length) {
          const progress = 50 + (imported / totalTiles) * 50
          onProgress?.(progress, `Importing tiles... ${imported}/${totalTiles}`)
        }
      }

      console.log(`Successfully imported ${imported} ${format} tiles`)
      return imported
    } catch (error) {
      console.error('Failed to import tiles:', error)
      throw error
    }
  }

  private generateRegionId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  private extractCountry(name: string): string {
    const countryMap: Record<string, string> = {
      'beijing': 'China',
      'shanghai': 'China',
      'guangzhou': 'China',
      'china': 'China',
      'manila': 'Philippines',
      'cebu': 'Philippines',
      'davao': 'Philippines',
      'philippines': 'Philippines'
    }

    const nameLower = name.toLowerCase()
    for (const [key, country] of Object.entries(countryMap)) {
      if (nameLower.includes(key)) {
        return country
      }
    }

    return 'Unknown'
  }

  private parseBounds(boundsStr: string): [[number, number], [number, number]] {
    try {
      const [minLng, minLat, maxLng, maxLat] = boundsStr.split(',').map(Number)
      return [[minLng, minLat], [maxLng, maxLat]]
    } catch {
      // Default to Beijing bounds if parsing fails
      return [[116.0, 39.5], [117.0, 40.5]]
    }
  }
}

/**
 * Helper function to import MBTiles file with progress tracking
 */
export async function importMBTilesFile(
  file: File,
  onProgress?: (progress: number, message: string) => void
): Promise<Region> {
  const validExtensions = ['.mbtiles', '.osm.pbf', '.pbf']
  const hasValidExtension = validExtensions.some(ext => file.name.endsWith(ext))
  
  if (!hasValidExtension) {
    throw new Error('Invalid file format. Please select a .mbtiles, .osm.pbf, or .pbf file.')
  }

  // Only .mbtiles files can be parsed
  if (!file.name.endsWith('.mbtiles')) {
    throw new Error('.osm.pbf files must be converted to .mbtiles format first. Use tilemaker or tippecanoe to convert.')
  }

  const parser = new MBTilesParser(file)
  return await parser.import(onProgress)
}

/**
 * Validate MBTiles file before import
 */
export function validateMBTilesFile(file: File): { valid: boolean; error?: string } {
  const validExtensions = ['.mbtiles', '.osm.pbf', '.pbf']
  const hasValidExtension = validExtensions.some(ext => file.name.endsWith(ext))
  
  if (!hasValidExtension) {
    return {
      valid: false,
      error: 'File must have .mbtiles, .osm.pbf, or .pbf extension'
    }
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty'
    }
  }

  if (file.size > 500 * 1024 * 1024) { // 500MB limit
    return {
      valid: false,
      error: 'File is too large (max 500MB)'
    }
  }

  // Warn if using .osm.pbf format
  if (file.name.endsWith('.osm.pbf') || file.name.endsWith('.pbf')) {
    return {
      valid: false,
      error: '.osm.pbf files must be converted to .mbtiles format first. Use tilemaker or tippecanoe.'
    }
  }

  return { valid: true }
}

// Made with Bob
