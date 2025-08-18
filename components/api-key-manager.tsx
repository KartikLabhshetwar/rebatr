"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Key, Edit2, Check, X, Loader2 } from "lucide-react"

interface ApiKeyManagerProps {
  currentKey: string
  onKeyUpdated: (newKey: string) => void
}

export function ApiKeyManager({ currentKey, onKeyUpdated }: ApiKeyManagerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newKey, setNewKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState("")

  const maskedKey = currentKey ? `${currentKey.slice(0, 8)}...${currentKey.slice(-4)}` : ""

  const handleStartEdit = () => {
    setIsEditing(true)
    setNewKey("")
    setError("")
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setNewKey("")
    setError("")
  }

  const handleSaveKey = async () => {
    if (!newKey.trim()) {
      setError("Please enter an API key")
      return
    }

    setIsValidating(true)
    setError("")

    try {
      const response = await fetch("/api/validate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey: newKey.trim() }),
      })

      const data = await response.json()

      if (data.isValid) {
        onKeyUpdated(newKey.trim())
        setIsEditing(false)
        setNewKey("")
      } else {
        setError("Invalid API key. Please check your key and try again.")
      }
    } catch (error) {
      setError("Failed to validate API key. Please try again.")
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          API Key Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Current API Key</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded">{maskedKey}</code>
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
            <Button onClick={handleStartEdit} variant="outline" size="sm" className="w-full bg-transparent">
              <Edit2 className="w-4 h-4 mr-2" />
              Update API Key
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="new-api-key">New API Key</Label>
              <Input
                id="new-api-key"
                type="password"
                placeholder="sk-or-v1-..."
                value={newKey}
                onChange={(e) => {
                  setNewKey(e.target.value)
                  setError("")
                }}
                disabled={isValidating}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={handleSaveKey} disabled={isValidating || !newKey.trim()} size="sm" className="flex-1">
                {isValidating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" size="sm" disabled={isValidating}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
