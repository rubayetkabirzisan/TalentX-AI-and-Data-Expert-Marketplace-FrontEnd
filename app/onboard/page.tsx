'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { onboardUser } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function OnboardPage() {
  const router = useRouter()
  const { refreshUser, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectRole = async (role: 'Employer' | 'Talent') => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onboardUser(role)
      await refreshUser()
      router.push('/dashboard')
    } catch (err) {
      setError('Failed to complete onboarding. Please try again.')
      console.error(err)
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-foreground">Welcome to JobMatch</h1>
        <p className="mt-2 text-xl text-muted-foreground">
          Tell us how you'd like to use JobMatch
        </p>
      </div>

      {error && (
        <div className="w-full max-w-md rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="cursor-pointer p-8 transition-all hover:shadow-lg">
          <div className="space-y-4">
            <div className="text-4xl">💼</div>
            <h2 className="text-2xl font-bold text-foreground">Employer</h2>
            <p className="text-muted-foreground">
              Post job openings, review applications, and find top talent to join
              your team
            </p>
            <Button
              onClick={() => handleSelectRole('Employer')}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Setting up...' : 'I\'m Hiring'}
            </Button>
          </div>
        </Card>

        <Card className="cursor-pointer p-8 transition-all hover:shadow-lg">
          <div className="space-y-4">
            <div className="text-4xl">🚀</div>
            <h2 className="text-2xl font-bold text-foreground">Talent</h2>
            <p className="text-muted-foreground">
              Browse opportunities, apply to jobs, and connect with companies
              looking for your skills
            </p>
            <Button
              onClick={() => handleSelectRole('Talent')}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Setting up...' : 'I\'m Looking for Work'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
