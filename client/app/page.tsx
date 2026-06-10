import Hero from "./components/Hero"
import FeatureCards from "./components/FeatureCards"

export default function Home() {
  return (
    <div className="min-h-screen pb-20">
      <Hero />
      <div className="mt-6 z-10 absolute bottom-[100px]">
        <FeatureCards />
      </div>
    </div>
  )
}