import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Users, CheckCircle } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center card-hover">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Ready to Start?</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-primary leading-tight">
                  Experience the Future of
                  <br />
                  <span
                    className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent font-black"
                    style={{ color: "hsl(var(--accent))" }}
                  >
                    AI Debates
                  </span>
                </h2>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Join thousands of users who are already exploring intelligent conversations between AI models. Start
                  your first debate in under 2 minutes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold btn-hover-lift group"
                  asChild
                >
                  <Link href="/debate">
                    Start Your First Debate
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-border hover:bg-muted hover:text-black px-8 py-6 text-lg font-semibold btn-hover-lift bg-transparent"
                  asChild
                >
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">
                    Get API Key
                  </a>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">No signup required</span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Bring your own API key</span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Export results instantly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
