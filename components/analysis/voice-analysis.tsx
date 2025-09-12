"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, Square, Play, Pause, RotateCcw, Loader2, Volume2, AlertCircle } from "lucide-react"
import { analyzeVoice, saveEmotionResult, type VoiceAnalysisType } from "@/lib/emotion-analysis"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export function VoiceAnalysisComponent() {
  const [isRecording, setIsRecording] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<(VoiceAnalysisType & { emotions: any }) | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const { user } = useAuth()
  const { toast } = useToast()

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice analysis.",
        variant: "destructive",
      })
    }
  }, [toast])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  const analyzeRecording = useCallback(async () => {
    if (!audioBlob || !user) return

    setAnalyzing(true)
    try {
      const voiceResult = await analyzeVoice(audioBlob)

      // Save as emotion result
      await saveEmotionResult({
        userId: user.id,
        type: "voice",
        emotions: voiceResult.emotions,
        dominantEmotion: Object.entries(voiceResult.emotions).reduce((a, b) =>
          voiceResult.emotions[a[0] as keyof typeof voiceResult.emotions] >
          voiceResult.emotions[b[0] as keyof typeof voiceResult.emotions]
            ? a
            : b,
        )[0],
        confidence: voiceResult.confidence,
        insights: [
          `Voice sentiment: ${voiceResult.sentiment}`,
          `Tone detected: ${voiceResult.tone}`,
          `Speaking pace: ${voiceResult.pace}`,
        ],
        recommendations: [
          voiceResult.sentiment === "negative"
            ? "Consider practicing calming breathing exercises"
            : "Your voice reflects positive emotional energy",
          "Regular voice check-ins can help track emotional patterns",
          "Try speaking exercises to improve emotional expression",
        ],
      })

      setResult(voiceResult)

      toast({
        title: "Analysis complete",
        description: `Voice sentiment: ${voiceResult.sentiment}, Tone: ${voiceResult.tone}`,
      })
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Unable to analyze voice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAnalyzing(false)
    }
  }, [audioBlob, user, toast])

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const resetAnalysis = () => {
    setResult(null)
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    setIsPlaying(false)
    setAnalyzing(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "negative":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getToneColor = (tone: string) => {
    switch (tone) {
      case "calm":
        return "bg-blue-100 text-blue-800"
      case "excited":
        return "bg-yellow-100 text-yellow-800"
      case "stressed":
        return "bg-red-100 text-red-800"
      case "confident":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Voice Emotion Analysis
          </CardTitle>
          <CardDescription>
            Record your voice to analyze emotional tone, sentiment, and speaking patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Interface */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div
                className={`w-full h-full rounded-full border-4 flex items-center justify-center ${
                  isRecording ? "border-red-500 bg-red-50 animate-pulse" : "border-primary bg-primary/10"
                }`}
              >
                <Mic className={`h-12 w-12 ${isRecording ? "text-red-600" : "text-primary"}`} />
              </div>
              {isRecording && (
                <div className="absolute -inset-2 rounded-full border-2 border-red-300 animate-ping"></div>
              )}
            </div>

            {isRecording && <div className="text-lg font-mono text-red-600 mb-4">{formatTime(recordingTime)}</div>}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!isRecording && !audioBlob && !analyzing && (
              <Button onClick={startRecording} className="gap-2">
                <Mic className="h-4 w-4" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <Button onClick={stopRecording} variant="destructive" className="gap-2">
                <Square className="h-4 w-4" />
                Stop Recording
              </Button>
            )}

            {audioBlob && !analyzing && !result && (
              <>
                <Button onClick={playAudio} variant="outline" className="gap-2 bg-transparent">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button onClick={analyzeRecording} className="gap-2">
                  <Volume2 className="h-4 w-4" />
                  Analyze Voice
                </Button>
              </>
            )}

            {(result || analyzing) && (
              <Button onClick={resetAnalysis} variant="outline" className="gap-2 bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Record Again
              </Button>
            )}
          </div>

          {/* Audio Player */}
          {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />}

          {/* Analysis Loading */}
          {analyzing && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Analyzing voice patterns...</p>
              <p className="text-xs text-muted-foreground mt-1">Processing tone, sentiment, and emotions</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-3">Voice Analysis Results</h3>
                <div className="flex justify-center gap-2 mb-2">
                  <Badge className={getSentimentColor(result.sentiment)}>
                    {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
                  </Badge>
                  <Badge className={getToneColor(result.tone)}>
                    {result.tone.charAt(0).toUpperCase() + result.tone.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
              </div>

              {/* Voice Characteristics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Pitch</p>
                  <p className="text-lg capitalize">{result.pitch}</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Pace</p>
                  <p className="text-lg capitalize">{result.pace}</p>
                </div>
              </div>

              {/* Emotion Breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium">Detected Emotions</h4>
                {Object.entries(result.emotions).map(([emotion, value]) => (
                  <div key={emotion} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{emotion}</span>
                      <span>{(value * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={value * 100} className="h-2" />
                  </div>
                ))}
              </div>

              {/* Insights */}
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Voice Insights
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-muted-foreground">• Voice sentiment: {result.sentiment}</li>
                  <li className="text-sm text-muted-foreground">• Tone detected: {result.tone}</li>
                  <li className="text-sm text-muted-foreground">• Speaking pace: {result.pace}</li>
                  <li className="text-sm text-muted-foreground">• Language: {result.language}</li>
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-medium text-accent-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent-foreground mt-1">•</span>
                    {result.sentiment === "negative"
                      ? "Consider practicing calming breathing exercises"
                      : "Your voice reflects positive emotional energy"}
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent-foreground mt-1">•</span>
                    Regular voice check-ins can help track emotional patterns
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent-foreground mt-1">•</span>
                    Try speaking exercises to improve emotional expression
                  </li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
