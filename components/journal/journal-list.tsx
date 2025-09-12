"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Heart, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { getJournalEntries, type JournalEntry } from "@/lib/journal"
import { formatDistanceToNow } from "date-fns"

interface JournalListProps {
  refresh?: number
}

export function JournalList({ refresh }: JournalListProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadEntries = async () => {
      if (!user) return

      setLoading(true)
      try {
        const userEntries = await getJournalEntries(user.id)
        setEntries(userEntries)
      } catch (error) {
        console.error("Failed to load entries:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEntries()
  }, [user, refresh])

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
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

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return "text-red-600"
    if (mood <= 6) return "text-yellow-600"
    return "text-green-600"
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No journal entries yet</h3>
          <p className="text-muted-foreground mb-4">
            Start your emotional wellness journey by writing your first entry.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{entry.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span>{formatDistanceToNow(entry.createdAt, { addSuffix: true })}</span>
                  <div className="flex items-center gap-1">
                    <Heart className={`h-3 w-3 ${getMoodColor(entry.mood)}`} />
                    <span className="text-xs">Mood: {entry.mood}/10</span>
                  </div>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getSentimentIcon(entry.sentiment)}
                <Badge className={getSentimentColor(entry.sentiment)}>{entry.sentiment}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{entry.content}</p>

            {entry.emotions.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {entry.emotions.map((emotion, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {emotion}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
