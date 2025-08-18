"use client"

import { useState, useEffect } from "react"

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

interface ModelsResponse {
  models: ModelForUI[]
  total: number
  lastUpdated: string
  error?: string
}

export function useModels() {
  const [models, setModels] = useState<ModelForUI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    async function fetchModels() {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch("/api/models")
        const data: ModelsResponse = await response.json()
        
        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.statusText}`)
        }
        
        setModels(data.models)
        setLastUpdated(data.lastUpdated)
        
        if (data.error) {
          setError(data.error)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load models"
        setError(errorMessage)
        console.error("Error fetching models:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchModels()
  }, [])

  const getModelById = (id: string) => {
    return models.find(model => model.id === id)
  }

  const getModelsByTier = (tier: "free" | "standard" | "premium") => {
    return models.filter(model => model.tier === tier)
  }

  const getModelsByProvider = (provider: string) => {
    return models.filter(model => model.provider === provider)
  }

  return {
    models,
    isLoading,
    error,
    lastUpdated,
    getModelById,
    getModelsByTier,
    getModelsByProvider,
  }
}
