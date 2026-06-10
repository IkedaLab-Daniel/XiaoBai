import Image from "next/image"
import { ChevronRight } from "lucide-react"

export default function StatsSection() {
  return (
    <div className="px-4 mt-6 mb-24">
      <div className="bg-white rounded-3xl shadow-lg p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
            <span className="text-3xl">🐶</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground mb-1">Traveling together</h4>
            <p className="text-xs text-foreground opacity-70">You and XiaoBai</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center border-r border-gray-200 pr-4">
            <div className="text-2xl font-bold text-foreground">12</div>
            <div className="text-xs text-foreground opacity-70 flex items-center gap-1">
              Places 🌸
            </div>
          </div>
          
          <div className="text-center pr-2">
            <div className="text-2xl font-bold text-foreground">5</div>
            <div className="text-xs text-foreground opacity-70 flex items-center gap-1">
              Notes 🌸
            </div>
          </div>

          <button className="text-pink-400 hover:text-pink-500 transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
