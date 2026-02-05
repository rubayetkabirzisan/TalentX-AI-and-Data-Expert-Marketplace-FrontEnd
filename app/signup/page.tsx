'use client'

import React from 'react'
import { Suspense } from 'react'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { setAuthToken } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { UserIcon, BriefcaseIcon } from 'lucide-react'

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()
  const roleParam = searchParams.get('role') as 'talent' | 'employer' | null

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [selectedRole, setSelectedRole] = useState<'talent' | 'employer' | null>(roleParam)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedRole) {
      setError('Please select your role')
      return
    }

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      // For demo purposes
      setAuthToken('demo_token_' + Date.now())
      await refreshUser()

      router.push('/onboard')
    } catch (err) {
      setError('Signup failed. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-background via-background to-secondary px-4 py-8">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">JobMatch</h1>
          <p className="mt-2 text-muted-foreground">Create your account</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {!selectedRole ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Select your role:</p>
            <button
              onClick={() => setSelectedRole('talent')}
              className="flex w-full items-center gap-3 rounded-lg border border-border p-4 transition-all hover:border-primary hover:bg-secondary"
            >
              <div className="rounded-full bg-primary p-2">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">I'm a Talent</p>
                <p className="text-xs text-muted-foreground">
                  Find job opportunities
                </p>
              </div>
            </button>
            <button
              onClick={() => setSelectedRole('employer')}
              className="flex w-full items-center gap-3 rounded-lg border border-border p-4 transition-all hover:border-accent hover:bg-secondary"
            >
              <div className="rounded-full bg-accent p-2">
                <BriefcaseIcon className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">I'm Hiring</p>
                <p className="text-xs text-muted-foreground">Post jobs and hire</p>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>

          <button
            type="button"
            onClick={() => setSelectedRole(null)}
            className="w-full text-sm text-primary hover:underline"
          >
            Change role
          </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupContent />
    </Suspense>
  )
}
