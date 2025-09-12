"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Clock, CheckCircle, XCircle, Lightbulb } from "lucide-react"
import { situationQuestions, saveGameResult } from "@/lib/games"
import { useAuth } from "@/lib/auth"

interface SituationFlashcardsProps {
  onComplete: (score: number, insights: string[]) => void
}

export function SituationFlashcards({ onComplete }: SituationFlashcardsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [gameComplete, setGameComplete] = useState(false)

  const { user } = useAuth()
  const questions = situationQuestions

  useEffect(() => {
    setStartTime(Date.now())
  }, [])

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer
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
      "Emotional intelligence involves understanding others' perspectives",
      "Empathy and active listening are key to healthy relationships",
      "Practice recognizing emotional cues in different social contexts",
    ]

    if (user) {
      await saveGameResult({
        userId: user.id,
        gameType: "situation",
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "workplace":
        return "bg-blue-100 text-blue-800"
      case "family":
        return "bg-green-100 text-green-800"
      case "team":
        return "bg-purple-100 text-purple-800"
      case "friendship":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (gameComplete) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Situation Analysis Complete!</CardTitle>
          <CardDescription>You've practiced emotional intelligence scenarios</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-primary">
            {score}/{questions.length}
          </div>
          <p className="text-muted-foreground">Correct Responses</p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              Practicing emotional scenarios helps you develop empathy and improve your ability to respond appropriately
              in real-life social situations.
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
          <Heart className="h-5 w-5 text-primary" />
          <span className="font-medium">Situation Flashcards</span>
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
          <div className="flex items-center justify-between">
            <CardTitle>Emotional Intelligence Scenario</CardTitle>
            <Badge className={getCategoryColor(currentQ.category)}>
              {currentQ.category.charAt(0).toUpperCase() + currentQ.category.slice(1)}
            </Badge>
          </div>
          <CardDescription>Choose the most emotionally intelligent response</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scenario */}
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Scenario:</p>
            <p className="text-sm">{currentQ.scenario}</p>
          </div>

          {/* Question */}
          <div>
            <h4 className="font-medium mb-3">{currentQ.question}</h4>
          </div>

          {/* Answer options */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQ.correctAnswer
              const showCorrect = showResult && isCorrect
              const showIncorrect = showResult && isSelected && !isCorrect

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full h-auto p-4 text-left justify-start whitespace-normal ${
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
                  <div className="flex items-start gap-3 w-full">
                    <span className="font-medium text-muted-foreground mt-0.5">{String.fromCharCode(65 + index)}.</span>
                    <span className="flex-1">{option}</span>
                    {showCorrect && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                    {showIncorrect && <XCircle className="h-5 w-5 text-red-600 mt-0.5" />}
                  </div>
                </Button>
              )
            })}
          </div>

          {showResult && (
            <div className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary mb-2">Explanation</h4>
                    <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button onClick={handleNext} className="gap-2">
                  {currentQuestion < questions.length - 1 ? "Next Scenario" : "Complete Game"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
