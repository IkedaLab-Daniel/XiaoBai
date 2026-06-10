import Image from "next/image"
import { MapPin, Bookmark, Book, MessageCircle, Building2, Info, ChevronRight } from "lucide-react"

export default function FeatureCards() {
  return (
    <div className="px-4 mt-6 grid grid-cols-2 gap-4">
      {/* XiaoBai's Map Card */}
      <div className="bg-white rounded-3xl shadow-lg p-5 relative overflow-hidden">
        <div className="absolute top-3 right-3 text-2xl">🐾</div>
        <h3 className="text-lg font-bold text-green-700 mb-3">XiaoBai's Map</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin size={16} className="text-green-600" />
            <span>Offline Maps</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Bookmark size={16} className="text-green-600" />
            <span>Saved Places</span>
          </div>
        </div>

        <button className="bg-green-200 hover:bg-green-300 text-green-800 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1 transition-colors">
          Open Map
          <ChevronRight size={16} />
        </button>

        <Image 
          src="/map.png"
          width={100}
          height={100}
          alt="Map"
          className="absolute -bottom-2 -right-2 object-contain"
        />
      </div>

      {/* Travel Bag Card */}
      <div className="bg-white rounded-3xl shadow-lg p-5 relative overflow-hidden">
        <div className="absolute top-3 right-3 text-2xl">🐾</div>
        <h3 className="text-lg font-bold text-orange-600 mb-3">Travel Bag</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Book size={16} className="text-orange-500" />
            <span>Documents</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Book size={16} className="text-orange-500" />
            <span>Tickets</span>
          </div>
        </div>

        <button className="bg-orange-200 hover:bg-orange-300 text-orange-800 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1 transition-colors">
          Open Bag
          <ChevronRight size={16} />
        </button>

        <Image 
          src="/bag.png"
          width={100}
          height={100}
          alt="Bag"
          className="absolute -bottom-2 -right-2 object-contain"
        />
      </div>

      {/* Guidebook Card */}
      <div className="bg-white rounded-3xl shadow-lg p-5 relative overflow-hidden">
        <div className="absolute top-3 right-3 text-2xl">🐾</div>
        <h3 className="text-lg font-bold text-purple-600 mb-3">Guidebook</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MessageCircle size={16} className="text-purple-500" />
            <span>Phrasebook</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin size={16} className="text-purple-500" />
            <span>Metro Guide</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Building2 size={16} className="text-purple-500" />
            <span>Embassy Info</span>
          </div>
        </div>

        <button className="bg-purple-200 hover:bg-purple-300 text-purple-800 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1 transition-colors">
          Open Guide
          <ChevronRight size={16} />
        </button>

        <Image 
          src="/book.png"
          width={90}
          height={90}
          alt="Book"
          className="absolute -bottom-2 -right-2 object-contain"
        />
      </div>

      {/* Rescue Kit Card */}
      <div className="bg-white rounded-3xl shadow-lg p-5 relative overflow-hidden">
        <div className="absolute top-3 right-3 text-2xl">🐾</div>
        <h3 className="text-lg font-bold text-red-600 mb-3">Rescue Kit</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Info size={16} className="text-red-500" />
            <span>Emergency</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Building2 size={16} className="text-red-500" />
            <span>Hospitals</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Info size={16} className="text-red-500" />
            <span>Embassy Help</span>
          </div>
        </div>

        <button className="bg-red-200 hover:bg-red-300 text-red-800 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1 transition-colors">
          Open Kit
          <ChevronRight size={16} />
        </button>

        <Image 
          src="/aid-supply.png"
          width={90}
          height={90}
          alt="First Aid"
          className="absolute -bottom-2 -right-2 object-contain"
        />
      </div>
    </div>
  )
}

// Made with Bob
