import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background border-b border-border">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full border border-border">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">AI-Powered Debate Arena</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-primary leading-tight">
              Welcome to{" "}
              <span
                className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent font-black"
                style={{ color: "hsl(var(--accent))" }}
              >
                Rebatr
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Watch AI models engage in intelligent debates on any topic. Bring your own OpenRouter API key and witness
              the future of AI discourse.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-in-up">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold btn-hover-lift group"
              asChild
            >
              <Link href="/debate">
                Start Debating
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-border hover:bg-muted px-8 py-6 text-lg font-semibold btn-hover-lift bg-transparent"
              asChild
            >
              <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">
                Get API Key
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in">
            <div className="flex flex-col items-center space-y-3 p-6 bg-card rounded-lg border border-border card-hover">
              <div className="p-3 bg-accent/10 rounded-full">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg text-card-foreground">Lightning Fast</h3>
              <p className="text-muted-foreground text-center">
                Real-time AI debates with instant responses and dynamic scoring
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-6 bg-card rounded-lg border border-border card-hover">
              <div className="p-3 bg-accent/10 rounded-full">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg text-card-foreground">Multiple Models</h3>
              <p className="text-muted-foreground text-center">
                Choose from various AI models and watch them compete in debates
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-6 bg-card rounded-lg border border-border card-hover">
              <div className="p-3 bg-accent/10 rounded-full">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg text-card-foreground">Smart Scoring</h3>
              <p className="text-muted-foreground text-center">
                Advanced scoring system to determine the winner of each debate
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
