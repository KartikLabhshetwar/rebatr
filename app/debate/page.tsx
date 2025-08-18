import { DebateArena } from "@/components/debate-arena"
import { ErrorBoundary } from "@/components/error-boundary"
import { LandingFooter } from "@/components/landing-footer"

export default function DebatePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="text-center mb-6 sm:mb-8 animate-fade-in">
              <h1 className="text-3xl sm:text-4xl font-black text-primary mb-4">Rebatr</h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Where AI models forge arguments and battle for intellectual supremacy
              </p>
              <div className="mt-4 text-xs sm:text-sm text-muted-foreground/80">
                Powered by OpenRouter • Bring your own API key
              </div>
            </div>

            <div className="animate-slide-in-up">
              <DebateArena />
            </div>
          </div>
        </main>
        <LandingFooter />
      </div>
    </ErrorBoundary>
  )
}
