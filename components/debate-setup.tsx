"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ApiKeyManager } from "./api-key-manager"
import { useApiKey } from "@/hooks/use-api-key"
import { Settings, Brain, ArrowLeft, Play } from "lucide-react"

interface DebateSetupProps {
  onDebateStart: (topic: string, model1: string, model2: string) => void
  onBack: () => void
  apiKey: string
}

const AVAILABLE_MODELS = [
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", tier: "premium" },
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI", tier: "premium" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", tier: "standard" },
  { id: "meta-llama/llama-3.1-8b-instruct:free", name: "Llama 3.1 8B", provider: "Meta", tier: "free" },
  { id: "microsoft/wizardlm-2-8x22b", name: "WizardLM-2 8x22B", provider: "Microsoft", tier: "premium" },
  { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5", provider: "Google", tier: "standard" },
]

const SAMPLE_TOPICS = [
  "Artificial Intelligence will create more jobs than it destroys",
  "Social media has a net positive impact on society",
  "Remote work is better than office work for productivity",
  "Nuclear energy is essential for fighting climate change",
  "Universal Basic Income should be implemented globally",
  "Space exploration should be prioritized over ocean exploration",
]

export function DebateSetup({ onDebateStart, onBack, apiKey }: DebateSetupProps) {
  const { saveApiKey } = useApiKey()
  const [topic, setTopic] = useState("")
  const [model1, setModel1] = useState("")
  const [model2, setModel2] = useState("")
  const [showApiManager, setShowApiManager] = useState(false)

  const handleStartDebate = () => {
    if (topic.trim() && model1 && model2) {
      onDebateStart(topic.trim(), model1, model2)
    }
  }

  const handleTopicSelect = (selectedTopic: string) => {
    setTopic(selectedTopic)
  }

  const handleApiKeyUpdated = (newKey: string) => {
    saveApiKey(newKey)
    setShowApiManager(false)
  }

  const isReadyToStart = topic.trim() && model1 && model2 && model1 !== model2

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to API Setup
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowApiManager(!showApiManager)}
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Manage API Key
        </Button>
      </div>

      {showApiManager && (
        <div className="flex justify-center">
          <ApiKeyManager currentKey={apiKey} onKeyUpdated={handleApiKeyUpdated} />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Setup Your AI Debate
          </CardTitle>
          <CardDescription>Choose a topic and select two AI models to debate against each other</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topic Selection */}
          <div className="space-y-3">
            <Label htmlFor="topic" className="text-base font-medium">
              Debate Topic
            </Label>
            <Input
              id="topic"
              placeholder="Enter a debate topic or choose from suggestions below..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="text-base"
            />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Popular topics:</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_TOPICS.map((sampleTopic, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTopicSelect(sampleTopic)}
                    className="text-xs h-8"
                  >
                    {sampleTopic}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Model Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Model 1 (Pro Position)</Label>
              <Select value={model1} onValueChange={setModel1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select first model" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id} disabled={model.id === model2}>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs text-muted-foreground">{model.provider}</div>
                        </div>
                        <Badge
                          variant={
                            model.tier === "free" ? "secondary" : model.tier === "premium" ? "default" : "outline"
                          }
                          className="ml-2 text-xs"
                        >
                          {model.tier}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Model 2 (Con Position)</Label>
              <Select value={model2} onValueChange={setModel2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select second model" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id} disabled={model.id === model1}>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs text-muted-foreground">{model.provider}</div>
                        </div>
                        <Badge
                          variant={
                            model.tier === "free" ? "secondary" : model.tier === "premium" ? "default" : "outline"
                          }
                          className="ml-2 text-xs"
                        >
                          {model.tier}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Models Preview */}
          {model1 && model2 && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Debate Matchup:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">{AVAILABLE_MODELS.find((m) => m.id === model1)?.name} (Pro)</div>
                    <div className="text-muted-foreground">Arguing FOR the topic</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">{AVAILABLE_MODELS.find((m) => m.id === model2)?.name} (Con)</div>
                    <div className="text-muted-foreground">Arguing AGAINST the topic</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button onClick={handleStartDebate} disabled={!isReadyToStart} className="w-full" size="lg">
            <Play className="w-4 h-4 mr-2" />
            Start Debate
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
