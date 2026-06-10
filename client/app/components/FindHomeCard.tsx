import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function FindHomeCard() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center justify-between mx-4 -mt-12 relative z-10">
      <div className="flex items-center gap-4">
        <Image 
          src="/house.png"
          width={80}
          height={80}
          alt="House"
          className="object-contain"
        />
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">
            Find Home 🏠
          </h3>
          <p className="text-sm text-foreground opacity-70">
            I'll help you find your<br/>way back.
          </p>
        </div>
      </div>
      
      <button className="bg-pink-300 rounded-full p-4 shadow-md hover:bg-pink-400 transition-colors">
        <ArrowRight size={24} className="text-white" />
      </button>
    </div>
  )
}

// Made with Bob
