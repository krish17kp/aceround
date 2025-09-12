"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { VoiceAnalysis } from "@/components/analysis/voice-analysis"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Volume2, Brain, Shield, Globe } from "lucide-react"

export default function VoicePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <Mic className="h-8 w-8" />
              Voice Analysis
            </h1>
            <p className="text-muted-foreground mt-1">
              Understand your emotional state through voice tone and speech patterns
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tone Analysis</CardTitle>
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Analyzes pitch, pace, and vocal patterns to detect emotional states
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Processing</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Advanced NLP algorithms process speech for sentiment and emotion detection
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Multi-Language</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Supports multiple languages including English, Spanish, and Hindi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Secure</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Voice recordings are processed securely and can be deleted after analysis
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Voice Component */}
        <VoiceAnalysis />

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-primary" />
              Recording Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Recording Quality</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Find a quiet environment</li>
                  <li>• Speak clearly and naturally</li>
                  <li>• Keep microphone at consistent distance</li>
                  <li>• Record for at least 10-15 seconds</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">What to Say</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Describe how you're feeling today</li>
                  <li>• Talk about recent experiences</li>
                  <li>• Share what's on your mind</li>
                  <li>• Be authentic and spontaneous</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
