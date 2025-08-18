"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Key, CheckCircle, XCircle, ExternalLink } from "lucide-react"

interface ApiKeySetupProps {
  onApiKeyValidated: (key: string) => void
}

export function ApiKeySetup({ onApiKeyValidated }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [isValid, setIsValid] = useState(false)

  const handleValidateKey = async () => {
    if (!apiKey.trim()) {
      setValidationError("Please enter an API key")
      return
    }

    setIsValidating(true)
    setValidationError("")

    try {
      const response = await fetch("/api/validate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      })

      const data = await response.json()

      if (data.isValid) {
        setIsValid(true)
        setTimeout(() => {
          onApiKeyValidated(apiKey.trim())
        }, 1000)
      } else {
        setValidationError("Invalid API key. Please check your key and try again.")
      }
    } catch (error) {
      setValidationError("Failed to validate API key. Please try again.")
    } finally {
      setIsValidating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isValidating) {
      handleValidateKey()
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Setup OpenRouter API Key</CardTitle>
          <CardDescription>Enter your OpenRouter API key to start debating with AI models</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenRouter API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-or-v1-..."
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                setValidationError("")
                setIsValid(false)
              }}
              onKeyPress={handleKeyPress}
              disabled={isValidating || isValid}
            />
          </div>

          {validationError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {isValid && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>API key validated successfully! Redirecting...</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleValidateKey} disabled={isValidating || isValid || !apiKey.trim()} className="w-full">
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : isValid ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Validated
              </>
            ) : (
              "Validate API Key"
            )}
          </Button>

          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">Don't have an OpenRouter API key?</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    Get API Key
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
                <span className="text-xs">Free tier available</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <details className="text-sm text-muted-foreground">
          <summary className="cursor-pointer hover:text-foreground">Why do I need an API key?</summary>
          <div className="mt-2 text-left bg-muted/50 p-3 rounded-md">
            <p className="mb-2">This app uses OpenRouter to access various AI models for debates. Your API key:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Stays in your browser - never stored on our servers</li>
              <li>Gives you access to 100+ AI models</li>
              <li>Allows you to control your usage and costs</li>
              <li>Ensures your debates are private and secure</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  )
}
