import { type NextRequest, NextResponse } from "next/server"
import { OpenRouterClient } from "@/lib/openrouter"

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    const client = new OpenRouterClient(apiKey)
    const isValid = await client.validateApiKey()

    return NextResponse.json({ isValid })
  } catch (error) {
    console.error("API key validation error:", error)
    return NextResponse.json({ error: "Failed to validate API key" }, { status: 500 })
  }
}
