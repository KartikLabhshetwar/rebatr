"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { DebateMessage as DebateMessageType } from "@/types/debate"
import { Brain, Zap, ChevronDown, BarChart3 } from "lucide-react"

interface DebateMessageProps {
  message: DebateMessageType
  score?: {
    totalScore: number
    criteria: {
      logic: number
      evidence: number
      persuasiveness: number
      relevance: number
      clarity: number
    }
    feedback: string
  }
}

export function DebateMessage({ message, score }: DebateMessageProps) {
  const [showScore, setShowScore] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const isModel1 = message.speaker === "model1"
  const modelName = isModel1 ? "Claude 3.5 Sonnet" : "GPT-4o Mini"
  const stance = isModel1 ? "Pro" : "Con"
  const stanceColor = isModel1 ? "bg-blue-500" : "bg-green-500"
  const bgColor = isModel1 ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"
  const avatarColor = isModel1 ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"

  return (
    <div
      className={`flex gap-3 sm:gap-4 transition-all duration-300 ${isModel1 ? "" : "flex-row-reverse"} ${
        isHovered ? "scale-[1.01]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 transition-all duration-200 hover:scale-110 shadow-sm">
        <AvatarFallback className={`${avatarColor} transition-colors duration-200`}>
          {isModel1 ? <Brain className="w-4 h-4 sm:w-5 sm:h-5" /> : <Zap className="w-4 h-4 sm:w-5 sm:h-5" />}
        </AvatarFallback>
      </Avatar>

      <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${isModel1 ? "" : "text-right"}`}>
        <div className={`flex items-center gap-2 mb-2 ${isModel1 ? "" : "justify-end"} transition-all duration-200`}>
          <Badge variant="outline" className="text-xs px-2 py-0.5 transition-colors duration-200 hover:bg-muted">
            Round {message.round}
          </Badge>
          <div
            className={`w-2 h-2 rounded-full ${stanceColor} transition-all duration-200 ${isHovered ? "scale-125" : ""}`}
          ></div>
          <span className="font-medium text-xs sm:text-sm transition-colors duration-200">{modelName}</span>
          <Badge
            variant={isModel1 ? "default" : "secondary"}
            className={`text-xs px-2 py-0.5 transition-all duration-200 hover:scale-105 ${
              isModel1 ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {stance}
          </Badge>
          {score && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-0.5 transition-all duration-200 hover:bg-yellow-50 hover:border-yellow-300"
            >
              {score.totalScore}/10
            </Badge>
          )}
        </div>

        <Card
          className={`${bgColor} transition-all duration-300 hover:shadow-md ${isHovered ? "shadow-lg" : "shadow-sm"}`}
        >
          <CardContent className="p-3 sm:p-4">
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap transition-colors duration-200">
              {message.content}
            </p>

            {score && (
              <Collapsible open={showScore} onOpenChange={setShowScore} className="mt-3">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 p-1 text-xs transition-all duration-200 hover:bg-white/70 hover:scale-105"
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Score Details
                    <ChevronDown
                      className={`w-3 h-3 ml-1 transition-transform duration-300 ${showScore ? "rotate-180" : ""}`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 p-2 bg-white/70 rounded-md text-xs transition-all duration-300 border border-white/50">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="transition-colors duration-200 hover:text-foreground">
                      Logic: {score.criteria.logic}/10
                    </div>
                    <div className="transition-colors duration-200 hover:text-foreground">
                      Evidence: {score.criteria.evidence}/10
                    </div>
                    <div className="transition-colors duration-200 hover:text-foreground">
                      Persuasive: {score.criteria.persuasiveness}/10
                    </div>
                    <div className="transition-colors duration-200 hover:text-foreground">
                      Relevance: {score.criteria.relevance}/10
                    </div>
                    <div className="transition-colors duration-200 hover:text-foreground">
                      Clarity: {score.criteria.clarity}/10
                    </div>
                    <div className="font-medium transition-colors duration-200 hover:text-foreground">
                      Total: {score.totalScore}/10
                    </div>
                  </div>
                  {score.feedback && (
                    <div className="text-muted-foreground italic transition-colors duration-200 hover:text-foreground/80">
                      {score.feedback}
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}
          </CardContent>
        </Card>

        <div
          className={`text-xs text-muted-foreground mt-1 transition-colors duration-200 ${isModel1 ? "" : "text-right"}`}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
