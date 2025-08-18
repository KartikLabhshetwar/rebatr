"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScoringEngine, type DebateAnalytics } from "@/lib/scoring-engine"
import type { DebateState } from "@/types/debate"
import { Trophy, Plus, Minus, Brain, Zap, BarChart3, Target, Award } from "lucide-react"

interface DebateScoreboardProps {
  debateState: DebateState
  setDebateState: React.Dispatch<React.SetStateAction<DebateState>>
}

export function DebateScoreboard({ debateState, setDebateState }: DebateScoreboardProps) {
  const [lastScored, setLastScored] = useState<"model1" | "model2" | null>(null)
  const [autoScoring, setAutoScoring] = useState(true)
  const [scoringEngine] = useState(() => new ScoringEngine())
  const [analytics, setAnalytics] = useState<DebateAnalytics | null>(null)

  useEffect(() => {
    if (autoScoring && debateState.messages.length > 0) {
      // Auto-score new messages
      const lastMessage = debateState.messages[debateState.messages.length - 1]
      const existingScore = scoringEngine.getScoreForMessage(lastMessage.id)

      if (!existingScore) {
        const opponentArgs = debateState.messages.filter((m) => m.speaker !== lastMessage.speaker)
        scoringEngine
          .scoreArgument(lastMessage, {
            topic: debateState.topic,
            opponentArgs,
          })
          .then(() => {
            updateAnalytics()
          })
      }
    }
  }, [debateState.messages, autoScoring])

  const updateAnalytics = () => {
    const newAnalytics = scoringEngine.getDebateAnalytics(debateState.messages)
    setAnalytics(newAnalytics)

    // Update debate state with automated scores if auto-scoring is enabled
    if (autoScoring) {
      setDebateState((prev) => ({
        ...prev,
        scores: {
          model1: Math.round(newAnalytics.averageScores.model1.total * 10),
          model2: Math.round(newAnalytics.averageScores.model2.total * 10),
        },
      }))
    }
  }

  const totalScore = debateState.scores.model1 + debateState.scores.model2
  const model1Percentage = totalScore > 0 ? (debateState.scores.model1 / totalScore) * 100 : 50
  const model2Percentage = totalScore > 0 ? (debateState.scores.model2 / totalScore) * 100 : 50

  const adjustScore = (model: "model1" | "model2", change: number) => {
    setDebateState((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [model]: Math.max(0, prev.scores[model] + change),
      },
    }))
    setLastScored(model)
    setTimeout(() => setLastScored(null), 1000)
  }

  const getWinner = () => {
    if (debateState.scores.model1 > debateState.scores.model2) return "model1"
    if (debateState.scores.model2 > debateState.scores.model1) return "model2"
    return "tie"
  }

  const winner = getWinner()

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5" />
          Scoring System
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Switch id="auto-scoring" checked={autoScoring} onCheckedChange={setAutoScoring} />
          <Label htmlFor="auto-scoring" className="text-sm">
            Auto Score
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scores" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scores">Scores</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="space-y-6">
            {/* Model 1 Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-sm">Claude 3.5 Sonnet</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Pro
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                {!autoScoring && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustScore("model1", -1)}
                    disabled={debateState.scores.model1 === 0}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                )}

                <div className="flex-1 text-center">
                  <div
                    className={`text-2xl font-bold ${lastScored === "model1" ? "text-green-600 animate-pulse" : ""}`}
                  >
                    {debateState.scores.model1}
                  </div>
                  <Progress value={model1Percentage} className="h-2 mt-1" />
                  {analytics && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Avg: {analytics.averageScores.model1.total}/10
                    </div>
                  )}
                </div>

                {!autoScoring && (
                  <Button size="sm" variant="outline" onClick={() => adjustScore("model1", 1)} className="h-8 w-8 p-0">
                    <Plus className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* VS Divider */}
            <div className="text-center text-muted-foreground font-medium">VS</div>

            {/* Model 2 Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-sm">GPT-4o Mini</span>
                </div>
                <Badge variant="destructive" className="text-xs">
                  Con
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                {!autoScoring && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustScore("model2", -1)}
                    disabled={debateState.scores.model2 === 0}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                )}

                <div className="flex-1 text-center">
                  <div className={`text-2xl font-bold ${lastScored === "model2" ? "text-red-600 animate-pulse" : ""}`}>
                    {debateState.scores.model2}
                  </div>
                  <Progress value={model2Percentage} className="h-2 mt-1" />
                  {analytics && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Avg: {analytics.averageScores.model2.total}/10
                    </div>
                  )}
                </div>

                {!autoScoring && (
                  <Button size="sm" variant="outline" onClick={() => adjustScore("model2", 1)} className="h-8 w-8 p-0">
                    <Plus className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Winner Display */}
            {totalScore > 0 && (
              <div className="pt-4 border-t">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Current Leader</div>
                  {winner === "tie" ? (
                    <Badge variant="outline" className="text-sm">
                      Tied Game
                    </Badge>
                  ) : (
                    <Badge
                      variant={winner === "model1" ? "secondary" : "destructive"}
                      className="text-sm flex items-center gap-1 mx-auto w-fit"
                    >
                      <Trophy className="w-3 h-3" />
                      {winner === "model1" ? "Claude 3.5 Sonnet" : "GPT-4o Mini"}
                    </Badge>
                  )}
                  {analytics && analytics.winnerMargin > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">Margin: {analytics.winnerMargin} points</div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {analytics ? (
              <>
                {/* Round Winners */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Target className="w-4 h-4" />
                    Round Winners
                  </div>
                  <div className="space-y-1">
                    {analytics.roundWinners.map((round) => (
                      <div key={round.round} className="flex items-center justify-between text-xs">
                        <span>Round {round.round}</span>
                        <Badge
                          variant={
                            round.winner === "model1"
                              ? "secondary"
                              : round.winner === "model2"
                                ? "destructive"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {round.winner === "model1" ? "Claude" : round.winner === "model2" ? "GPT" : "Tie"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scoring Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <BarChart3 className="w-4 h-4" />
                    Score Breakdown
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-3 gap-1 text-center font-medium">
                      <span></span>
                      <span className="text-green-600">Claude</span>
                      <span className="text-red-600">GPT</span>
                    </div>
                    {Object.entries(analytics.averageScores.model1)
                      .filter(([key]) => key !== "total")
                      .map(([criteria, score]) => (
                        <div key={criteria} className="grid grid-cols-3 gap-1 text-center">
                          <span className="text-left capitalize">{criteria}</span>
                          <span>{score}</span>
                          <span>
                            {analytics.averageScores.model2[criteria as keyof typeof analytics.averageScores.model2]}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Best Arguments */}
                {(analytics.strongestArguments.model1 || analytics.strongestArguments.model2) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Award className="w-4 h-4" />
                      Best Arguments
                    </div>
                    <div className="space-y-2 text-xs">
                      {analytics.strongestArguments.model1 && (
                        <div className="p-2 bg-green-50 rounded border-green-200 border">
                          <div className="font-medium text-green-700">
                            Claude - Round {analytics.strongestArguments.model1.round}
                          </div>
                          <div className="text-green-600">
                            Score: {analytics.strongestArguments.model1.totalScore}/10
                          </div>
                        </div>
                      )}
                      {analytics.strongestArguments.model2 && (
                        <div className="p-2 bg-red-50 rounded border-red-200 border">
                          <div className="font-medium text-red-700">
                            GPT - Round {analytics.strongestArguments.model2.round}
                          </div>
                          <div className="text-red-600">Score: {analytics.strongestArguments.model2.totalScore}/10</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Analytics will appear as the debate progresses</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Scoring Instructions */}
        <div className="pt-4 border-t mt-4">
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">{autoScoring ? "Auto Scoring Criteria:" : "Manual Scoring Guide:"}</p>
            {autoScoring ? (
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                <li>Logic & reasoning structure</li>
                <li>Evidence & factual support</li>
                <li>Persuasiveness & impact</li>
                <li>Topic relevance & focus</li>
                <li>Clarity & communication</li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                <li>Award points for strong arguments</li>
                <li>Consider logic and evidence</li>
                <li>Rate persuasiveness</li>
                <li>Judge counterpoint responses</li>
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
