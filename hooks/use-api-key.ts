"use client"

import { useState, useEffect } from "react"

const API_KEY_STORAGE_KEY = "openrouter-api-key"

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load API key from localStorage on mount
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY)
    if (storedKey) {
      setApiKey(storedKey)
    }
    setIsLoaded(true)
  }, [])

  const saveApiKey = (key: string) => {
    setApiKey(key)
    localStorage.setItem(API_KEY_STORAGE_KEY, key)
  }

  const clearApiKey = () => {
    setApiKey("")
    localStorage.removeItem(API_KEY_STORAGE_KEY)
  }

  const hasValidKey = () => {
    return apiKey.length > 0
  }

  return {
    apiKey,
    isLoaded,
    saveApiKey,
    clearApiKey,
    hasValidKey,
  }
}
