'use client'

import React from "react"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-foreground">
              JobMatch
            </Link>
            <nav className="flex items-center gap-4">
              {user?.role === 'Employer' && (
                <>
                  <Link href="/dashboard" className="text-foreground">
                    My Jobs
                  </Link>
                  <Link href="/dashboard/create" className="text-foreground">
                    Post Job
                  </Link>
                </>
              )}
              {user?.role === 'Talent' && (
                <>
                  <Link href="/dashboard" className="text-foreground">
                    Applications
                  </Link>
                  <Link href="/dashboard/invitations" className="text-foreground">
                    Invitations
                  </Link>
                </>
              )}
              <div className="flex items-center gap-2 border-l border-border pl-4">
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  )
}
