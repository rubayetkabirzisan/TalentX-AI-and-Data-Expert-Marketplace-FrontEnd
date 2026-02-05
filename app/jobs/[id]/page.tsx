'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getJobById, applyToJob } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Job {
  id: string
  title: string
  company: string
  description: string
  tech_stack: string[]
  deadline: string
  applicationCount?: number
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const jobId = params.id as string
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await getJobById(jobId)
        setJob(data)
      } catch (err) {
        setError('Failed to load job details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [jobId])

  const isDeadlinePassed = job ? new Date(job.deadline) < new Date() : false

  const handleApply = async () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      router.push(`/login?redirect=/jobs/${jobId}`)
      return
    }

    setApplying(true)
    try {
      await applyToJob(jobId)
      setApplied(true)
    } catch (err) {
      setError('Failed to apply to job')
      console.error(err)
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading job details...</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-muted-foreground">Job not found</p>
        <Link href="/">
          <Button variant="outline">Back to Jobs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Link href="/" className="mb-4 inline-block text-primary underline">
            ← Back to Jobs
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
          <p className="mt-2 text-muted-foreground">{job.company}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          {/* Job Details */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-bold text-foreground">
                About this role
              </h2>
              <p className="whitespace-pre-wrap text-foreground">
                {job.description}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-bold text-foreground">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.tech_stack.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-6">
              <div className="mb-4 space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold text-foreground">
                    {job.applicationCount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium text-foreground">
                    {new Date(job.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {applied ? (
                <div className="rounded-lg border border-green-500 bg-green-50 p-3 text-center text-green-700">
                  ✓ Application submitted!
                </div>
              ) : (
                <Button
                  onClick={handleApply}
                  disabled={isDeadlinePassed || applying}
                  className="w-full"
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </Button>
              )}

              {isDeadlinePassed && (
                <p className="mt-2 text-center text-sm text-destructive">
                  Application deadline has passed
                </p>
              )}

              {!isAuthenticated && !applied && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Sign in to apply
                </p>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
