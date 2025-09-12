"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Eye, Clock, ArrowRight } from "lucide-react"
import { perceptionQuestions, saveGameResult } from "@/lib/games"
import { useAuth } from "@/lib/auth"
import Image from "next/image"

interface PerceptionTestProps {
  onComplete: (score: number, insights: string[]) => void
}

export function PerceptionTest({ onComplete }: PerceptionTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [showInsight, setShowInsight] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const { user } = useAuth()
  const questions = perceptionQuestions.slice(0, 3) // Limit to 3 questions

  useEffect(() => {
    setStartTime(Date.now())
  }, [])

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex]
    setAnswers(newAnswers)
    setShowInsight(true)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowInsight(false)
    } else {
      completeGame()
    }
  }

  const completeGame = async () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const insights = questions.map((q) => q.insight)

    if (user) {
      await saveGameResult({
        userId: user.id,
        gameType: "perception",
        level: 1,
        score: answers.length, // For perception tests, completion is the score
        maxScore: questions.length,
        timeSpent,
        answers,
        insights,
      })
    }

    setGameComplete(true)
    onComplete(answers.length, insights)
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + (showInsight ? 1 : 0)) / questions.length) * 100

  if (gameComplete) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Perception Test Complete!</CardTitle>
          <CardDescription>You've completed all perception challenges</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-primary">
            {answers.length}/{questions.length}
          </div>
          <p className="text-muted-foreground">Questions Completed</p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              Perception tests help you understand how your mind processes visual information and how your emotional
              state can influence what you notice first.
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
          <Eye className="h-5 w-5 text-primary" />
          <span className="font-medium">Perception Test</span>
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
          <CardTitle>{currentQ.question}</CardTitle>
          <CardDescription>Take your time and trust your first instinct</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="relative w-80 h-80 bg-muted rounded-lg overflow-hidden">
              <Image
                src={currentQ.imageUrl || "/placeholder.svg"}
                alt="Perception test image"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {!showInsight ? (
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-12 text-left justify-start bg-transparent"
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-medium text-primary mb-2">Insight</h4>
                <p className="text-sm text-muted-foreground">{currentQ.insight}</p>
              </div>

              <div className="flex justify-center">
                <Button onClick={handleNext} className="gap-2">
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    "Complete Test"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
