"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Clock, CheckCircle, XCircle } from "lucide-react"
import { shadowMatchQuestions, saveGameResult } from "@/lib/games"
import { useAuth } from "@/lib/auth"
import Image from "next/image"

interface ShadowMatchProps {
  onComplete: (score: number, insights: string[]) => void
}

export function ShadowMatch({ onComplete }: ShadowMatchProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [gameComplete, setGameComplete] = useState(false)

  const { user } = useAuth()
  const questions = shadowMatchQuestions

  useEffect(() => {
    setStartTime(Date.now())
  }, [])

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === questions[currentQuestion].correctShadow
    const newAnswers = [...answers, answerIndex]
    setAnswers(newAnswers)

    if (isCorrect) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      completeGame()
    }
  }

  const completeGame = async () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const insights = [
      "Shadow matching improves spatial awareness and attention to detail",
      "This skill helps in recognizing patterns and visual relationships",
      "Better focus and concentration can improve your performance",
    ]

    if (user) {
      await saveGameResult({
        userId: user.id,
        gameType: "shadow-match",
        level: 1,
        score,
        maxScore: questions.length,
        timeSpent,
        answers,
        insights,
      })
    }

    setGameComplete(true)
    onComplete(score, insights)
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100

  if (gameComplete) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Shadow Match Complete!</CardTitle>
          <CardDescription>Great work on your spatial awareness</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-primary">
            {score}/{questions.length}
          </div>
          <p className="text-muted-foreground">Correct Matches</p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              Shadow matching exercises help improve your spatial intelligence and attention to detail, which are
              important for emotional awareness and pattern recognition.
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
          <Target className="h-5 w-5 text-primary" />
          <span className="font-medium">Shadow Match</span>
          <Badge variant="outline">Level 1</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle>Find the correct shadow</CardTitle>
          <CardDescription>Match the object above with its correct shadow below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Object to match */}
          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto bg-muted rounded-lg overflow-hidden">
              <Image
                src={currentQ.objectUrl || "/placeholder.svg"}
                alt="Object to match"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Shadow options */}
          <div className="grid grid-cols-3 gap-4">
            {currentQ.shadowOptions.map((shadowUrl, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQ.correctShadow
              const showCorrect = showResult && isCorrect
              const showIncorrect = showResult && isSelected && !isCorrect

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-32 p-2 relative ${
                    showCorrect
                      ? "border-green-500 bg-green-50"
                      : showIncorrect
                        ? "border-red-500 bg-red-50"
                        : isSelected
                          ? "border-primary"
                          : ""
                  }`}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={shadowUrl || "/placeholder.svg"}
                      alt={`Shadow option ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {showCorrect && <CheckCircle className="absolute top-1 right-1 h-5 w-5 text-green-600" />}
                  {showIncorrect && <XCircle className="absolute top-1 right-1 h-5 w-5 text-red-600" />}
                </Button>
              )
            })}
          </div>

          {showResult && (
            <div className="flex justify-center">
              <Button onClick={handleNext} className="gap-2">
                {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Game"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
