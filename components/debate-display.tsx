"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DebateMessage } from "./debate-message"
import { DebateScoreboard } from "./debate-scoreboard"
import { TypingIndicator } from "./typing-indicator"
import { LiveStats } from "./live-stats"
import { ExportDebate } from "./export-debate"
import { HelpDialog } from "./help-dialog"
import { Confetti } from "./confetti"
import { VictoryAnnouncement } from "./victory-announcement"
import type { DebateState, DebateMessage as DebateMessageType } from "@/types/debate"
import { Play, Pause, RotateCcw, Trophy, Clock, Zap, Settings, AlertTriangle } from "lucide-react"

interface DebateDisplayProps {
  debateState: DebateState
  setDebateState: React.Dispatch<React.SetStateAction<DebateState>>
  apiKey: string
  onReset: () => void
}

export function DebateDisplay({ debateState, setDebateState, apiKey, onReset }: DebateDisplayProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentSpeaker, setCurrentSpeaker] = useState<"model1" | "model2" | null>(null)
  const [autoMode, setAutoMode] = useState(false)
  const [autoDelay, setAutoDelay] = useState(3000)
  const [selectedModels, setSelectedModels] = useState({
    model1: "anthropic/claude-3.5-sonnet",
    model2: "openai/gpt-4o-mini",
  })
  const [showTypingIndicator, setShowTypingIndicator] = useState(false)
  const [newMessageIds, setNewMessageIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [showVictory, setShowVictory] = useState(false)
  const [confettiTrigger, setConfettiTrigger] = useState(false)
  const [winner, setWinner] = useState<"model1" | "model2" | "tie" | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const autoTimeoutRef = useRef<NodeJS.Timeout>()

  const progress = (debateState.currentRound / debateState.maxRounds) * 100
  const isDebateComplete = debateState.currentRound >= debateState.maxRounds

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [debateState.messages])

  useEffect(() => {
    if (debateState.messages.length > 0) {
      const latestMessage = debateState.messages[debateState.messages.length - 1]
      setNewMessageIds((prev) => new Set([...prev, latestMessage.id]))

      setTimeout(() => {
        setNewMessageIds((prev) => {
          const updated = new Set(prev)
          updated.delete(latestMessage.id)
          return updated
        })
      }, 2000)
    }
  }, [debateState.messages])

  useEffect(() => {
    if (autoMode && debateState.isActive && !isDebateComplete && !isGenerating && !error) {
      autoTimeoutRef.current = setTimeout(() => {
        startNextRound()
      }, autoDelay)
    }

    return () => {
      if (autoTimeoutRef.current) {
        clearTimeout(autoTimeoutRef.current)
      }
    }
  }, [autoMode, debateState.isActive, isDebateComplete, isGenerating, debateState.messages, error])

  useEffect(() => {
    if (isDebateComplete && debateState.messages.length > 0 && !showVictory) {
      const model1Score = debateState.scores?.model1 || 0
      const model2Score = debateState.scores?.model2 || 0

      let calculatedWinner: "model1" | "model2" | "tie"
      if (model1Score > model2Score) {
        calculatedWinner = "model1"
      } else if (model2Score > model1Score) {
        calculatedWinner = "model2"
      } else {
        calculatedWinner = "tie"
      }

      setWinner(calculatedWinner)

      setTimeout(() => {
        setConfettiTrigger(true)
      }, 1000)

      setTimeout(() => {
        setShowVictory(true)
      }, 1500)
    }
  }, [isDebateComplete, debateState.messages.length, debateState.scores, showVictory])

  const generateNextArgument = async (speaker: "model1" | "model2") => {
    setIsGenerating(true)
    setCurrentSpeaker(speaker)
    setShowTypingIndicator(true)
    setError(null)

    try {
      const model = selectedModels[speaker]
      const stance = speaker === "model1" ? "for" : "against"

      const response = await fetch("/api/debate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          model,
          topic: debateState.topic,
          stance,
          previousMessages: debateState.messages,
          round: debateState.currentRound + (speaker === "model1" ? 1 : 0),
          maxRounds: debateState.maxRounds,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      if (data.response) {
        setTimeout(() => {
          const newMessage: DebateMessageType = {
            id: Date.now().toString(),
            speaker,
            content: data.response,
            timestamp: Date.now(),
            round: debateState.currentRound + (speaker === "model1" ? 1 : 0),
          }

          setDebateState((prev) => ({
            ...prev,
            messages: [...prev.messages, newMessage],
            currentRound: speaker === "model2" ? prev.currentRound + 1 : prev.currentRound,
          }))

          setRetryCount(0)
        }, 500)
      } else {
        throw new Error("No response received from AI model")
      }
    } catch (error) {
      console.error("Error generating argument:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)

      setDebateState((prev) => ({
        ...prev,
        isActive: false,
      }))
      setAutoMode(false)
    } finally {
      setTimeout(() => {
        setIsGenerating(false)
        setCurrentSpeaker(null)
        setShowTypingIndicator(false)
      }, 500)
    }
  }

  const startNextRound = async () => {
    if (isDebateComplete || isGenerating) return

    const nextSpeaker = debateState.messages.length % 2 === 0 ? "model1" : "model2"
    await generateNextArgument(nextSpeaker)
  }

  const retryLastAction = async () => {
    if (retryCount >= 3) {
      setError("Maximum retry attempts reached. Please check your API key and try again later.")
      return
    }

    setRetryCount((prev) => prev + 1)
    setError(null)

    if (currentSpeaker) {
      await generateNextArgument(currentSpeaker)
    } else {
      await startNextRound()
    }
  }

  const startAutoDebate = async () => {
    if (isDebateComplete || isGenerating) return

    setAutoMode(true)
    setDebateState((prev) => ({ ...prev, isActive: true }))

    if (debateState.messages.length === 0) {
      await generateNextArgument("model1")
    }
  }

  const pauseDebate = () => {
    setAutoMode(false)
    setDebateState((prev) => ({ ...prev, isActive: false }))
    if (autoTimeoutRef.current) {
      clearTimeout(autoTimeoutRef.current)
    }
  }

  const resumeDebate = () => {
    setError(null)
    setDebateState((prev) => ({ ...prev, isActive: true }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      <Confetti trigger={confettiTrigger} duration={4000} particleCount={150} />
      <VictoryAnnouncement
        debateState={debateState}
        winner={winner}
        show={showVictory}
        onClose={() => setShowVictory(false)}
      />

      <Card>
        <CardHeader className="pb-4">
          <div className="space-y-4">
            <div>
              <CardTitle className="text-lg sm:text-xl leading-tight">{debateState.topic}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  Round {debateState.currentRound} of {debateState.maxRounds}
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  {debateState.messages.length} arguments
                </div>
                {isDebateComplete && (
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                    <Trophy className="w-3 h-3" />
                    <span className="hidden xs:inline">Debate </span>Complete
                  </Badge>
                )}
              </div>
            </div>

            {/* Mobile-optimized button layout */}
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                <HelpDialog />
                <ExportDebate debateState={debateState} />
              </div>
              <div className="flex gap-2 flex-1 sm:flex-initial">
                {!isDebateComplete && (
                  <>
                    {autoMode ? (
                      <Button
                        onClick={pauseDebate}
                        variant="outline"
                        size="sm"
                        disabled={isGenerating}
                        className="flex-1 sm:flex-initial bg-transparent"
                      >
                        <Pause className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Pause Auto</span>
                        <span className="sm:hidden">Pause</span>
                      </Button>
                    ) : debateState.isActive ? (
                      <Button
                        onClick={pauseDebate}
                        variant="outline"
                        size="sm"
                        disabled={isGenerating}
                        className="flex-1 sm:flex-initial bg-transparent"
                      >
                        <Pause className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Pause</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={resumeDebate}
                        variant="outline"
                        size="sm"
                        disabled={isGenerating}
                        className="flex-1 sm:flex-initial bg-transparent"
                      >
                        <Play className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Resume</span>
                      </Button>
                    )}
                  </>
                )}
                <Button onClick={onReset} variant="outline" size="sm" className="flex-1 sm:flex-initial bg-transparent">
                  <RotateCcw className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">New Debate</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      <LiveStats debateState={debateState} isGenerating={isGenerating} currentSpeaker={currentSpeaker} />

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm">{error}</span>
            {retryCount < 3 && (
              <Button
                onClick={retryLastAction}
                variant="outline"
                size="sm"
                disabled={isGenerating}
                className="self-start bg-transparent"
              >
                Retry ({3 - retryCount} left)
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {!isDebateComplete && (
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-mode"
                  checked={autoMode}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      startAutoDebate()
                    } else {
                      pauseDebate()
                    }
                  }}
                  disabled={isGenerating || !!error}
                />
                <Label htmlFor="auto-mode" className="flex items-center gap-2 text-sm">
                  <Settings className="w-4 h-4" />
                  Auto Mode
                </Label>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {autoMode ? "Debate running automatically" : "Manual control"}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6">
        {/* Main debate area - full width on mobile, 3/4 on desktop */}
        <div className="lg:col-span-3">
          <Card className="h-[400px] sm:h-[500px] lg:h-[600px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Debate Arguments</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[320px] sm:h-[420px] lg:h-[500px] px-4 sm:px-6" ref={scrollAreaRef}>
                <div className="space-y-3 sm:space-y-4 pb-4">
                  {debateState.messages.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 text-muted-foreground">
                      <div className="text-base sm:text-lg font-medium mb-2">Ready to start the debate!</div>
                      <p className="text-sm sm:text-base">Click "Next Round" or enable "Auto Mode" to begin.</p>
                    </div>
                  ) : (
                    debateState.messages.map((message, index) => (
                      <div key={message.id} className={newMessageIds.has(message.id) ? "animate-slide-in-up" : ""}>
                        <DebateMessage message={message} />
                        {index < debateState.messages.length - 1 && <Separator className="my-3 sm:my-4" />}
                      </div>
                    ))
                  )}
                  {showTypingIndicator && currentSpeaker && (
                    <>
                      {debateState.messages.length > 0 && <Separator className="my-3 sm:my-4" />}
                      <TypingIndicator
                        speaker={currentSpeaker}
                        modelName={currentSpeaker === "model1" ? "Claude 3.5 Sonnet" : "GPT-4o Mini"}
                      />
                    </>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-4">
            {!isDebateComplete && !autoMode && (
              <Button
                onClick={startNextRound}
                disabled={isGenerating || !debateState.isActive || !!error}
                size="lg"
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    <span className="hidden sm:inline">Generating Arguments...</span>
                    <span className="sm:hidden">Generating...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Next Round
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Scoreboard - full width on mobile, 1/4 on desktop */}
        <div className="lg:col-span-1">
          <DebateScoreboard debateState={debateState} setDebateState={setDebateState} />
        </div>
      </div>
    </div>
  )
}
