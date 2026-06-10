import Hero from "./components/Hero"
import FindHomeCard from "./components/FindHomeCard"
import FeatureCards from "./components/FeatureCards"
import StatsSection from "./components/StatsSection"

export default function Home() {
  return (
    <div className="min-h-screen pb-20">
      <Hero />
      <FindHomeCard />
      <FeatureCards />
      <StatsSection />
    </div>
  )
}