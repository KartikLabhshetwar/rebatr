"use client"

import { useState } from "react"
import { Settings, Volume2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface SettingsPanelProps {
  settings: {
    autoMode: boolean
    soundEnabled: boolean
    animationSpeed: number
    theme: string
  }
  onSettingsChange: (settings: any) => void
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Debate Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-mode" className="text-sm">
                  Auto-continue debates
                </Label>
                <Switch
                  id="auto-mode"
                  checked={settings.autoMode}
                  onCheckedChange={(checked) => updateSetting("autoMode", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="text-sm">
                  Sound effects
                </Label>
                <Switch
                  id="sound"
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Animation Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Slider
                  value={[settings.animationSpeed]}
                  onValueChange={([value]) => updateSetting("animationSpeed", value)}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
