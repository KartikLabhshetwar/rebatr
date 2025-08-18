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
  error?: {
    message: string
    type: string
    code: string
  }
}

interface RateLimitInfo {
  lastRequestTime: number
  requestCount: number
  resetTime: number
}

export class OpenRouterClient {
  private apiKey: string
  private baseUrl = "https://openrouter.ai/api/v1"
  private static rateLimitInfo: RateLimitInfo = {
    lastRequestTime: 0,
    requestCount: 0,
    resetTime: 0
  }
  private static readonly MAX_REQUESTS_PER_MINUTE = 6  // Much more conservative
  private static readonly MIN_REQUEST_INTERVAL = 10000 // 10 seconds between requests
  private static requestQueue: Promise<any> = Promise.resolve() // Request queue to prevent overlapping

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async waitForRateLimit(model: string): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - OpenRouterClient.rateLimitInfo.lastRequestTime
    
    // Different limits for free vs paid models
    const isFreeModel = model.includes(':free') || model.includes('free')
    const minInterval = isFreeModel ? 15000 : OpenRouterClient.MIN_REQUEST_INTERVAL // 15s for free models
    const maxRequestsPerMinute = isFreeModel ? 3 : OpenRouterClient.MAX_REQUESTS_PER_MINUTE // 3 requests per minute for free
    
    console.log(`Model: ${model}, Free: ${isFreeModel}, Min Interval: ${minInterval}ms, Max/min: ${maxRequestsPerMinute}`)
    
    // If less than minimum interval has passed, wait
    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest
      console.log(`Rate limiting: waiting ${Math.ceil(waitTime/1000)}s before next request`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    // Reset counter if it's been more than a minute
    if (now - OpenRouterClient.rateLimitInfo.resetTime > 60000) {
      OpenRouterClient.rateLimitInfo.requestCount = 0
      OpenRouterClient.rateLimitInfo.resetTime = now
    }
    
    // If we've hit the rate limit, wait until reset
    if (OpenRouterClient.rateLimitInfo.requestCount >= maxRequestsPerMinute) {
      const waitTime = 60000 - (now - OpenRouterClient.rateLimitInfo.resetTime)
      if (waitTime > 0) {
        console.log(`Rate limit reached: waiting ${Math.ceil(waitTime/1000)}s before next request`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        OpenRouterClient.rateLimitInfo.requestCount = 0
        OpenRouterClient.rateLimitInfo.resetTime = Date.now()
      }
    }
    
    OpenRouterClient.rateLimitInfo.lastRequestTime = Date.now()
    OpenRouterClient.rateLimitInfo.requestCount++
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
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

  async generateResponse(model: string, messages: OpenRouterMessage[], maxRetries: number = 3): Promise<string> {
    // Queue requests to prevent overlapping
    return OpenRouterClient.requestQueue = OpenRouterClient.requestQueue.then(async () => {
      let lastError: Error | null = null
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
        // Wait for rate limit before making request
        await this.waitForRateLimit(model)
        
        console.log(`Attempt ${attempt}/${maxRetries}: Generating response with model ${model}`)
        
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

        // Handle different types of errors
        if (!response.ok) {
          const errorText = await response.text()
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`
          
          try {
            const errorData = JSON.parse(errorText)
            if (errorData.error?.message) {
              errorMessage = errorData.error.message
            }
          } catch {
            // Use the raw error text if JSON parsing fails
            if (errorText) {
              errorMessage = errorText
            }
          }
          
          // Handle specific error types
          if (response.status === 429) {
            console.log(`Rate limited on attempt ${attempt}, waiting before retry...`)
            if (attempt < maxRetries) {
              // Exponential backoff for rate limiting
              const waitTime = Math.min(30000, 5000 * Math.pow(2, attempt - 1))
              await this.delay(waitTime)
              continue
            }
            throw new Error(`Rate limit exceeded. Please try again in a few minutes.`)
          } else if (response.status === 401) {
            throw new Error(`Invalid API key. Please check your OpenRouter API key.`)
          } else if (response.status === 402) {
            throw new Error(`Insufficient credits. Please check your OpenRouter account balance.`)
          } else if (response.status >= 500) {
            console.log(`Server error on attempt ${attempt}: ${errorMessage}`)
            if (attempt < maxRetries) {
              await this.delay(2000 * attempt) // Progressive delay for server errors
              continue
            }
            throw new Error(`OpenRouter server error: ${errorMessage}`)
          } else {
            throw new Error(`OpenRouter API error: ${errorMessage}`)
          }
        }

        const data: OpenRouterResponse = await response.json()
        
        if (data.error) {
          throw new Error(`OpenRouter API error: ${data.error.message}`)
        }
        
        const content = data.choices[0]?.message?.content
        if (!content) {
          throw new Error("No response content received from the model")
        }
        
        console.log(`Successfully generated response on attempt ${attempt}`)
        return content
        
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error))
          console.error(`Attempt ${attempt}/${maxRetries} failed:`, lastError.message)
          
          // Don't retry for certain errors
          if (lastError.message.includes('Invalid API key') || 
              lastError.message.includes('Insufficient credits')) {
            throw lastError
          }
          
          // If this isn't the last attempt, wait before retrying
          if (attempt < maxRetries) {
            const waitTime = 1000 * attempt // Progressive delay
            console.log(`Waiting ${waitTime}ms before retry...`)
            await this.delay(waitTime)
          }
        }
      }
      
      // If we've exhausted all retries, throw the last error
      throw lastError || new Error("Failed to generate response after all retries")
    })
  }
}
