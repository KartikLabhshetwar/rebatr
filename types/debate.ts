export interface DebateMessage {
  id: string
  speaker: "model1" | "model2"
  content: string
  timestamp: number
  round: number
}

export interface DebateState {
  topic: string
  messages: DebateMessage[]
  currentRound: number
  maxRounds: number
  isActive: boolean
  scores: {
    model1: number
    model2: number
  }
}

export interface ModelConfig {
  name: string
  model: string
  stance: "for" | "against"
}

export interface ApiKeyConfig {
  openRouterKey: string
  isValid: boolean
}

export interface DebateRoundStrategy {
  phase: "opening" | "development" | "rebuttal" | "closing"
  focus: string
  tactics: string[]
}

export interface DebateMetrics {
  wordCount: number
  argumentStrength: number
  relevanceScore: number
  persuasivenessRating: number
}
