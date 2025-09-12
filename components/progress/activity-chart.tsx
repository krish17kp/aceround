"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"
import type { ActivityData } from "@/lib/analytics"

interface ActivityChartProps {
  data: ActivityData[]
  type: "mood" | "activity"
}

export function ActivityChart({ data, type }: ActivityChartProps) {
  const chartConfig = {
    mood: {
      label: "Mood Score",
      color: "hsl(var(--chart-1))",
    },
    journal: {
      label: "Journal Entries",
      color: "hsl(var(--chart-2))",
    },
    games: {
      label: "Games Played",
      color: "hsl(var(--chart-3))",
    },
    emotions: {
      label: "Emotion Check-ins",
      color: "hsl(var(--chart-4))",
    },
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const processedData = data.map((item) => ({
    ...item,
    date: formatDate(item.date),
    totalActivity: item.journalEntries + item.gamesPlayed + item.emotionCheckins,
  }))

  if (type === "mood") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
          <CardDescription>Your daily mood scores over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="moodScore"
                  stroke="var(--color-mood)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-mood)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
        <CardDescription>Your daily emotional wellness activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="journalEntries" stackId="a" fill="var(--color-journal)" />
              <Bar dataKey="gamesPlayed" stackId="a" fill="var(--color-games)" />
              <Bar dataKey="emotionCheckins" stackId="a" fill="var(--color-emotions)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
