"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DebateState } from "@/types/debate"
import { Download, Share2, Copy } from "lucide-react"

interface ExportDebateProps {
  debateState: DebateState
}

export function ExportDebate({ debateState }: ExportDebateProps) {
  const [copied, setCopied] = useState(false)

  const generateMarkdown = () => {
    const date = new Date().toLocaleDateString()
    let markdown = `# AI Debate: ${debateState.topic}\n\n`
    markdown += `**Date:** ${date}\n`
    markdown += `**Rounds:** ${debateState.currentRound}/${debateState.maxRounds}\n`
    markdown += `**Final Score:** Claude 3.5 Sonnet (${debateState.scores.model1}) vs GPT-4o Mini (${debateState.scores.model2})\n\n`

    markdown += `## Debate Summary\n\n`

    debateState.messages.forEach((message, index) => {
      const modelName = message.speaker === "model1" ? "Claude 3.5 Sonnet" : "GPT-4o Mini"
      const stance = message.speaker === "model1" ? "Pro" : "Con"

      markdown += `### Round ${message.round} - ${modelName} (${stance})\n\n`
      markdown += `${message.content}\n\n`
      markdown += `---\n\n`
    })

    return markdown
  }

  const generateJSON = () => {
    return JSON.stringify(
      {
        topic: debateState.topic,
        date: new Date().toISOString(),
        rounds: {
          current: debateState.currentRound,
          max: debateState.maxRounds,
        },
        scores: debateState.scores,
        messages: debateState.messages.map((msg) => ({
          round: msg.round,
          speaker: msg.speaker === "model1" ? "Claude 3.5 Sonnet (Pro)" : "GPT-4o Mini (Con)",
          content: msg.content,
          timestamp: new Date(msg.timestamp).toISOString(),
        })),
      },
      null,
      2,
    )
  }

  const generatePlainText = () => {
    const date = new Date().toLocaleDateString()
    let text = `AI DEBATE: ${debateState.topic.toUpperCase()}\n`
    text += `Date: ${date}\n`
    text += `Rounds: ${debateState.currentRound}/${debateState.maxRounds}\n`
    text += `Final Score: Claude 3.5 Sonnet (${debateState.scores.model1}) vs GPT-4o Mini (${debateState.scores.model2})\n\n`
    text += `${"=".repeat(60)}\n\n`

    debateState.messages.forEach((message) => {
      const modelName = message.speaker === "model1" ? "Claude 3.5 Sonnet" : "GPT-4o Mini"
      const stance = message.speaker === "model1" ? "Pro" : "Con"

      text += `ROUND ${message.round} - ${modelName.toUpperCase()} (${stance.toUpperCase()})\n`
      text += `${"-".repeat(40)}\n`
      text += `${message.content}\n\n`
    })

    return text
  }

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (debateState.messages.length === 0) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Export Debate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Debate</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="markdown" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="text">Plain Text</TabsTrigger>
          </TabsList>

          <TabsContent value="markdown" className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={() => copyToClipboard(generateMarkdown())} variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                onClick={() => downloadFile(generateMarkdown(), `debate-${Date.now()}.md`, "text/markdown")}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <Textarea value={generateMarkdown()} readOnly className="h-64 font-mono text-xs" />
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={() => copyToClipboard(generateJSON())} variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                onClick={() => downloadFile(generateJSON(), `debate-${Date.now()}.json`, "application/json")}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <Textarea value={generateJSON()} readOnly className="h-64 font-mono text-xs" />
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={() => copyToClipboard(generatePlainText())} variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                onClick={() => downloadFile(generatePlainText(), `debate-${Date.now()}.txt`, "text/plain")}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <Textarea value={generatePlainText()} readOnly className="h-64 font-mono text-xs" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
