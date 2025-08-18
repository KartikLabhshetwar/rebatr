"use client"

import { useState, useEffect } from "react"
import { ApiKeySetup } from "./api-key-setup"
import { DebateSetup } from "./debate-setup"
import { DebateDisplay } from "./debate-display"
import { ErrorBoundary } from "./error-boundary"
import { KeyboardShortcuts } from "./keyboard-shortcuts"
import { SettingsPanel } from "./settings-panel"
import { useApiKey } from "@/hooks/use-api-key"
import type { DebateState } from "@/types/debate"

export function DebateArena() {
  const { apiKey, isLoaded, saveApiKey } = useApiKey()
  const [settings, setSettings] = useState({
    autoMode: false,
    soundEnabled: true,
    animationSpeed: 1,
    theme: "system",
  })
  const [showShortcuts, setShowShortcuts] = useState(false)

  const [debateState, setDebateState] = useState<DebateState>({
    topic: "",
    messages: [],
    currentRound: 0,
    maxRounds: 5,
    isActive: false,
    scores: { model1: 0, model2: 0 },
  })

  const [currentStep, setCurrentStep] = useState<"api-key" | "setup" | "debate">("api-key")

  useEffect(() => {
    if (isLoaded) {
      if (apiKey) {
        setCurrentStep("setup")
      } else {
        setCurrentStep("api-key")
      }
    }
  }, [apiKey, isLoaded])

  const handleApiKeyValidated = (key: string) => {
    saveApiKey(key)
    setCurrentStep("setup")
  }

  const handleDebateStart = (topic: string, model1: string, model2: string) => {
    setDebateState((prev) => ({
      ...prev,
      topic,
      messages: [],
      currentRound: 0,
      isActive: true,
      scores: { model1: 0, model2: 0 },
    }))
    setCurrentStep("debate")
  }

  const handleDebateReset = () => {
    setDebateState({
      topic: "",
      messages: [],
      currentRound: 0,
      maxRounds: 5,
      isActive: false,
      scores: { model1: 0, model2: 0 },
    })
    setCurrentStep("setup")
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?") {
        e.preventDefault()
        setShowShortcuts(true)
      }
      if (e.key === "Escape") {
        setShowShortcuts(false)
      }
      if (currentStep === "setup" && e.key === "s") {
        // Already on setup
      }
      if (currentStep === "debate") {
        if (e.key === " ") {
          e.preventDefault()
          setSettings((prev) => ({ ...prev, autoMode: !prev.autoMode }))
        }
        if (e.key === "r") {
          e.preventDefault()
          handleDebateReset()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentStep])

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto">
        {(currentStep === "setup" || currentStep === "debate") && (
          <div className="mb-4 flex justify-end">
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          </div>
        )}

        {currentStep === "api-key" && <ApiKeySetup onApiKeyValidated={handleApiKeyValidated} />}

        {currentStep === "setup" && (
          <DebateSetup onDebateStart={handleDebateStart} onBack={() => setCurrentStep("api-key")} apiKey={apiKey} />
        )}

        {currentStep === "debate" && (
          <DebateDisplay
            debateState={debateState}
            setDebateState={setDebateState}
            apiKey={apiKey}
            onReset={handleDebateReset}
            settings={settings}
          />
        )}

        <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      </div>
    </ErrorBoundary>
  )
}
