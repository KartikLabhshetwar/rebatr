"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { DebateState } from "@/types/debate"
import { Trophy, Zap, Brain, Award, TrendingUp, MessageSquare } from "lucide-react"

interface WinnerAnalysisProps {
  debateState: DebateState
  winner: "model1" | "model2" | "tie"
}

export function WinnerAnalysis({ debateState, winner }: WinnerAnalysisProps) {
  const model1Messages = debateState.messages.filter((m) => m.speaker === "model1")
  const model2Messages = debateState.messages.filter((m) => m.speaker === "model2")

  const getModelInfo = (model: "model1" | "model2") => ({
    name: model === "model1" ? "Claude 3.5 Sonnet" : "GPT-4o Mini",
    icon: model === "model1" ? Brain : Zap,
    color: model === "model1" ? "text-blue-600" : "text-green-600",
    bgColor: model === "model1" ? "bg-blue-50" : "bg-green-50",
    borderColor: model === "model1" ? "border-blue-200" : "border-green-200",
    score: debateState.scores[model],
    messageCount: model === "model1" ? model1Messages.length : model2Messages.length,
  })

  const winnerInfo = winner !== "tie" ? getModelInfo(winner) : null
  const loserInfo = winner !== "tie" ? getModelInfo(winner === "model1" ? "model2" : "model1") : null

  const totalScore = debateState.scores.model1 + debateState.scores.model2
  const winMargin = winner !== "tie" ? Math.abs(debateState.scores.model1 - debateState.scores.model2) : 0
  const winPercentage = winner !== "tie" && totalScore > 0 ? (winnerInfo!.score / totalScore) * 100 : 50

  const getVictoryType = () => {
    if (winner === "tie") return "Perfect Tie"
    if (winMargin >= 20) return "Decisive Victory"
    if (winMargin >= 10) return "Clear Victory"
    if (winMargin >= 5) return "Close Victory"
    return "Narrow Victory"
  }

  const getPerformanceInsights = () => {
    if (winner === "tie") {
      return [
        "Both models demonstrated exceptional balance",
        "Arguments were equally compelling on both sides",
        "A true intellectual stalemate achieved",
      ]
    }

    const insights = []
    if (winMargin >= 15) {
      insights.push(`${winnerInfo!.name} dominated with superior argumentation`)
    } else if (winMargin >= 8) {
      insights.push(`${winnerInfo!.name} maintained consistent advantage`)
    } else {
      insights.push(`${winnerInfo!.name} edged out a close victory`)
    }

    if (winnerInfo!.messageCount > loserInfo!.messageCount) {
      insights.push("Winner had more opportunities to present arguments")
    } else if (winnerInfo!.messageCount < loserInfo!.messageCount) {
      insights.push("Winner achieved victory with fewer arguments")
    }

    insights.push(`Victory margin: ${winMargin} points (${winPercentage.toFixed(1)}% dominance)`)

    return insights
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Victory Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Victory Type */}
        <div className="text-center">
          <Badge variant={winner === "tie" ? "outline" : "default"} className="text-lg px-4 py-2 mb-2">
            {getVictoryType()}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {winner === "tie"
              ? `Final Score: ${debateState.scores.model1} - ${debateState.scores.model2}`
              : `${winnerInfo!.name} wins ${winnerInfo!.score} - ${loserInfo!.score}`}
          </div>
        </div>

        <Separator />

        {/* Winner Spotlight */}
        {winner !== "tie" && winnerInfo && (
          <div className={`p-4 rounded-lg border ${winnerInfo.bgColor} ${winnerInfo.borderColor}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-full">
                <winnerInfo.icon className={`w-6 h-6 ${winnerInfo.color}`} />
              </div>
              <div>
                <div className="font-semibold text-lg">{winnerInfo.name}</div>
                <div className="text-sm text-muted-foreground">Debate Champion</div>
              </div>
              <div className="ml-auto">
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{winnerInfo.score}</div>
                <div className="text-xs text-muted-foreground">Final Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{winPercentage.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Dominance</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{winnerInfo.messageCount}</div>
                <div className="text-xs text-muted-foreground">Arguments</div>
              </div>
            </div>
          </div>
        )}

        {/* Tie Scenario */}
        {winner === "tie" && (
          <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
            <div className="text-center">
              <div className="flex justify-center gap-4 mb-3">
                <div className="p-2 bg-white rounded-full">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div className="p-2 bg-white rounded-full">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="font-semibold text-lg mb-2">Perfect Balance Achieved</div>
              <div className="text-sm text-muted-foreground mb-3">Both AI models demonstrated equal mastery</div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold">{debateState.scores.model1}</div>
                  <div className="text-xs text-muted-foreground">Claude Score</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{debateState.scores.model2}</div>
                  <div className="text-xs text-muted-foreground">GPT Score</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Performance Insights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <TrendingUp className="w-4 h-4" />
            Performance Insights
          </div>
          <div className="space-y-2">
            {getPerformanceInsights().map((insight, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Debate Statistics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <MessageSquare className="w-4 h-4" />
            Debate Statistics
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Rounds:</span>
                <span className="font-medium">{debateState.currentRound}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Arguments:</span>
                <span className="font-medium">{debateState.messages.length}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Claude Arguments:</span>
                <span className="font-medium">{model1Messages.length}</span>
              </div>
              <div className="flex justify-between">
                <span>GPT Arguments:</span>
                <span className="font-medium">{model2Messages.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Score Visualization */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <Award className="w-4 h-4" />
            Score Distribution
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-sm w-20">Claude</span>
              <Progress value={(debateState.scores.model1 / Math.max(totalScore, 1)) * 100} className="flex-1 h-2" />
              <span className="text-sm font-medium w-8">{debateState.scores.model1}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm w-20">GPT</span>
              <Progress value={(debateState.scores.model2 / Math.max(totalScore, 1)) * 100} className="flex-1 h-2" />
              <span className="text-sm font-medium w-8">{debateState.scores.model2}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
