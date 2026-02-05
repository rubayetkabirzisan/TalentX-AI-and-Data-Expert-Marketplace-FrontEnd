'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, clearAuthToken, getAuthToken } from './api-client'

interface User {
  id: string
  email: string
  role?: 'Employer' | 'Talent'
  name?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  logout: () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = getAuthToken()
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchUser() {
    try {
      const userData = await getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('[Auth] Failed to fetch user:', error)
      clearAuthToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    clearAuthToken()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    refreshUser: fetchUser,
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
