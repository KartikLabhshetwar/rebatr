import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  const shortcuts = [
    { key: "?", description: "Show keyboard shortcuts" },
    { key: "Escape", description: "Close dialogs" },
    { key: "Enter", description: "Submit forms" },
    { key: "Space", description: "Start/pause debate (when in debate view)" },
    { key: "R", description: "Reset debate (when in debate view)" },
    { key: "S", description: "Go to setup (when not in debate)" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <Badge variant="outline" className="font-mono">
                {shortcut.key}
              </Badge>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
