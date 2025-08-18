import { type NextRequest, NextResponse } from "next/server"
import { DebateEngine } from "@/lib/debate-engine"

export async function POST(request: NextRequest) {
  try {
    const { apiKey, model, topic, stance, previousMessages, round, maxRounds } = await request.json()

    if (!apiKey || !model || !topic || !stance) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const engine = new DebateEngine(apiKey)

    const context = {
      topic,
      round: round || 1,
      maxRounds: maxRounds || 5,
      previousArguments: previousMessages || [],
    }

    const response = await engine.generateArgument(model, stance, context)

    return NextResponse.json({
      response,
      metadata: {
        round,
        stance,
        model,
        wordCount: response.split(" ").length,
      },
    })
  } catch (error) {
    console.error("Debate generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate debate response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
