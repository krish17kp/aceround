"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, Square, RotateCcw, Loader2, Eye, AlertCircle } from "lucide-react"
import { detectFaceEmotions, saveEmotionResult, type EmotionResult } from "@/lib/emotion-analysis"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export function CameraEmotion() {
  const [isRecording, setIsRecording] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<EmotionResult | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { user } = useAuth()
  const { toast } = useToast()

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      })

      setStream(mediaStream)
      setIsRecording(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use emotion detection.",
        variant: "destructive",
      })
    }
  }, [toast])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsRecording(false)
  }, [stream])

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !user) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data
    const imageData = canvas.toDataURL("image/jpeg", 0.8)
    setCapturedImage(imageData)

    // Stop camera
    stopCamera()

    // Analyze emotions
    setAnalyzing(true)
    try {
      const emotionResult = await detectFaceEmotions(imageData)
      emotionResult.userId = user.id

      // Save result
      await saveEmotionResult(emotionResult)
      setResult(emotionResult)

      toast({
        title: "Analysis complete",
        description: `Detected dominant emotion: ${emotionResult.dominantEmotion}`,
      })
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Unable to analyze emotions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAnalyzing(false)
    }
  }, [user, stopCamera, toast])

  const resetAnalysis = () => {
    setResult(null)
    setCapturedImage(null)
    setAnalyzing(false)
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return "bg-green-100 text-green-800"
      case "sad":
        return "bg-blue-100 text-blue-800"
      case "angry":
        return "bg-red-100 text-red-800"
      case "surprised":
        return "bg-yellow-100 text-yellow-800"
      case "fearful":
        return "bg-purple-100 text-purple-800"
      case "disgusted":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Emotion Detection Camera
          </CardTitle>
          <CardDescription>
            Use your camera to analyze your current emotional state through facial expressions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camera/Image Display */}
          <div className="flex justify-center">
            <div className="relative w-80 h-60 bg-muted rounded-lg overflow-hidden">
              {isRecording ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      videoRef.current.play()
                    }
                  }}
                />
              ) : capturedImage ? (
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured for analysis"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Camera preview will appear here</p>
                  </div>
                </div>
              )}

              {/* Face detection overlay (mock) */}
              {isRecording && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-red-500 rounded"></div>
                </div>
              )}
            </div>
          </div>

          {/* Hidden canvas for image capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!isRecording && !capturedImage && !analyzing && (
              <Button onClick={startCamera} className="gap-2">
                <Camera className="h-4 w-4" />
                Start Camera
              </Button>
            )}

            {isRecording && (
              <>
                <Button onClick={capturePhoto} className="gap-2">
                  <Square className="h-4 w-4" />
                  Capture & Analyze
                </Button>
                <Button onClick={stopCamera} variant="outline" className="gap-2 bg-transparent">
                  Cancel
                </Button>
              </>
            )}

            {(capturedImage || result) && !analyzing && (
              <Button onClick={resetAnalysis} variant="outline" className="gap-2 bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            )}
          </div>

          {/* Analysis Loading */}
          {analyzing && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Analyzing facial expressions...</p>
              <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Emotion Analysis Results</h3>
                <Badge className={getEmotionColor(result.dominantEmotion)} variant="secondary">
                  Dominant: {result.dominantEmotion.charAt(0).toUpperCase() + result.dominantEmotion.slice(1)}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </p>
              </div>

              {/* Emotion Breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium">Emotion Breakdown</h4>
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
                  <Eye className="h-4 w-4" />
                  Insights
                </h4>
                <ul className="space-y-1">
                  {result.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-medium text-accent-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-accent-foreground mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
