"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle, Key, Brain, Trophy, Zap } from "lucide-react"

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle className="w-4 h-4 mr-2" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Debate Arena - Help & Guide</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Step 1: API Key Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  You need an OpenRouter API key to access AI models for debates.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">How to get an API key:</p>
                  <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                    <li>
                      Visit{" "}
                      <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        openrouter.ai/keys
                      </a>
                    </li>
                    <li>Sign up for a free account</li>
                    <li>Generate your API key</li>
                    <li>Paste it in the setup screen</li>
                  </ol>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Free tier available with usage limits
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Step 2: Setup Debate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Choose your debate topic:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Enter a custom topic or select from suggestions</li>
                    <li>Make it debatable with clear pro/con positions</li>
                    <li>Avoid overly complex or niche topics</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Select AI models:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Choose two different models for variety</li>
                    <li>Model 1 argues FOR the topic</li>
                    <li>Model 2 argues AGAINST the topic</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Step 3: Start Debating
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Control options:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>
                      <strong>Manual Mode:</strong> Click "Next Round" to generate arguments
                    </li>
                    <li>
                      <strong>Auto Mode:</strong> Debate runs automatically with delays
                    </li>
                    <li>
                      <strong>Pause/Resume:</strong> Control the debate flow anytime
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Real-time Debate Display</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Watch AI models debate in real-time with:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Typing indicators during argument generation</li>
                    <li>Smooth animations for new messages</li>
                    <li>Live statistics and progress tracking</li>
                    <li>Auto-scrolling to latest arguments</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Intelligent Scoring</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Two scoring modes available:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>Auto Scoring:</strong> AI analyzes arguments automatically
                    </li>
                    <li>
                      <strong>Manual Scoring:</strong> You control the points
                    </li>
                    <li>Detailed analytics and round-by-round breakdown</li>
                    <li>Score criteria: Logic, Evidence, Persuasiveness, Relevance, Clarity</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export & Share</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Save and share your debates:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Export as Markdown, JSON, or Plain Text</li>
                    <li>Copy to clipboard or download files</li>
                    <li>Includes full debate transcript and scores</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Scoring System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Auto Scoring Criteria (0-10 each):</h4>
                    <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <div>
                        <strong>Logic (25%):</strong> Reasoning structure and logical connections
                      </div>
                      <div>
                        <strong>Evidence (25%):</strong> Use of facts, examples, and supporting data
                      </div>
                      <div>
                        <strong>Persuasiveness (20%):</strong> Compelling and convincing language
                      </div>
                      <div>
                        <strong>Relevance (20%):</strong> Staying on topic and addressing the debate
                      </div>
                      <div>
                        <strong>Clarity (10%):</strong> Clear communication and structure
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm">Manual Scoring Tips:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                      <li>Award points for strong, well-reasoned arguments</li>
                      <li>Consider how well they address counterpoints</li>
                      <li>Look for evidence and specific examples</li>
                      <li>Rate the persuasiveness and impact</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How much does it cost?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Costs depend on your OpenRouter usage. Most models cost $0.001-0.01 per 1K tokens. A typical debate
                    (10 arguments) costs $0.05-0.50.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Is my API key secure?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Yes! Your API key is stored only in your browser's local storage and never sent to our servers. It's
                    used directly with OpenRouter's API.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Can I use different models?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Currently, the app uses Claude 3.5 Sonnet and GPT-4o Mini for optimal debate quality. More model
                    options may be added in future updates.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">What makes a good debate topic?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Good topics are controversial with clear pro/con positions, relevant to current issues, and specific
                    enough for focused arguments. Avoid overly technical or niche subjects.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
