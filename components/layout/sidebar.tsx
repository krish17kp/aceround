"use client"

import type React from "react"

import { useAuth, type UserRole } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Home,
  BookOpen,
  Camera,
  Mic,
  Brain,
  BarChart3,
  MapPin,
  MessageCircle,
  Users,
  Settings,
  LogOut,
  Heart,
  Target,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["individual", "mentor", "counselor", "wellness-coordinator"],
  },
  {
    title: "Journal",
    href: "/journal",
    icon: BookOpen,
    roles: ["individual", "mentor", "counselor"],
  },
  {
    title: "Emotion Camera",
    href: "/camera",
    icon: Camera,
    roles: ["individual"],
  },
  {
    title: "Voice Analysis",
    href: "/voice",
    icon: Mic,
    roles: ["individual"],
  },
  {
    title: "EQ Games",
    href: "/games",
    icon: Brain,
    roles: ["individual"],
  },
  {
    title: "Progress",
    href: "/progress",
    icon: BarChart3,
    roles: ["individual", "mentor", "counselor"],
  },
  {
    title: "Find Clinics",
    href: "/clinics",
    icon: MapPin,
    roles: ["individual", "mentor", "counselor"],
  },
  {
    title: "AI Assistant",
    href: "/chat",
    icon: MessageCircle,
    roles: ["individual", "mentor", "counselor"],
  },
  {
    title: "Mentees",
    href: "/mentees",
    icon: Users,
    roles: ["mentor"],
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Heart,
    roles: ["counselor"],
  },
  {
    title: "Organization",
    href: "/organization",
    icon: Target,
    roles: ["wellness-coordinator"],
  },
  {
    title: "Admin Panel",
    href: "/admin",
    icon: Shield,
    roles: ["wellness-coordinator"],
  },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const userNavItems = navigationItems.filter((item) => item.roles.includes(user.role))

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SM</span>
          </div>
          <span className="font-bold text-lg text-primary">SereneMind</span>
        </div>
        <div className="text-sm text-muted-foreground">Welcome back, {user.name}</div>
        <div className="text-xs text-muted-foreground capitalize">{user.role.replace("-", " ")}</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {userNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/15",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Link href="/settings">
          <Button variant="ghost" className="w-full justify-start gap-3 h-11">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-destructive hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
