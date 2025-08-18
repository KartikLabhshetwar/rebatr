"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Brain, Zap } from "lucide-react"

interface TypingIndicatorProps {
  speaker: "model1" | "model2"
  modelName: string
}

export function TypingIndicator({ speaker, modelName }: TypingIndicatorProps) {
  const isModel1 = speaker === "model1"

  return (
    <div className={`flex gap-4 ${isModel1 ? "" : "flex-row-reverse"} animate-fade-in`}>
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback className={`${isModel1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {isModel1 ? <Brain className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
        </AvatarFallback>
      </Avatar>

      <div className={`flex-1 max-w-[80%] ${isModel1 ? "" : "text-right"}`}>
        <div className={`flex items-center gap-2 mb-2 ${isModel1 ? "" : "justify-end"}`}>
          <span className="font-medium text-sm text-muted-foreground">{modelName}</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border-2 border-dashed ${
            isModel1 ? "border-green-300 bg-green-50/50" : "border-red-300 bg-red-50/50"
          } animate-pulse`}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent"></div>
            Crafting argument...
          </div>
        </div>
      </div>
    </div>
  )
}
