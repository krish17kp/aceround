export interface JournalEntry {
  id: string
  userId: string
  title: string
  content: string
  mood: number // 1-10 scale
  sentiment: "positive" | "negative" | "neutral"
  sentimentScore: number // -1 to 1
  emotions: string[]
  createdAt: Date
  updatedAt: Date
}

export interface SentimentAnalysis {
  sentiment: "positive" | "negative" | "neutral"
  score: number
  emotions: string[]
  keywords: string[]
  suggestions: string[]
}

// Mock sentiment analysis - replace with actual AI service
export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const words = text.toLowerCase().split(/\s+/)

  // Simple keyword-based sentiment analysis (replace with actual AI)
  const positiveWords = [
    "happy",
    "joy",
    "excited",
    "grateful",
    "love",
    "amazing",
    "wonderful",
    "great",
    "good",
    "peaceful",
    "calm",
    "content",
  ]
  const negativeWords = [
    "sad",
    "angry",
    "frustrated",
    "worried",
    "anxious",
    "stressed",
    "upset",
    "disappointed",
    "hurt",
    "lonely",
    "tired",
  ]
  const emotionWords = [
    "happy",
    "sad",
    "angry",
    "excited",
    "worried",
    "grateful",
    "frustrated",
    "peaceful",
    "anxious",
    "content",
  ]

  let positiveCount = 0
  let negativeCount = 0
  const foundEmotions: string[] = []
  const keywords: string[] = []

  words.forEach((word) => {
    if (positiveWords.includes(word)) {
      positiveCount++
      keywords.push(word)
    }
    if (negativeWords.includes(word)) {
      negativeCount++
      keywords.push(word)
    }
    if (emotionWords.includes(word)) {
      foundEmotions.push(word)
    }
  })

  const totalEmotionalWords = positiveCount + negativeCount
  let sentiment: "positive" | "negative" | "neutral" = "neutral"
  let score = 0

  if (totalEmotionalWords > 0) {
    score = (positiveCount - negativeCount) / totalEmotionalWords
    if (score > 0.2) sentiment = "positive"
    else if (score < -0.2) sentiment = "negative"
  }

  const suggestions = [
    sentiment === "negative"
      ? "Consider practicing deep breathing or meditation"
      : "Great to see positive emotions! Keep nurturing them",
    "Try the EQ games to explore your emotional patterns",
    "Consider talking to a mentor or counselor about your feelings",
  ]

  return {
    sentiment,
    score,
    emotions: [...new Set(foundEmotions)],
    keywords: [...new Set(keywords)],
    suggestions,
  }
}

// Mock journal storage - replace with actual database
const mockEntries: JournalEntry[] = []

export async function saveJournalEntry(
  entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">,
): Promise<JournalEntry> {
  const newEntry: JournalEntry = {
    ...entry,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockEntries.push(newEntry)

  // Check if this is the 7th entry for email trigger
  const userEntries = mockEntries.filter((e) => e.userId === entry.userId)
  if (userEntries.length % 7 === 0) {
    // Trigger email report (mock)
    console.log(`Email report triggered for user ${entry.userId} after ${userEntries.length} entries`)
  }

  return newEntry
}

export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  return mockEntries
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
