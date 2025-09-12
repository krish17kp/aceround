import type { JournalEntry } from "./journal"
import type { GameResult } from "./games"
import type { EmotionResult } from "./emotion-analysis"

export interface ProgressMetrics {
  overallScore: number
  emotionalIntelligence: number
  moodTrend: "improving" | "stable" | "declining"
  streakDays: number
  totalActivities: number
  weeklyGoalProgress: number
}

export interface ActivityData {
  date: string
  journalEntries: number
  gamesPlayed: number
  emotionCheckins: number
  moodScore: number
}

export interface EmotionTrend {
  emotion: string
  trend: number[] // 7-day trend
  average: number
  change: number
}

export interface WeeklyInsight {
  title: string
  description: string
  type: "positive" | "neutral" | "improvement"
  metric: string
}

// Mock data generators for comprehensive analytics
export function generateMockActivityData(days = 30): ActivityData[] {
  const data: ActivityData[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      journalEntries: Math.floor(Math.random() * 3),
      gamesPlayed: Math.floor(Math.random() * 5),
      emotionCheckins: Math.floor(Math.random() * 4),
      moodScore: Math.random() * 4 + 6, // 6-10 range
    })
  }

  return data
}

export function generateEmotionTrends(): EmotionTrend[] {
  const emotions = ["happy", "sad", "angry", "surprised", "neutral"]

  return emotions.map((emotion) => {
    const trend = Array.from({ length: 7 }, () => Math.random() * 0.4 + 0.1)
    const average = trend.reduce((sum, val) => sum + val, 0) / trend.length
    const change = trend[6] - trend[0]

    return {
      emotion,
      trend,
      average,
      change,
    }
  })
}

export function calculateProgressMetrics(
  journalEntries: JournalEntry[],
  gameResults: GameResult[],
  emotionResults: EmotionResult[],
): ProgressMetrics {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Calculate recent activity
  const recentJournals = journalEntries.filter((entry) => entry.createdAt >= weekAgo)
  const recentGames = gameResults.filter((result) => result.createdAt >= weekAgo)
  const recentEmotions = emotionResults.filter((result) => result.timestamp >= weekAgo)

  // Calculate mood trend
  const recentMoods = recentJournals.map((entry) => entry.mood)
  const avgMood = recentMoods.length > 0 ? recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length : 5

  // Calculate EQ score based on game performance
  const gameScores = recentGames.map((game) => (game.score / game.maxScore) * 100)
  const avgGameScore = gameScores.length > 0 ? gameScores.reduce((sum, score) => sum + score, 0) / gameScores.length : 0

  // Calculate streak (mock)
  const streakDays = Math.floor(Math.random() * 10) + 1

  // Calculate overall metrics
  const totalActivities = recentJournals.length + recentGames.length + recentEmotions.length
  const emotionalIntelligence = Math.min(100, (avgGameScore + avgMood * 10) / 2)
  const overallScore = Math.min(100, (emotionalIntelligence + avgMood * 10 + totalActivities * 2) / 3)

  let moodTrend: "improving" | "stable" | "declining" = "stable"
  if (recentMoods.length >= 2) {
    const firstHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2))
    const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2))
    const firstAvg = firstHalf.reduce((sum, mood) => sum + mood, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, mood) => sum + mood, 0) / secondHalf.length

    if (secondAvg > firstAvg + 0.5) moodTrend = "improving"
    else if (secondAvg < firstAvg - 0.5) moodTrend = "declining"
  }

  return {
    overallScore,
    emotionalIntelligence,
    moodTrend,
    streakDays,
    totalActivities,
    weeklyGoalProgress: Math.min(100, (totalActivities / 15) * 100), // Goal: 15 activities per week
  }
}

export function generateWeeklyInsights(metrics: ProgressMetrics): WeeklyInsight[] {
  const insights: WeeklyInsight[] = []

  if (metrics.moodTrend === "improving") {
    insights.push({
      title: "Mood Improvement",
      description: "Your mood has been trending upward this week. Keep up the great work!",
      type: "positive",
      metric: "Mood Trend",
    })
  }

  if (metrics.streakDays >= 7) {
    insights.push({
      title: "Consistency Champion",
      description: `You've maintained a ${metrics.streakDays}-day streak of emotional wellness activities.`,
      type: "positive",
      metric: "Activity Streak",
    })
  }

  if (metrics.emotionalIntelligence >= 80) {
    insights.push({
      title: "High EQ Performance",
      description: "Your emotional intelligence scores are in the top range. Excellent self-awareness!",
      type: "positive",
      metric: "EQ Score",
    })
  }

  if (metrics.weeklyGoalProgress < 50) {
    insights.push({
      title: "Activity Opportunity",
      description: "Consider increasing your engagement with journaling and EQ games this week.",
      type: "improvement",
      metric: "Weekly Goals",
    })
  }

  if (insights.length === 0) {
    insights.push({
      title: "Steady Progress",
      description: "You're maintaining consistent emotional wellness habits. Keep building on this foundation.",
      type: "neutral",
      metric: "Overall Progress",
    })
  }

  return insights
}
