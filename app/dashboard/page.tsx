"use client"

import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart, Brain, TrendingUp, Calendar, Users, Target, BookOpen, Camera, Mic, BarChart3 } from "lucide-react"
import Link from "next/link"

function IndividualDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-2">Welcome to Your Wellness Journey</h2>
        <p className="text-muted-foreground mb-4">
          Track your emotional growth, practice mindfulness, and build stronger emotional intelligence.
        </p>
        <div className="flex gap-3">
          <Link href="/journal">
            <Button className="gap-2">
              <BookOpen className="h-4 w-4" />
              Start Journaling
            </Button>
          </Link>
          <Link href="/games">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Brain className="h-4 w-4" />
              Play EQ Games
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mood Score</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2</div>
            <p className="text-xs text-muted-foreground">+0.5 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EQ Games Played</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 completed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/camera">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Emotion Check-in
              </CardTitle>
              <CardDescription>Use your camera to analyze your current emotional state</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/voice">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Voice Analysis
              </CardTitle>
              <CardDescription>Record your voice to understand emotional patterns</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/progress">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                View Progress
              </CardTitle>
              <CardDescription>See your emotional intelligence growth over time</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
          <CardDescription>Your emotional wellness journey this week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Journal Entries</span>
              <span>4/7 days</span>
            </div>
            <Progress value={57} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>EQ Games</span>
              <span>8/10 games</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Mindfulness</span>
              <span>3/5 sessions</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MentorDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-2">Mentor Dashboard</h2>
        <p className="text-muted-foreground">Support your mentees on their emotional wellness journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Mentees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Avg Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Sessions This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CounselorDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-2">Counselor Dashboard</h2>
        <p className="text-muted-foreground">Provide professional support and track client progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Active Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">15</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointments Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">6</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Client Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">85%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-2">Wellness Coordinator Dashboard</h2>
        <p className="text-muted-foreground">Manage organizational wellness and track overall progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">247</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Active Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Wellness Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.4</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <DashboardLayout>
      {user.role === "individual" && <IndividualDashboard />}
      {user.role === "mentor" && <MentorDashboard />}
      {user.role === "counselor" && <CounselorDashboard />}
      {user.role === "wellness-coordinator" && <AdminDashboard />}
    </DashboardLayout>
  )
}
