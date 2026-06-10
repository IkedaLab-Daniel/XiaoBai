import Image from "next/image"
import Link from "next/link"
import { Circle, ArrowRight } from "lucide-react"

export default function FeatureCards() {
  return (
    <div className="px-4 space-y-4">
      {/* XiaoBai's Map Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/map.png"
            width={100}
            height={100}
            alt="Map"
            className="object-contain"
          />
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-2 flex items-center gap-2">
              XiaoBai's Map
              <span className="text-lg opacity-20">🐾</span>
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Circle size={8} className="fill-green-600 text-green-600" />
                <span>Offline Maps</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Circle size={8} className="fill-green-600 text-green-600" />
                <span>Saved Places</span>
              </div>
            </div>
          </div>
        </div>
        <Link href="/maps">
          <button className="bg-green-300 hover:bg-green-400 rounded-full p-4 shadow-md transition-colors flex-shrink-0">
            <ArrowRight size={24} className="text-white" />
          </button>
        </Link>
      </div>

      {/* Translate Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/translate.png"
            width={100}
            height={100}
            alt="Translate"
            className="object-contain"
          />
          <div>
            <h3 className="text-xl font-bold text-orange-600 mb-2 flex items-center gap-2">
              Translate
              <span className="text-lg opacity-20">🐾</span>
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Circle size={8} className="fill-orange-500 text-orange-500" />
                <span>Offline Translator</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Circle size={8} className="fill-orange-500 text-orange-500" />
                <span>Multiple Languages</span>
              </div>
            </div>
          </div>
        </div>
        <Link href="/translate">
          <button className="bg-orange-300 hover:bg-orange-400 rounded-full p-4 shadow-md transition-colors flex-shrink-0">
            <ArrowRight size={24} className="text-white" />
          </button>
        </Link>
      </div>

      {/* Chat Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/chat.png"
            width={100}
            height={100}
            alt="Chat"
            className="object-contain"
          />
          <div>
            <h3 className="text-xl font-bold text-purple-600 mb-2 flex items-center gap-2">
              Chat
              <span className="text-lg opacity-20">🐾</span>
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Circle size={8} className="fill-purple-500 text-purple-500" />
                <span>Chat with XiaoBai</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Circle size={8} className="fill-purple-500 text-purple-500" />
                <span>Smart & Friendly Answers</span>
              </div>
            </div>
          </div>
        </div>
        <Link href="/chat">
          <button className="bg-purple-300 hover:bg-purple-400 rounded-full p-4 shadow-md transition-colors flex-shrink-0">
            <ArrowRight size={24} className="text-white" />
          </button>
        </Link>
      </div>
    </div>
  )
}

// Made with Bob
