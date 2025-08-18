import { OpenRouterClient } from "./openrouter"
import type { DebateMessage } from "@/types/debate"

interface DebateContext {
  topic: string
  round: number
  maxRounds: number
  previousArguments: DebateMessage[]
  opponentLastArgument?: DebateMessage
}

export class DebateEngine {
  private client: OpenRouterClient

  constructor(apiKey: string) {
    this.client = new OpenRouterClient(apiKey)
  }

  async generateArgument(model: string, stance: "for" | "against", context: DebateContext): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(stance, context)
    const conversationHistory = this.buildConversationHistory(context, stance)

    const messages = [{ role: "system" as const, content: systemPrompt }, ...conversationHistory]

    return await this.client.generateResponse(model, messages)
  }

  private buildSystemPrompt(stance: "for" | "against", context: DebateContext): string {
    const position = stance === "for" ? "FOR" : "AGAINST"
    const roundContext = this.getRoundContext(context.round, context.maxRounds)

    return `You are participating in a formal debate about: "${context.topic}"

POSITION: You are arguing ${position} this topic.

DEBATE RULES:
- Keep responses between 150-250 words
- Use logical reasoning and evidence
- Address counterpoints when relevant
- Stay focused on the topic
- Be persuasive but respectful
- Use specific examples when possible

${roundContext}

DEBATE STRATEGY:
${this.getStrategyPrompt(stance, context.round, context.maxRounds)}

Provide a compelling, well-structured argument that advances your position.`
  }

  private getRoundContext(round: number, maxRounds: number): string {
    if (maxRounds <= 3) {
      // Optimized for 3-round debates
      if (round === 1) {
        return "ROUND 1: Opening statements - Present your strongest initial argument with key evidence."
      } else if (round === 2) {
        return "ROUND 2: Rebuttal and reinforcement - Address opponent's points while strengthening your position."
      } else {
        return "FINAL ROUND: Closing arguments - Deliver your most compelling summary and final points."
      }
    } else {
      // Original logic for longer debates
      if (round === 1) {
        return "ROUND 1: Opening statements - Present your strongest initial argument."
      } else if (round === maxRounds) {
        return "FINAL ROUND: Closing arguments - Summarize your position and deliver your most compelling points."
      } else if (round <= Math.ceil(maxRounds / 2)) {
        return `ROUND ${round}: Development phase - Build upon your arguments with evidence and examples.`
      } else {
        return `ROUND ${round}: Rebuttal phase - Address opponent's arguments while strengthening your position.`
      }
    }
  }

  private getStrategyPrompt(stance: "for" | "against", round: number, maxRounds: number): string {
    const strategies = {
      for: {
        early: "Focus on benefits, positive outcomes, and why this topic is necessary or beneficial.",
        middle: "Provide concrete evidence, statistics, and real-world examples supporting your position.",
        late: "Address common objections and reinforce why the benefits outweigh any concerns.",
        final: "Synthesize your strongest points and paint a compelling vision of the positive future.",
      },
      against: {
        early: "Highlight risks, problems, and negative consequences of this topic.",
        middle: "Present evidence of failures, unintended consequences, and alternative solutions.",
        late: "Reinforce the dangers and show why the risks are too great to ignore.",
        final: "Emphasize the critical importance of avoiding these negative outcomes.",
      },
    }

    const phase =
      round === 1 ? "early" : round === maxRounds ? "final" : round <= Math.ceil(maxRounds / 2) ? "middle" : "late"

    return strategies[stance][phase]
  }

  private buildConversationHistory(context: DebateContext, currentStance: "for" | "against") {
    const messages = []

    // Add context about the debate topic
    messages.push({
      role: "user" as const,
      content: `The debate topic is: "${context.topic}". You are arguing ${currentStance.toUpperCase()}.`,
    })

    // Add recent opponent arguments for context (last 2 rounds)
    const recentOpponentArgs = context.previousArguments
      .filter((msg) => {
        const msgStance = msg.speaker === "model1" ? "for" : "against"
        return msgStance !== currentStance
      })
      .slice(-2)

    if (recentOpponentArgs.length > 0) {
      const opponentStance = currentStance === "for" ? "against" : "for"
      messages.push({
        role: "user" as const,
        content: `Your opponent (arguing ${opponentStance.toUpperCase()}) recently argued:\n\n${recentOpponentArgs.map((arg) => `"${arg.content}"`).join("\n\n")}\n\nAddress these points while advancing your own position.`,
      })
    }

    return messages
  }

  async validateApiKey(): Promise<boolean> {
    return await this.client.validateApiKey()
  }
}
