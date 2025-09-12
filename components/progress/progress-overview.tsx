"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Target, Calendar, Brain, Heart } from "lucide-react"
import type { ProgressMetrics } from "@/lib/analytics"

interface ProgressOverviewProps {
  metrics: ProgressMetrics
}

export function ProgressOverview({ metrics }: ProgressOverviewProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "bg-green-100 text-green-800"
      case "declining":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getScoreColor(metrics.overallScore)}`}>
            {metrics.overallScore.toFixed(0)}%
          </div>
          <Progress value={metrics.overallScore} className="mt-2 h-2" />
          <p className="text-xs text-muted-foreground mt-1">Emotional wellness score</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">EQ Level</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getScoreColor(metrics.emotionalIntelligence)}`}>
            {metrics.emotionalIntelligence.toFixed(0)}%
          </div>
          <Progress value={metrics.emotionalIntelligence} className="mt-2 h-2" />
          <p className="text-xs text-muted-foreground mt-1">Emotional intelligence</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mood Trend</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {getTrendIcon(metrics.moodTrend)}
            <Badge className={getTrendColor(metrics.moodTrend)}>
              {metrics.moodTrend.charAt(0).toUpperCase() + metrics.moodTrend.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">7-day mood pattern</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Activity Streak</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{metrics.streakDays}</div>
          <p className="text-xs text-muted-foreground mt-1">{metrics.streakDays === 1 ? "day" : "days"} consecutive</p>
          <div className="mt-2">
            <Progress value={metrics.weeklyGoalProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Weekly goal: {metrics.weeklyGoalProgress.toFixed(0)}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
