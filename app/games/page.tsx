"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PerceptionTest } from "@/components/games/perception-test"
import { ShadowMatch } from "@/components/games/shadow-match"
import { SituationFlashcards } from "@/components/games/situation-flashcards"
import { WorldExplorer } from "@/components/games/world-explorer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Eye, Target, Heart, MapPin, Trophy, Clock, Star } from "lucide-react"

type GameType = "perception" | "shadow-match" | "situation" | "world-explorer" | null

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameType>(null)
  const [completedGames, setCompletedGames] = useState<Set<string>>(new Set())

  const handleGameComplete = (gameType: string, score: number, insights: string[]) => {
    setCompletedGames((prev) => new Set([...prev, gameType]))
    setActiveGame(null)

    // Show completion notification or navigate to results
    console.log(`Game ${gameType} completed with score: ${score}`)
  }

  const games = [
    {
      id: "perception",
      title: "Perception Test",
      description: "Explore how your mind processes visual information and emotional states",
      icon: Eye,
      difficulty: "Easy",
      duration: "5-10 min",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "shadow-match",
      title: "Shadow Match",
      description: "Improve spatial awareness and attention to detail",
      icon: Target,
      difficulty: "Medium",
      duration: "3-5 min",
      color: "bg-green-100 text-green-800",
    },
    {
      id: "situation",
      title: "Situation Flashcards",
      description: "Practice emotional intelligence in social scenarios",
      icon: Heart,
      difficulty: "Medium",
      duration: "8-12 min",
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: "world-explorer",
      title: "World Explorer",
      description: "Test your geographic knowledge and observation skills",
      icon: MapPin,
      difficulty: "Hard",
      duration: "10-15 min",
      color: "bg-orange-100 text-orange-800",
    },
  ]

  if (activeGame) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setActiveGame(null)} className="gap-2 bg-transparent">
              ← Back to Games
            </Button>
          </div>

          {activeGame === "perception" && (
            <PerceptionTest onComplete={(score, insights) => handleGameComplete("perception", score, insights)} />
          )}
          {activeGame === "shadow-match" && (
            <ShadowMatch onComplete={(score, insights) => handleGameComplete("shadow-match", score, insights)} />
          )}
          {activeGame === "situation" && (
            <SituationFlashcards onComplete={(score, insights) => handleGameComplete("situation", score, insights)} />
          )}
          {activeGame === "world-explorer" && (
            <WorldExplorer onComplete={(score, insights) => handleGameComplete("world-explorer", score, insights)} />
          )}
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
              <Brain className="h-8 w-8" />
              EQ Games
            </h1>
            <p className="text-muted-foreground mt-1">
              Strengthen your emotional intelligence through interactive games
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Games Played</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedGames.size}</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">Situation Flashcards</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Played</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5h</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">EQ Level</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Level 3</div>
              <p className="text-xs text-muted-foreground">Intermediate</p>
            </CardContent>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => {
            const Icon = game.icon
            const isCompleted = completedGames.has(game.id)

            return (
              <Card key={game.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {game.title}
                          {isCompleted && (
                            <Badge variant="secondary" className="text-xs">
                              Completed
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={game.color}>{game.difficulty}</Badge>
                          <span className="text-xs text-muted-foreground">{game.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full gap-2" onClick={() => setActiveGame(game.id as GameType)}>
                    <Icon className="h-4 w-4" />
                    {isCompleted ? "Play Again" : "Start Game"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Game Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Maximize Your Learning</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Take your time to think through each scenario</li>
                  <li>• Pay attention to the insights provided after each game</li>
                  <li>• Try to apply what you learn in real-life situations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Track Your Progress</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Play games regularly to build emotional skills</li>
                  <li>• Review your results in the Progress dashboard</li>
                  <li>• Challenge yourself with harder difficulty levels</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
