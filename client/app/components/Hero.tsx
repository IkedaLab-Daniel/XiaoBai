import Image from "next/image"

export default function Hero() {
  return (
    <div 
      className="bg-[url('/home-top-bg.png')] w-full h-[40vh] bg-cover bg-center rounded-bl-3xl rounded-br-3xl"
    >
      <p>Sample Header</p>
    </div>
  )
}