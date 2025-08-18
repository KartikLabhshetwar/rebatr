"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ApiKeyManager } from "./api-key-manager"
import { useApiKey } from "@/hooks/use-api-key"
import { useModels } from "@/hooks/use-models"
import { Settings, Brain, ArrowLeft, Play, Loader2, AlertTriangle, Zap } from "lucide-react"

interface DebateSetupProps {
  onDebateStart: (topic: string, model1: string, model2: string) => void
  onBack: () => void
  apiKey: string
}



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
  const { models, isLoading: modelsLoading, error: modelsError } = useModels()
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

          {/* Models Loading State */}
          {modelsLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-muted-foreground">Loading available models...</span>
            </div>
          )}

          {/* Models Error State */}
          {modelsError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {modelsError}. Using fallback models.
              </AlertDescription>
            </Alert>
          )}

          {/* Model Selection */}
          {!modelsLoading && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">Model 1 (Pro Position)</Label>
                <Select value={model1} onValueChange={setModel1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select first model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id} disabled={model.id === model2}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{model.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <span>{model.provider}</span>
                              {model.tier === "free" && <Zap className="w-3 h-3 text-green-500" />}
                            </div>
                          </div>
                          <Badge
                            variant={
                              model.tier === "free" ? "secondary" : model.tier === "premium" ? "default" : "outline"
                            }
                            className="ml-2 text-xs flex-shrink-0"
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
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id} disabled={model.id === model1}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{model.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <span>{model.provider}</span>
                              {model.tier === "free" && <Zap className="w-3 h-3 text-green-500" />}
                            </div>
                          </div>
                          <Badge
                            variant={
                              model.tier === "free" ? "secondary" : model.tier === "premium" ? "default" : "outline"
                            }
                            className="ml-2 text-xs flex-shrink-0"
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
          )}

          {/* Selected Models Preview */}
          {model1 && model2 && !modelsLoading && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Debate Matchup:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">{models.find((m) => m.id === model1)?.name} (Pro)</div>
                      <div className="text-muted-foreground">Arguing FOR the topic</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">{models.find((m) => m.id === model2)?.name} (Con)</div>
                      <div className="text-muted-foreground">Arguing AGAINST the topic</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rate Limit Warning for Free Models */}
              {(model1.includes('free') || model2.includes('free')) && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-yellow-800 mb-1">Free Model Rate Limits</h5>
                      <p className="text-sm text-yellow-700 mb-2">
                        Free models have strict rate limits. Debates are optimized with:
                      </p>
                      <ul className="text-xs text-yellow-600 space-y-1">
                        <li>• 3 rounds instead of 5 (6 total messages)</li>
                        <li>• 15+ second delays between requests</li>
                        <li>• Automatic retry with exponential backoff</li>
                        <li>• Manual mode recommended for testing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
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
