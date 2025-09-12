"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, Sparkles } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { analyzeSentiment, saveJournalEntry, type SentimentAnalysis } from "@/lib/journal"
import { useToast } from "@/hooks/use-toast"

interface JournalEditorProps {
  onSave?: () => void
}

export function JournalEditor({ onSave }: JournalEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [mood, setMood] = useState([5])
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [saving, setSaving] = useState(false)

  const { user } = useAuth()
  const { toast } = useToast()

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        title: "No content to analyze",
        description: "Please write something in your journal first.",
        variant: "destructive",
      })
      return
    }

    setAnalyzing(true)
    try {
      const result = await analyzeSentiment(content)
      setAnalysis(result)
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Unable to analyze your entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSave = async () => {
    if (!user || !title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both title and content.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      let finalAnalysis = analysis
      if (!finalAnalysis) {
        finalAnalysis = await analyzeSentiment(content)
      }

      await saveJournalEntry({
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
        mood: mood[0],
        sentiment: finalAnalysis.sentiment,
        sentimentScore: finalAnalysis.score,
        emotions: finalAnalysis.emotions,
      })

      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully.",
      })

      // Reset form
      setTitle("")
      setContent("")
      setMood([5])
      setAnalysis(null)

      onSave?.()
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Unable to save your entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getMoodLabel = (value: number) => {
    if (value <= 2) return "Very Low"
    if (value <= 4) return "Low"
    if (value <= 6) return "Neutral"
    if (value <= 8) return "Good"
    return "Excellent"
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200"
      case "negative":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            New Journal Entry
          </CardTitle>
          <CardDescription>
            Express your thoughts and feelings. Our AI will help you understand your emotional patterns.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="How are you feeling today?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your thoughts</Label>
            <Textarea
              id="content"
              placeholder="Write about your day, your feelings, or anything on your mind..."
              className="min-h-[200px] resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Mood Level: {getMoodLabel(mood[0])}</Label>
            <Slider value={mood} onValueChange={setMood} max={10} min={1} step={1} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very Low</span>
              <span>Neutral</span>
              <span>Excellent</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={analyzing || !content.trim()}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Emotions
                </>
              )}
            </Button>

            <Button onClick={handleSave} disabled={saving || !title.trim() || !content.trim()} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Entry
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
            <CardDescription>Understanding your emotional patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Overall Sentiment:</span>
              <Badge className={getSentimentColor(analysis.sentiment)}>
                {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">(Score: {analysis.score.toFixed(2)})</span>
            </div>

            {analysis.emotions.length > 0 && (
              <div>
                <span className="text-sm font-medium mb-2 block">Detected Emotions:</span>
                <div className="flex flex-wrap gap-2">
                  {analysis.emotions.map((emotion, index) => (
                    <Badge key={index} variant="secondary">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {analysis.keywords.length > 0 && (
              <div>
                <span className="text-sm font-medium mb-2 block">Key Words:</span>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-sm font-medium mb-2 block">Suggestions:</span>
              <ul className="space-y-1">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
