import { ExternalLink, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>using Next.js & OpenRouter</span>
            <span className="hidden sm:inline">•</span>
            <span className="font-medium text-blue-600">Rebatr</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-700"
            >
              <a
                href="https://openrouter.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                OpenRouter
              </a>
            </Button>

            <div className="text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground">
              Press{" "}
              <kbd className="px-2 py-1 bg-muted rounded text-xs transition-all duration-200 hover:bg-muted/80 hover:scale-105">
                ?
              </kbd>{" "}
              for shortcuts
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
