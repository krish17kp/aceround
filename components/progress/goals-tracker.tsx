"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  deadline: string
  status: "completed" | "on-track" | "behind" | "at-risk"
}

export function GoalsTracker() {
  // Mock goals data
  const goals: Goal[] = [
    {
      id: "1",
      title: "Daily Journaling",
      description: "Write in your emotional journal every day",
      target: 7,
      current: 5,
      unit: "days",
      deadline: "This week",
      status: "on-track",
    },
    {
      id: "2",
      title: "EQ Games Mastery",
      description: "Complete 10 EQ games with 80%+ accuracy",
      target: 10,
      current: 8,
      unit: "games",
      deadline: "This month",
      status: "on-track",
    },
    {
      id: "3",
      title: "Emotion Check-ins",
      description: "Use camera or voice analysis 3 times per week",
      target: 3,
      current: 2,
      unit: "check-ins",
      deadline: "This week",
      status: "behind",
    },
    {
      id: "4",
      title: "Mood Improvement",
      description: "Maintain average mood score above 7.0",
      target: 7.0,
      current: 7.2,
      unit: "score",
      deadline: "This month",
      status: "completed",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "on-track":
        return <Target className="h-4 w-4 text-blue-600" />
      case "behind":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "at-risk":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Target className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "on-track":
        return "bg-blue-100 text-blue-800"
      case "behind":
        return "bg-yellow-100 text-yellow-800"
      case "at-risk":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "on-track":
        return "On Track"
      case "behind":
        return "Behind"
      case "at-risk":
        return "At Risk"
      default:
        return "Unknown"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Personal Goals
        </CardTitle>
        <CardDescription>Track your emotional wellness objectives and milestones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const progress = Math.min(100, (goal.current / goal.target) * 100)

          return (
            <div key={goal.id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{goal.title}</h4>
                    <Badge className={getStatusColor(goal.status)}>{getStatusText(goal.status)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                  <p className="text-xs text-muted-foreground">Deadline: {goal.deadline}</p>
                </div>
                <div className="ml-4">{getStatusIcon(goal.status)}</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Progress: {goal.current} / {goal.target} {goal.unit}
                  </span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
