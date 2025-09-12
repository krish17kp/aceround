"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Clock, Target } from "lucide-react"
import { worldLocations, saveGameResult, calculateDistance } from "@/lib/games"
import { useAuth } from "@/lib/auth"
import Image from "next/image"

interface WorldExplorerProps {
  onComplete: (score: number, insights: string[]) => void
}

export function WorldExplorer({ onComplete }: WorldExplorerProps) {
  const [currentLocation, setCurrentLocation] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [guesses, setGuesses] = useState<{ lat: number; lng: number }[]>([])
  const [currentGuess, setCurrentGuess] = useState<{ lat: number; lng: number } | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [gameComplete, setGameComplete] = useState(false)

  const { user } = useAuth()
  const locations = worldLocations

  useEffect(() => {
    setStartTime(Date.now())
  }, [])

  const handleMapClick = (lat: number, lng: number) => {
    if (!showResult) {
      setCurrentGuess({ lat, lng })
    }
  }

  const submitGuess = () => {
    if (!currentGuess) return

    const location = locations[currentLocation]
    const distance = calculateDistance(
      currentGuess.lat,
      currentGuess.lng,
      location.coordinates.lat,
      location.coordinates.lng,
    )

    // Score based on distance (closer = higher score)
    let score = 0
    if (distance < 100) score = 1000
    else if (distance < 500) score = 800
    else if (distance < 1000) score = 600
    else if (distance < 2000) score = 400
    else if (distance < 5000) score = 200
    else score = 100

    setTotalScore(totalScore + score)
    setGuesses([...guesses, currentGuess])
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentLocation < locations.length - 1) {
      setCurrentLocation(currentLocation + 1)
      setCurrentGuess(null)
      setShowResult(false)
    } else {
      completeGame()
    }
  }

  const completeGame = async () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const insights = [
      "Geographic awareness enhances cognitive flexibility",
      "Pattern recognition skills transfer to emotional intelligence",
      "Attention to detail helps in reading social cues",
    ]

    if (user) {
      await saveGameResult({
        userId: user.id,
        gameType: "world-explorer",
        level: 1,
        score: totalScore,
        maxScore: locations.length * 1000,
        timeSpent,
        answers: guesses,
        insights,
      })
    }

    setGameComplete(true)
    onComplete(totalScore, insights)
  }

  const currentLoc = locations[currentLocation]
  const progress = ((currentLocation + (showResult ? 1 : 0)) / locations.length) * 100

  if (gameComplete) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">World Explorer Complete!</CardTitle>
          <CardDescription>You've explored different locations around the world</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-primary">{totalScore.toLocaleString()}</div>
          <p className="text-muted-foreground">Total Points</p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              Geographic exploration exercises help improve your observation skills and cultural awareness, which
              contribute to better emotional intelligence and global perspective.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="font-medium">World Explorer</span>
          <Badge variant="outline">Level 1</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Location {currentLocation + 1} of {locations.length}
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle>Where in the world is this?</CardTitle>
          <CardDescription>Click on the map below to make your guess</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Street view image */}
          <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
            <Image
              src={currentLoc.imageUrl || "/placeholder.svg"}
              alt="Street view location"
              fill
              className="object-cover"
            />
          </div>

          {/* Simple world map (mock interactive map) */}
          <div className="relative">
            <div
              className="w-full h-48 bg-blue-100 rounded-lg cursor-crosshair relative overflow-hidden"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                // Convert pixel coordinates to lat/lng (simplified)
                const lng = (x / rect.width) * 360 - 180
                const lat = 90 - (y / rect.height) * 180

                handleMapClick(lat, lng)
              }}
            >
              {/* Simple world map background */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-200 via-yellow-200 to-green-200 opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <Target className="h-8 w-8" />
              </div>

              {/* Show guess marker */}
              {currentGuess && (
                <div
                  className="absolute w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${((currentGuess.lng + 180) / 360) * 100}%`,
                    top: `${((90 - currentGuess.lat) / 180) * 100}%`,
                  }}
                />
              )}

              {/* Show actual location after guess */}
              {showResult && (
                <div
                  className="absolute w-3 h-3 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${((currentLoc.coordinates.lng + 180) / 360) * 100}%`,
                    top: `${((90 - currentLoc.coordinates.lat) / 180) * 100}%`,
                  }}
                />
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-2 text-center">
              Click anywhere on the map to place your guess
            </p>
          </div>

          {currentGuess && !showResult && (
            <div className="flex justify-center">
              <Button onClick={submitGuess} className="gap-2">
                <Target className="h-4 w-4" />
                Submit Guess
              </Button>
            </div>
          )}

          {showResult && (
            <div className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <h4 className="font-medium text-primary mb-2">
                  {currentLoc.city}, {currentLoc.country}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Distance:{" "}
                  {currentGuess
                    ? calculateDistance(
                        currentGuess.lat,
                        currentGuess.lng,
                        currentLoc.coordinates.lat,
                        currentLoc.coordinates.lng,
                      ).toFixed(0)
                    : 0}{" "}
                  km away
                </p>
                <p className="text-lg font-bold text-primary mt-2">
                  +
                  {currentGuess
                    ? (() => {
                        const distance = calculateDistance(
                          currentGuess.lat,
                          currentGuess.lng,
                          currentLoc.coordinates.lat,
                          currentLoc.coordinates.lng,
                        )
                        if (distance < 100) return 1000
                        if (distance < 500) return 800
                        if (distance < 1000) return 600
                        if (distance < 2000) return 400
                        if (distance < 5000) return 200
                        return 100
                      })()
                    : 0}{" "}
                  points
                </p>
              </div>

              <div className="flex justify-center">
                <Button onClick={handleNext} className="gap-2">
                  {currentLocation < locations.length - 1 ? "Next Location" : "Complete Game"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
