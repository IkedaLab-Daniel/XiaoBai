import Image from "next/image"
import LongLogo from "@/public/logo-long.png"
import { Settings } from "lucide-react"

export default function Hero() {
  return (
    <div
      className="bg-[url('/home-top-bg.png')] w-full bg-cover bg-center rounded-bl-3xl rounded-br-3xl pb-8"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-6 flex justify-between items-start">
        {/* Offline Mode Badge */}
        <div className="bg-white rounded-full px-4 py-2 shadow-md flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          <span className="text-xs font-medium text-foreground">
            Offline<br/>Mode
          </span>
        </div>

        {/* Logo and Tagline */}
        <div className="flex flex-col items-center -mt-2">
          <Image
            src={LongLogo}
            height={40}
            width={160}
            alt="XiaoBai AI"
            className="mb-1"
          />
          <p className="text-xs text-foreground opacity-80">Your offline travel companion</p>
        </div>

        {/* Settings Button */}
        <button className="bg-white rounded-full p-3 shadow-md">
          <Settings
            size={24}
            className="text-foreground"
          />
        </button>
      </div>

      {/* Dog Mascot with Speech Bubble */}
      <div className="relative px-4 mt-8">
        <div className="absolute right-8 top-0 bg-white rounded-3xl rounded-br-sm px-6 py-4 shadow-lg max-w-[200px]">
          <p className="text-sm font-medium text-foreground">
            Woof! 🐾<br/>
            Where shall we<br/>
            explore today?
          </p>
          <div className="absolute -bottom-1 right-0 w-4 h-4 bg-white transform rotate-45 translate-x-1"></div>
        </div>
      </div>
    </div>
  )
}