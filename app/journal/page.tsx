"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { JournalEditor } from "@/components/journal/journal-editor"
import { JournalList } from "@/components/journal/journal-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, PlusCircle, History, TrendingUp } from "lucide-react"

export default function JournalPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState("write")

  const handleEntrySaved = () => {
    setRefreshKey((prev) => prev + 1)
    setActiveTab("history")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <BookOpen className="h-8 w-8" />
              Emotional Journal
            </h1>
            <p className="text-muted-foreground mt-1">Track your emotional journey with AI-powered insights</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Mood</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.2</div>
              <p className="text-xs text-muted-foreground">+0.5 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Write Entry
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              Entry History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="space-y-4">
            <JournalEditor onSave={handleEntrySaved} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <JournalList refresh={refreshKey} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
