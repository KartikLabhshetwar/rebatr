import { ErrorBoundary } from "@/components/error-boundary"
import { HeroSection } from "@/components/hero-section"
import { BentoFeatures } from "@/components/bento-features"
import { CTASection } from "@/components/cta-section"
import { LandingFooter } from "@/components/landing-footer"

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <HeroSection />
        <BentoFeatures />
        <CTASection />
        <LandingFooter />
      </div>
    </ErrorBoundary>
  )
}
