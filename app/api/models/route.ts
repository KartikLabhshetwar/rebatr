import { type NextRequest, NextResponse } from "next/server"

export interface OpenRouterModel {
  id: string
  name: string
  created: number
  description: string
  context_length: number
  pricing: {
    prompt: string
    completion: string
    image?: string
    request?: string
  }
  top_provider: {
    context_length: number
    max_completion_tokens?: number | null
    is_moderated: boolean
  }
  architecture: {
    modality: string
    input_modalities: string[]
    output_modalities: string[]
    tokenizer: string
    instruct_type?: string | null
  }
}

export interface ModelForUI {
  id: string
  name: string
  provider: string
  tier: "free" | "standard" | "premium"
  description: string
  contextLength: number
  promptPrice: number
  completionPrice: number
  modality: string
  isModerated: boolean
}

function categorizeModel(model: OpenRouterModel): "free" | "standard" | "premium" {
  const promptPrice = parseFloat(model.pricing.prompt)
  const completionPrice = parseFloat(model.pricing.completion)
  const avgPrice = (promptPrice + completionPrice) / 2

  // Free tier: essentially free or very cheap
  if (avgPrice <= 0.0000005 || model.id.includes("free")) {
    return "free"
  }
  
  // Premium tier: expensive models (typically >$0.000005 average)
  if (avgPrice > 0.000005) {
    return "premium"
  }
  
  // Standard tier: mid-range pricing
  return "standard"
}

function extractProvider(modelId: string, modelName: string): string {
  // Extract provider from model ID
  if (modelId.includes("/")) {
    const provider = modelId.split("/")[0]
    const providerMap: Record<string, string> = {
      "openai": "OpenAI",
      "anthropic": "Anthropic",
      "meta-llama": "Meta",
      "google": "Google",
      "microsoft": "Microsoft",
      "mistralai": "Mistral AI",
      "cohere": "Cohere",
      "ai21": "AI21 Labs",
      "baidu": "Baidu",
      "z-ai": "Z.AI",
      "qwen": "Qwen",
      "deepseek": "DeepSeek",
    }
    return providerMap[provider] || provider.charAt(0).toUpperCase() + provider.slice(1)
  }
  
  // Fallback: extract from model name
  if (modelName.includes(":")) {
    return modelName.split(":")[0]
  }
  
  return "Unknown"
}

function filterAndSortModels(models: OpenRouterModel[]): ModelForUI[] {
  return models
    .filter(model => {
      // Filter out models that are likely not suitable for debates
      const isTextModel = model.architecture.output_modalities.includes("text")
      const hasReasonableContext = model.context_length >= 4000
      const notTooExpensive = parseFloat(model.pricing.prompt) < 0.0001 // Filter out extremely expensive models
      
      return isTextModel && hasReasonableContext && notTooExpensive
    })
    .map(model => ({
      id: model.id,
      name: model.name,
      provider: extractProvider(model.id, model.name),
      tier: categorizeModel(model),
      description: model.description,
      contextLength: model.context_length,
      promptPrice: parseFloat(model.pricing.prompt),
      completionPrice: parseFloat(model.pricing.completion),
      modality: model.architecture.modality,
      isModerated: model.top_provider.is_moderated,
    }))
    .sort((a, b) => {
      // Sort by tier first (free, standard, premium), then by popularity/price
      const tierOrder = { free: 0, standard: 1, premium: 2 }
      if (tierOrder[a.tier] !== tierOrder[b.tier]) {
        return tierOrder[a.tier] - tierOrder[b.tier]
      }
      
      // Within same tier, sort by price (cheaper first)
      return (a.promptPrice + a.completionPrice) - (b.promptPrice + b.completionPrice)
    })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || ""
    
    let url = "https://openrouter.ai/api/v1/models"
    if (category) {
      url += `?category=${encodeURIComponent(category)}`
    }
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for 10 minutes to reduce API calls
      next: { revalidate: 600 }
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    const filteredModels = filterAndSortModels(data.data)

    return NextResponse.json({
      models: filteredModels,
      total: filteredModels.length,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching models:", error)
    
    // Return fallback models if API fails
    const fallbackModels: ModelForUI[] = [
      {
        id: "anthropic/claude-3.5-sonnet",
        name: "Claude 3.5 Sonnet",
        provider: "Anthropic",
        tier: "premium",
        description: "Most capable model for complex reasoning tasks",
        contextLength: 200000,
        promptPrice: 0.000003,
        completionPrice: 0.000015,
        modality: "text->text",
        isModerated: false,
      },
      {
        id: "openai/gpt-4o",
        name: "GPT-4o",
        provider: "OpenAI",
        tier: "premium",
        description: "Latest GPT-4 model with improved reasoning",
        contextLength: 128000,
        promptPrice: 0.0000025,
        completionPrice: 0.00001,
        modality: "text+image->text",
        isModerated: true,
      },
      {
        id: "openai/gpt-4o-mini",
        name: "GPT-4o Mini",
        provider: "OpenAI",
        tier: "standard",
        description: "Faster, more affordable GPT-4 model",
        contextLength: 128000,
        promptPrice: 0.00000015,
        completionPrice: 0.0000006,
        modality: "text+image->text",
        isModerated: true,
      },
      {
        id: "meta-llama/llama-3.1-8b-instruct:free",
        name: "Llama 3.1 8B",
        provider: "Meta",
        tier: "free",
        description: "Free open-source model with good performance",
        contextLength: 128000,
        promptPrice: 0,
        completionPrice: 0,
        modality: "text->text",
        isModerated: false,
      },
    ]
    
    return NextResponse.json(
      {
        models: fallbackModels,
        total: fallbackModels.length,
        lastUpdated: new Date().toISOString(),
        error: "Using fallback models due to API error",
      },
      { status: 200 } // Still return 200 since we have fallback data
    )
  }
}
