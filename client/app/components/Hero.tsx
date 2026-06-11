import Image from "next/image"
import LongLogo from "@/public/logo-long.png"
import { Settings } from "lucide-react"
export default function Hero() {
  return (
    <div 
      className="bg-[url('/home-top-bg.png')] w-full h-[40vh] bg-cover bg-center rounded-bl-3xl rounded-br-3xl"
    >
      <div className="m-2 flex justify-between items-center">
        <span
          className="w-4 text-center text-xs"
        >
          Offline Mode
        </span>

        <Image 
          src={LongLogo}
          height={50}
          width={200}
          alt="header"
        />

        <Settings 
          size={30}
        />
      </div>
    </div>
  )
}