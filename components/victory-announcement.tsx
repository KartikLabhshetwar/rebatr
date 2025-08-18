"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Sparkles, Brain, Zap, X, BarChart3, RotateCcw } from "lucide-react"
import { WinnerAnalysis } from "./winner-analysis"
import type { DebateState } from "@/types/debate"
import { useModels } from "@/hooks/use-models"

interface VictoryAnnouncementProps {
  debateState: DebateState
  winner: "model1" | "model2" | "tie" | null
  show: boolean
  onClose?: () => void
  onRestart?: () => void
  selectedModels?: {
    model1: string
    model2: string
  }
}

export function VictoryAnnouncement({ debateState, winner, show, onClose, onRestart, selectedModels }: VictoryAnnouncementProps) {
  const { models } = useModels()
  const [isVisible, setIsVisible] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)

  // Helper function to get model name from ID
  const getModelName = (modelId: string) => {
    const model = models.find(m => m.id === modelId)
    return model?.name || modelId.split('/').pop() || modelId
  }

  const getShortModelName = (modelId: string) => {
    const name = getModelName(modelId)
    if (name.includes('Claude')) return 'Claude'
    if (name.includes('GPT')) return name.replace(/^.*GPT/, 'GPT')
    if (name.includes('Llama')) return 'Llama'
    if (name.includes('Gemini')) return 'Gemini'
    return name.split(' ')[0]
  }

  useEffect(() => {
    if (show) {
      setTimeout(() => setIsVisible(true), 500)
    } else {
      setIsVisible(false)
      setShowAnalysis(false)
    }
  }, [show])

  if (!show || !winner) return null

  const getWinnerInfo = () => {
    if (winner === "tie") {
      return {
        title: "Perfect Tie!",
        subtitle: "Both AI models achieved intellectual parity",
        description: "A rare and remarkable display of balanced argumentation",
        icon: <Sparkles className="w-8 sm:w-12 h-8 sm:h-12 text-yellow-500" />,
        color: "bg-gradient-to-r from-yellow-500 to-orange-500",
        textColor: "text-yellow-600",
      }
    }

    const modelName = selectedModels 
      ? (winner === "model1" ? getModelName(selectedModels.model1) : getModelName(selectedModels.model2))
      : (winner === "model1" ? "Model 1" : "Model 2")
    const modelIcon =
      winner === "model1" ? (
        <Brain className="w-8 sm:w-12 h-8 sm:h-12 text-white" />
      ) : (
        <Zap className="w-8 sm:w-12 h-8 sm:h-12 text-white" />
      )

    return {
      title: `${modelName} Wins!`,
      subtitle: "Debate Champion Crowned",
      description: "Outstanding performance in logical reasoning and persuasion",
      icon: modelIcon,
      color:
        winner === "model1"
          ? "bg-gradient-to-r from-blue-500 to-purple-500"
          : "bg-gradient-to-r from-green-500 to-teal-500",
      textColor: winner === "model1" ? "text-blue-600" : "text-green-600",
    }
  }

  const winnerInfo = getWinnerInfo()
  const scoreMargin = Math.abs(debateState.scores.model1 - debateState.scores.model2)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      if (onClose) onClose()
    }, 300)
  }

  return (
    <div
      className={`fixed inset-0 bg-black/60 flex items-center justify-center z-40 transition-all duration-500 p-4 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`max-w-2xl w-full transform transition-all duration-700 ${
          isVisible ? "scale-100 translate-y-0" : "scale-75 translate-y-8"
        }`}
      >
        {!showAnalysis ? (
          <Card className="relative overflow-hidden">
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
              <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-white/20">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <CardContent className="p-4 sm:p-8 text-center">
              <div
                className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full ${winnerInfo.color} flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce shadow-lg`}
              >
                {winnerInfo.icon}
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {winnerInfo.title}
              </h1>

              <h2 className={`text-lg sm:text-xl font-semibold mb-2 ${winnerInfo.textColor}`}>{winnerInfo.subtitle}</h2>

              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-lg">{winnerInfo.description}</p>

              <div className="flex justify-center gap-4 sm:gap-8 mb-4 sm:mb-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">{debateState.scores.model1}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    <span className="hidden sm:inline">{selectedModels ? getModelName(selectedModels.model1) : "Model 1"}</span>
                    <span className="sm:hidden">{selectedModels ? getShortModelName(selectedModels.model1) : "M1"}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-xl sm:text-2xl font-bold text-muted-foreground">VS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">{debateState.scores.model2}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    <span className="hidden sm:inline">{selectedModels ? getModelName(selectedModels.model2) : "Model 2"}</span>
                    <span className="sm:hidden">{selectedModels ? getShortModelName(selectedModels.model2) : "M2"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
                  <Trophy className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Debate </span>Complete
                </Badge>
                {scoreMargin > 0 && (
                  <Badge variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
                    {scoreMargin} Point {scoreMargin === 1 ? "Lead" : "Margin"}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
                  {debateState.messages.length} Arguments
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                <Button onClick={() => setShowAnalysis(true)} className="flex items-center gap-2 w-full sm:w-auto">
                  <BarChart3 className="w-4 h-4" />
                  View Analysis
                </Button>
                {onRestart && (
                  <Button 
                    onClick={onRestart} 
                    variant="outline" 
                    className="flex items-center gap-2 w-full sm:w-auto bg-transparent"
                  >
                    <RotateCcw className="w-4 h-4" />
                    New Debate
                  </Button>
                )}
                <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto bg-transparent">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setShowAnalysis(false)}
                className="flex items-center gap-2 text-sm sm:text-base"
              >
                ← <span className="hidden sm:inline">Back to Victory</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <WinnerAnalysis debateState={debateState} winner={winner} />
          </div>
        )}
      </div>
    </div>
  )
}
