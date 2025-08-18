import { Button } from "@/components/ui/button"
import { Brain, Download, Key, MessageSquare, Trophy, Zap, Users, BarChart3, Clock, Sparkles } from "lucide-react"

export function BentoFeatures() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-primary">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create engaging AI debates and analyze the results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-fr">
            {/* Large feature card - AI Models */}
            <div className="md:col-span-2 lg:col-span-3 md:row-span-2 bg-card border border-border rounded-lg p-8 card-hover group">
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 bg-accent/10 rounded-full w-fit">
                    <Brain className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-card-foreground mb-2">Multiple AI Models</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Choose from a variety of AI models including GPT-4, Claude, and more. Watch them compete with
                      different reasoning styles and approaches.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm text-accent font-medium">
                  <Users className="h-4 w-4" />
                  <span>10+ AI Models Available</span>
                </div>
              </div>
            </div>

            {/* Real-time Debates */}
            <div className="md:col-span-2 lg:col-span-2 bg-card border border-border rounded-lg p-6 card-hover">
              <div className="space-y-4">
                <div className="p-3 bg-accent/10 rounded-full w-fit">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground">Real-time Debates</h3>
                  <p className="text-muted-foreground text-sm">
                    Watch AI models debate live with instant responses and dynamic interactions.
                  </p>
                </div>
              </div>
            </div>

            {/* Smart Scoring */}
            <div className="md:col-span-2 lg:col-span-1 bg-card border border-border rounded-lg p-6 card-hover">
              <div className="space-y-3">
                <div className="p-2 bg-accent/10 rounded-full w-fit">
                  <Trophy className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-card-foreground">Smart Scoring</h3>
                  <p className="text-muted-foreground text-xs">Advanced algorithms determine debate winners.</p>
                </div>
              </div>
            </div>

            {/* API Key Management */}
            <div className="md:col-span-1 lg:col-span-2 bg-card border border-border rounded-lg p-6 card-hover">
              <div className="space-y-4">
                <div className="p-3 bg-accent/10 rounded-full w-fit">
                  <Key className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground">Secure API Keys</h3>
                  <p className="text-muted-foreground text-sm">
                    Bring your own OpenRouter API key for secure, private debates.
                  </p>
                </div>
              </div>
            </div>

            {/* Export Results */}
            <div className="md:col-span-1 lg:col-span-1 bg-card border border-border rounded-lg p-6 card-hover">
              <div className="space-y-3">
                <div className="p-2 bg-accent/10 rounded-full w-fit">
                  <Download className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-card-foreground">Export</h3>
                  <p className="text-muted-foreground text-xs">Save debates as PDF or text files.</p>
                </div>
              </div>
            </div>

            {/* Performance Analytics */}
            <div className="md:col-span-2 lg:col-span-2 bg-card border border-border rounded-lg p-6 card-hover">
              <div className="space-y-4">
                <div className="p-3 bg-accent/10 rounded-full w-fit">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground">Performance Analytics</h3>
                  <p className="text-muted-foreground text-sm">
                    Detailed insights into argument quality, logic, and persuasiveness.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Real-time
                  </span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI-powered
                  </span>
                </div>
              </div>
            </div>

            {/* Lightning Fast */}
            <div className="md:col-span-2 lg:col-span-1 bg-card border border-border rounded-lg p-6 card-hover">
              <div className="space-y-3">
                <div className="p-2 bg-accent/10 rounded-full w-fit">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-card-foreground">Lightning Fast</h3>
                  <p className="text-muted-foreground text-xs">Instant responses and smooth interactions.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold btn-hover-lift"
            >
              Explore All Features
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
