"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type UserRole = "individual" | "mentor" | "counselor" | "wellness-coordinator"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("sereneMind_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call - replace with actual Firebase auth
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        role: "individual",
        createdAt: new Date(),
      }

      setUser(mockUser)
      localStorage.setItem("sereneMind_user", JSON.stringify(mockUser))
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true)
    try {
      // Simulate API call - replace with actual Firebase auth
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        createdAt: new Date(),
      }

      setUser(mockUser)
      localStorage.setItem("sereneMind_user", JSON.stringify(mockUser))
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sereneMind_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
