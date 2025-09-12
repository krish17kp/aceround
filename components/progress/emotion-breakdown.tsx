"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { EmotionTrend } from "@/lib/analytics"

interface EmotionBreakdownProps {
  trends: EmotionTrend[]
}

export function EmotionBreakdown({ trends }: EmotionBreakdownProps) {
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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (change: number) => {
    if (change > 0.05) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < -0.05) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getTrendText = (change: number) => {
    if (change > 0.05) return "Increasing"
    if (change < -0.05) return "Decreasing"
    return "Stable"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotion Patterns</CardTitle>
        <CardDescription>Your emotional patterns over the past week</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {trends.map((trend) => (
          <div key={trend.emotion} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={getEmotionColor(trend.emotion)}>
                  {trend.emotion.charAt(0).toUpperCase() + trend.emotion.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">{(trend.average * 100).toFixed(1)}% avg</span>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(trend.change)}
                <span className="text-xs text-muted-foreground">{getTrendText(trend.change)}</span>
              </div>
            </div>
            <Progress value={trend.average * 100} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
