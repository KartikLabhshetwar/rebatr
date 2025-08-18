"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DebateState } from "@/types/debate"
import { Clock, MessageSquare, Zap, TrendingUp } from "lucide-react"

interface LiveStatsProps {
  debateState: DebateState
  isGenerating: boolean
  currentSpeaker: "model1" | "model2" | null
}

export function LiveStats({ debateState, isGenerating, currentSpeaker }: LiveStatsProps) {
  const totalWords = debateState.messages.reduce((sum, msg) => sum + msg.content.split(" ").length, 0)
  const avgWordsPerMessage = debateState.messages.length > 0 ? Math.round(totalWords / debateState.messages.length) : 0
  const debateStartTime = debateState.messages.length > 0 ? debateState.messages[0].timestamp : Date.now()
  const elapsedMinutes = Math.floor((Date.now() - debateStartTime) / 60000)

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Duration</span>
            </div>
            <div className="font-semibold">{elapsedMinutes}m</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <MessageSquare className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Arguments</span>
            </div>
            <div className="font-semibold">{debateState.messages.length}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Avg Words</span>
            </div>
            <div className="font-semibold">{avgWordsPerMessage}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Status</span>
            </div>
            <div>
              {isGenerating ? (
                <Badge variant="secondary" className="text-xs animate-pulse">
                  Generating
                </Badge>
              ) : debateState.isActive ? (
                <Badge variant="default" className="text-xs">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  Paused
                </Badge>
              )}
            </div>
          </div>
        </div>

        {isGenerating && currentSpeaker && (
          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-xs">
              <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent"></div>
              {currentSpeaker === "model1" ? "Claude 3.5 Sonnet" : "GPT-4o Mini"} is thinking...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
