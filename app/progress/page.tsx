"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProgressOverview } from "@/components/progress/progress-overview"
import { ActivityChart } from "@/components/progress/activity-chart"
import { EmotionBreakdown } from "@/components/progress/emotion-breakdown"
import { WeeklyInsights } from "@/components/progress/weekly-insights"
import { GoalsTracker } from "@/components/progress/goals-tracker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, Calendar, TrendingUp } from "lucide-react"
import {
  generateMockActivityData,
  generateEmotionTrends,
  calculateProgressMetrics,
  generateWeeklyInsights,
  type ProgressMetrics,
  type ActivityData,
  type EmotionTrend,
  type WeeklyInsight,
} from "@/lib/analytics"
import { useAuth } from "@/lib/auth"

export default function ProgressPage() {
  const [metrics, setMetrics] = useState<ProgressMetrics | null>(null)
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [emotionTrends, setEmotionTrends] = useState<EmotionTrend[]>([])
  const [insights, setInsights] = useState<WeeklyInsight[]>([])
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()

  useEffect(() => {
    const loadProgressData = async () => {
      if (!user) return

      setLoading(true)
      try {
        // Generate mock data - replace with actual data fetching
        const activity = generateMockActivityData(30)
        const emotions = generateEmotionTrends()
        const progressMetrics = calculateProgressMetrics([], [], []) // Pass actual data here
        const weeklyInsights = generateWeeklyInsights(progressMetrics)

        setActivityData(activity)
        setEmotionTrends(emotions)
        setMetrics(progressMetrics)
        setInsights(weeklyInsights)
      } catch (error) {
        console.error("Failed to load progress data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProgressData()
  }, [user])

  const exportData = () => {
    // Mock export functionality
    console.log("Exporting progress data...")
  }

  if (loading || !metrics) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Progress Analytics
            </h1>
            <p className="text-muted-foreground mt-1">Track your emotional intelligence growth and wellness journey</p>
          </div>
          <Button onClick={exportData} variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Overview Metrics */}
        <ProgressOverview metrics={metrics} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="emotions" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Emotions
            </TabsTrigger>
            <TabsTrigger value="goals" className="gap-2">
              <Calendar className="h-4 w-4" />
              Goals
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityChart data={activityData} type="mood" />
              <ActivityChart data={activityData} type="activity" />
            </div>
          </TabsContent>

          <TabsContent value="emotions" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EmotionBreakdown trends={emotionTrends} />
              <Card>
                <CardHeader>
                  <CardTitle>Emotion Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-muted rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Most Frequent Emotion</h3>
                      <p className="text-2xl font-bold text-primary">Happy</p>
                      <p className="text-sm text-muted-foreground">Detected 45% of the time</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Positive Emotions</p>
                        <p className="text-xl font-bold text-green-600">68%</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Emotional Stability</p>
                        <p className="text-xl font-bold text-blue-600">82%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <GoalsTracker />
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <WeeklyInsights insights={insights} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
