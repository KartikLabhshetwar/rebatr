import type { DebateMessage } from "@/types/debate"

export interface ScoringCriteria {
  logic: number // 0-10: Logical consistency and reasoning
  evidence: number // 0-10: Use of facts, examples, and support
  persuasiveness: number // 0-10: Compelling and convincing arguments
  relevance: number // 0-10: Staying on topic and addressing the debate
  clarity: number // 0-10: Clear communication and structure
}

export interface ArgumentScore {
  messageId: string
  round: number
  speaker: "model1" | "model2"
  criteria: ScoringCriteria
  totalScore: number
  feedback: string
}

export interface DebateAnalytics {
  totalArguments: number
  averageScores: {
    model1: ScoringCriteria & { total: number }
    model2: ScoringCriteria & { total: number }
  }
  roundWinners: Array<{ round: number; winner: "model1" | "model2" | "tie"; margin: number }>
  overallWinner: "model1" | "model2" | "tie"
  winnerMargin: number
  strongestArguments: {
    model1?: ArgumentScore
    model2?: ArgumentScore
  }
}

export class ScoringEngine {
  private scores: ArgumentScore[] = []

  // Automated scoring based on argument analysis
  async scoreArgument(
    message: DebateMessage,
    context: { topic: string; opponentArgs: DebateMessage[] },
  ): Promise<ArgumentScore> {
    const criteria = this.analyzeArgument(message, context)
    const totalScore = this.calculateTotalScore(criteria)
    const feedback = this.generateFeedback(criteria, message)

    const score: ArgumentScore = {
      messageId: message.id,
      round: message.round,
      speaker: message.speaker,
      criteria,
      totalScore,
      feedback,
    }

    this.scores.push(score)
    return score
  }

  private analyzeArgument(
    message: DebateMessage,
    context: { topic: string; opponentArgs: DebateMessage[] },
  ): ScoringCriteria {
    const content = message.content.toLowerCase()
    const wordCount = message.content.split(" ").length

    // Logic scoring - look for logical connectors and structure
    const logicIndicators = [
      "because",
      "therefore",
      "however",
      "furthermore",
      "consequently",
      "thus",
      "since",
      "given that",
    ]
    const logicScore = Math.min(10, 3 + logicIndicators.filter((indicator) => content.includes(indicator)).length * 1.5)

    // Evidence scoring - look for factual indicators
    const evidenceIndicators = [
      "study",
      "research",
      "data",
      "statistics",
      "example",
      "according to",
      "evidence",
      "fact",
      "report",
    ]
    const evidenceScore = Math.min(
      10,
      2 + evidenceIndicators.filter((indicator) => content.includes(indicator)).length * 2,
    )

    // Persuasiveness scoring - look for persuasive language
    const persuasiveIndicators = [
      "clearly",
      "obviously",
      "undoubtedly",
      "essential",
      "crucial",
      "vital",
      "must",
      "should",
      "will",
    ]
    const persuasiveScore = Math.min(
      10,
      4 + persuasiveIndicators.filter((indicator) => content.includes(indicator)).length * 1.2,
    )

    // Relevance scoring - check topic keywords presence
    const topicWords = context.topic
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 3)
    const relevanceMatches = topicWords.filter((word) => content.includes(word)).length
    const relevanceScore = Math.min(10, 5 + relevanceMatches * 2)

    // Clarity scoring - based on sentence structure and length
    const sentences = message.content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const avgSentenceLength = wordCount / sentences.length
    const clarityScore = Math.min(10, Math.max(3, 10 - Math.abs(avgSentenceLength - 20) / 5))

    return {
      logic: Math.round(logicScore * 10) / 10,
      evidence: Math.round(evidenceScore * 10) / 10,
      persuasiveness: Math.round(persuasiveScore * 10) / 10,
      relevance: Math.round(relevanceScore * 10) / 10,
      clarity: Math.round(clarityScore * 10) / 10,
    }
  }

  private calculateTotalScore(criteria: ScoringCriteria): number {
    const weights = {
      logic: 0.25,
      evidence: 0.25,
      persuasiveness: 0.2,
      relevance: 0.2,
      clarity: 0.1,
    }

    const total = Object.entries(criteria).reduce((sum, [key, value]) => {
      return sum + value * weights[key as keyof ScoringCriteria]
    }, 0)

    return Math.round(total * 10) / 10
  }

  private generateFeedback(criteria: ScoringCriteria, message: DebateMessage): string {
    const strengths = []
    const improvements = []

    if (criteria.logic >= 7) strengths.push("strong logical structure")
    else if (criteria.logic < 5) improvements.push("clearer logical connections")

    if (criteria.evidence >= 7) strengths.push("good use of evidence")
    else if (criteria.evidence < 5) improvements.push("more supporting evidence")

    if (criteria.persuasiveness >= 7) strengths.push("compelling arguments")
    else if (criteria.persuasiveness < 5) improvements.push("more persuasive language")

    if (criteria.relevance >= 7) strengths.push("stays on topic")
    else if (criteria.relevance < 5) improvements.push("better focus on the topic")

    let feedback = ""
    if (strengths.length > 0) {
      feedback += `Strengths: ${strengths.join(", ")}. `
    }
    if (improvements.length > 0) {
      feedback += `Could improve: ${improvements.join(", ")}.`
    }

    return feedback || "Solid argument overall."
  }

  getDebateAnalytics(messages: DebateMessage[]): DebateAnalytics {
    const model1Scores = this.scores.filter((s) => s.speaker === "model1")
    const model2Scores = this.scores.filter((s) => s.speaker === "model2")

    const calculateAverages = (scores: ArgumentScore[]) => {
      if (scores.length === 0) return { logic: 0, evidence: 0, persuasiveness: 0, relevance: 0, clarity: 0, total: 0 }

      const totals = scores.reduce(
        (acc, score) => ({
          logic: acc.logic + score.criteria.logic,
          evidence: acc.evidence + score.criteria.evidence,
          persuasiveness: acc.persuasiveness + score.criteria.persuasiveness,
          relevance: acc.relevance + score.criteria.relevance,
          clarity: acc.clarity + score.criteria.clarity,
          total: acc.total + score.totalScore,
        }),
        { logic: 0, evidence: 0, persuasiveness: 0, relevance: 0, clarity: 0, total: 0 },
      )

      return {
        logic: Math.round((totals.logic / scores.length) * 10) / 10,
        evidence: Math.round((totals.evidence / scores.length) * 10) / 10,
        persuasiveness: Math.round((totals.persuasiveness / scores.length) * 10) / 10,
        relevance: Math.round((totals.relevance / scores.length) * 10) / 10,
        clarity: Math.round((totals.clarity / scores.length) * 10) / 10,
        total: Math.round((totals.total / scores.length) * 10) / 10,
      }
    }

    const model1Averages = calculateAverages(model1Scores)
    const model2Averages = calculateAverages(model2Scores)

    // Calculate round winners
    const rounds = Math.max(...messages.map((m) => m.round))
    const roundWinners = []

    for (let round = 1; round <= rounds; round++) {
      const roundScores1 = this.scores.filter((s) => s.round === round && s.speaker === "model1")
      const roundScores2 = this.scores.filter((s) => s.round === round && s.speaker === "model2")

      const avg1 =
        roundScores1.length > 0 ? roundScores1.reduce((sum, s) => sum + s.totalScore, 0) / roundScores1.length : 0
      const avg2 =
        roundScores2.length > 0 ? roundScores2.reduce((sum, s) => sum + s.totalScore, 0) / roundScores2.length : 0

      const margin = Math.abs(avg1 - avg2)
      const winner = avg1 > avg2 ? "model1" : avg2 > avg1 ? "model2" : "tie"

      roundWinners.push({ round, winner: winner as "model1" | "model2" | "tie", margin: Math.round(margin * 10) / 10 })
    }

    // Determine overall winner
    const overallMargin = Math.abs(model1Averages.total - model2Averages.total)
    const overallWinner =
      model1Averages.total > model2Averages.total
        ? "model1"
        : model2Averages.total > model1Averages.total
          ? "model2"
          : "tie"

    // Find strongest arguments
    const strongestModel1 = model1Scores.reduce(
      (best, current) => (!best || current.totalScore > best.totalScore ? current : best),
      undefined as ArgumentScore | undefined,
    )
    const strongestModel2 = model2Scores.reduce(
      (best, current) => (!best || current.totalScore > best.totalScore ? current : best),
      undefined as ArgumentScore | undefined,
    )

    return {
      totalArguments: messages.length,
      averageScores: {
        model1: model1Averages,
        model2: model2Averages,
      },
      roundWinners,
      overallWinner: overallWinner as "model1" | "model2" | "tie",
      winnerMargin: Math.round(overallMargin * 10) / 10,
      strongestArguments: {
        model1: strongestModel1,
        model2: strongestModel2,
      },
    }
  }

  getScoreForMessage(messageId: string): ArgumentScore | undefined {
    return this.scores.find((s) => s.messageId === messageId)
  }

  getAllScores(): ArgumentScore[] {
    return [...this.scores]
  }

  reset(): void {
    this.scores = []
  }
}
