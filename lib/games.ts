export interface GameResult {
  id: string
  userId: string
  gameType: "perception" | "shadow-match" | "situation" | "world-explorer"
  level: number
  score: number
  maxScore: number
  timeSpent: number // in seconds
  answers: any[]
  insights: string[]
  createdAt: Date
}

export interface PerceptionQuestion {
  id: string
  imageUrl: string
  question: string
  options: string[]
  correctAnswer: number
  insight: string
  level: number
}

export interface ShadowMatchQuestion {
  id: string
  objectUrl: string
  shadowOptions: string[]
  correctShadow: number
  level: number
}

export interface SituationQuestion {
  id: string
  scenario: string
  imageUrl?: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: "workplace" | "family" | "team" | "friendship"
  level: number
}

export interface WorldLocation {
  id: string
  imageUrl: string
  country: string
  city?: string
  coordinates: { lat: number; lng: number }
  difficulty: "easy" | "medium" | "hard"
}

// Mock data for games
export const perceptionQuestions: PerceptionQuestion[] = [
  {
    id: "p1",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-owwS59XwJyB4dyGrzy7hz5ycOWoeNJ.png",
    question: "What did you see first in this image?",
    options: ["An Apple", "Two Faces", "Something Else"],
    correctAnswer: -1, // No correct answer for perception tests
    insight: "What you see first can indicate your current mental focus and emotional state.",
    level: 1,
  },
  {
    id: "p2",
    imageUrl: "/optical-illusion-vase-faces.jpg",
    question: "What do you perceive in this classic illusion?",
    options: ["A Vase", "Two Faces", "Both Equally"],
    correctAnswer: -1,
    insight: "Your perception can shift based on your emotional state and attention patterns.",
    level: 1,
  },
]

export const shadowMatchQuestions: ShadowMatchQuestion[] = [
  {
    id: "s1",
    objectUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CRHklQlefb9LebNdRNnvMuzrTLk43q.png",
    shadowOptions: ["/boot-shadow-1.jpg", "/boot-shadow-2.jpg", "/boot-shadow-3.jpg"],
    correctShadow: 0,
    level: 1,
  },
  {
    id: "s2",
    objectUrl: "/coffee-cup-object.jpg",
    shadowOptions: ["/cup-shadow-1.jpg", "/cup-shadow-2.jpg", "/cup-shadow-3.jpg"],
    correctShadow: 1,
    level: 1,
  },
]

export const situationQuestions: SituationQuestion[] = [
  {
    id: "sit1",
    scenario: "Your colleague seems upset after a team meeting where their idea was rejected.",
    question: "What would be the most emotionally intelligent response?",
    options: [
      "Tell them their idea wasn't that good anyway",
      "Approach them privately and ask how they're feeling",
      "Ignore it and let them deal with it themselves",
      "Immediately suggest they talk to the manager",
    ],
    correctAnswer: 1,
    explanation:
      "Showing empathy and creating a safe space for them to express their feelings demonstrates emotional intelligence.",
    category: "workplace",
    level: 1,
  },
  {
    id: "sit2",
    scenario: "Your friend has been canceling plans frequently and seems distant lately.",
    question: "How should you approach this situation?",
    options: [
      "Stop inviting them to things",
      "Confront them about being a bad friend",
      "Gently ask if everything is okay and offer support",
      "Talk to other friends about their behavior",
    ],
    correctAnswer: 2,
    explanation: "Approaching with care and offering support shows emotional awareness and maintains the relationship.",
    category: "friendship",
    level: 1,
  },
]

export const worldLocations: WorldLocation[] = [
  {
    id: "w1",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xfWMVugzQzVX8NGdLJvdfdOD1O2kLD.png",
    country: "Brazil",
    city: "São Paulo",
    coordinates: { lat: -23.5505, lng: -46.6333 },
    difficulty: "medium",
  },
  {
    id: "w2",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-i0MLl0EjfNydhyUCKlKD0f6Icnhi07.png",
    country: "Mexico",
    city: "Guadalajara",
    coordinates: { lat: 20.6597, lng: -103.3496 },
    difficulty: "hard",
  },
]

// Mock game result storage
const mockResults: GameResult[] = []

export async function saveGameResult(result: Omit<GameResult, "id" | "createdAt">): Promise<GameResult> {
  const newResult: GameResult = {
    ...result,
    id: Date.now().toString(),
    createdAt: new Date(),
  }

  mockResults.push(newResult)
  return newResult
}

export async function getGameResults(userId: string, gameType?: string): Promise<GameResult[]> {
  return mockResults
    .filter((result) => result.userId === userId && (!gameType || result.gameType === gameType))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
