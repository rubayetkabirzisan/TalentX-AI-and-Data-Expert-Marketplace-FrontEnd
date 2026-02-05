'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getJobs } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeftIcon } from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  applicationCount: number
  description?: string
  tech_stack?: string[]
}

export default function JobsListPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getJobs(search)
        setJobs(Array.isArray(data) ? data : [])
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load jobs'
        setError(message)
        console.error('[v0]', message)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(loadJobs, 300)
    return () => clearTimeout(debounceTimer)
  }, [search])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-70">
              <ArrowLeftIcon className="h-5 w-5" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">JobMatch</h1>
              </div>
            </Link>
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search jobs by title, company, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Jobs Grid */}
        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">Loading jobs...</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
              {error}
            </div>
          )}

          {!loading && jobs.length === 0 && !error && (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">
                No jobs found. Try a different search.
              </p>
            </div>
          )}

          {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-foreground">
                        {job.title}
                      </h2>
                      <p className="mt-1 text-muted-foreground">
                        {job.company}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {job.applicationCount} applications
                    </Badge>
                  </div>

                  {job.tech_stack && job.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {job.tech_stack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                      {job.tech_stack.length > 3 && (
                        <Badge variant="outline">
                          +{job.tech_stack.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
