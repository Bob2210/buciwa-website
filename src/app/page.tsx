import { Hero } from "@/components/sections/hero"
import { PainPoint } from "@/components/sections/pain-point"
import { Features } from "@/components/sections/features"
import { VideoShowcase } from "@/components/sections/video-showcase"
import { DataStats } from "@/components/sections/data-stats"
import { FeedbackShow } from "@/components/sections/feedback-show"
import { Endorsement } from "@/components/sections/endorsement"
import { CTA } from "@/components/sections/cta"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <PainPoint />
      <Features />
      <VideoShowcase />
      <DataStats />
      <FeedbackShow />
      <Endorsement />
      <CTA />
      <Footer />
    </main>
  )
}
