import { Button } from "@/components/ui/button"
import { ExternalLink, Heart, Github, Twitter, Mail, FileText, Shield, HelpCircle } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-primary">Rebatr</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The future of AI debates. Watch intelligent models engage in thoughtful discussions on any topic.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Built with</span>
              <Heart className="h-3 w-3 text-red-500" />
              <span>using Next.js & OpenRouter</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-card-foreground">Product</h4>
            <nav className="space-y-2">
              <a href="#features" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                Features
              </a>
              <a href="#pricing" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                Pricing
              </a>
              <a href="#demo" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                Demo
              </a>
              <a href="#api" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                API Documentation
              </a>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-bold text-card-foreground">Resources</h4>
            <nav className="space-y-2">
              <a
                href="#help"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <HelpCircle className="h-3 w-3" />
                Help Center
              </a>
              <a
                href="#docs"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <FileText className="h-3 w-3" />
                Documentation
              </a>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="justify-start p-0 h-auto text-sm text-muted-foreground hover:text-accent"
              >
                <a
                  href="https://openrouter.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  OpenRouter
                </a>
              </Button>
              <a href="#blog" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                Blog
              </a>
            </nav>
          </div>

          {/* Legal & Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-card-foreground">Legal</h4>
            <nav className="space-y-2">
              <a
                href="#privacy"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <Shield className="h-3 w-3" />
                Privacy Policy
              </a>
              <a href="#terms" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                Terms of Service
              </a>
              <a
                href="#contact"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <Mail className="h-3 w-3" />
                Contact Us
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">© 2024 Rebatr. All rights reserved.</div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="p-2 h-auto hover:bg-accent/10" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </Button>

              <Button variant="ghost" size="sm" className="p-2 h-auto hover:bg-accent/10" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>

              <div className="text-xs text-muted-foreground">Made with AI debates in mind</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
