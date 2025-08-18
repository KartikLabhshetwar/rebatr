interface OpenRouterMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export class OpenRouterClient {
  private apiKey: string
  private baseUrl = "https://openrouter.ai/api/v1"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch {
      return false
    }
  }

  async generateResponse(model: string, messages: OpenRouterMessage[]): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
        "X-Title": "AI Debate Arena",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data: OpenRouterResponse = await response.json()
    return data.choices[0]?.message?.content || ""
  }
}
