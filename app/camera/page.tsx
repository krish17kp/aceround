"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CameraEmotion } from "@/components/analysis/camera-emotion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Eye, Brain, Shield } from "lucide-react"

export default function CameraPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <Camera className="h-8 w-8" />
              Emotion Camera
            </h1>
            <p className="text-muted-foreground mt-1">
              Analyze your emotional state through facial expression recognition
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">How it Works</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Uses advanced facial recognition to detect emotions like happiness, sadness, anger, and surprise
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Analysis</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Machine learning algorithms analyze micro-expressions to understand your emotional state
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Privacy First</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Images are processed locally and securely. No data is stored without your consent
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Camera Component */}
        <CameraEmotion />

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Tips for Best Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Camera Setup</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Ensure good lighting on your face</li>
                  <li>• Position camera at eye level</li>
                  <li>• Keep your face centered in the frame</li>
                  <li>• Avoid shadows or backlighting</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">For Accurate Analysis</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Relax and be natural</li>
                  <li>• Remove glasses if possible</li>
                  <li>• Look directly at the camera</li>
                  <li>• Take multiple readings throughout the day</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
