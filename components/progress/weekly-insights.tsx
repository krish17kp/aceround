"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, CheckCircle } from "lucide-react"
import type { WeeklyInsight } from "@/lib/analytics"

interface WeeklyInsightsProps {
  insights: WeeklyInsight[]
}

export function WeeklyInsights({ insights }: WeeklyInsightsProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "improvement":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      default:
        return <Lightbulb className="h-4 w-4 text-yellow-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "improvement":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Weekly Insights
        </CardTitle>
        <CardDescription>Personalized insights based on your emotional wellness journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{insight.title}</h4>
                <Badge variant="outline" className={getInsightColor(insight.type)}>
                  {insight.metric}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
