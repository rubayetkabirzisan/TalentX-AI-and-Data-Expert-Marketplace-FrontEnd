'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getEmployerJobApplicants } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Job {
  id: string
  title: string
  company: string
  tech_stack: string[]
  deadline: string
  description: string
  applicationCount?: number
}

interface Applicant {
  id: string
  name: string
  email: string
  appliedAt: string
}

interface EmployerDashboardProps {
  onRoleChange?: () => void
}

export default function EmployerDashboard({ onRoleChange }: EmployerDashboardProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loadingApplicants, setLoadingApplicants] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newJob, setNewJob] = useState({ title: '', description: '', tech: '' })

  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior React Developer',
        company: 'Tech Corp',
        tech_stack: ['React', 'TypeScript', 'Next.js'],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'We are looking for a Senior React Developer...',
        applicationCount: 5,
      },
      {
        id: '2',
        title: 'Full Stack Developer',
        company: 'Tech Corp',
        tech_stack: ['Node.js', 'React', 'PostgreSQL'],
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Join our team as a Full Stack Developer...',
        applicationCount: 3,
      },
    ]
    setJobs(mockJobs)
    setLoading(false)
  }, [])

  const handleViewApplicants = async (jobId: string) => {
    setSelectedJobId(jobId)
    setLoadingApplicants(true)
    try {
      const data = await getEmployerJobApplicants(jobId)
      setApplicants(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to load applicants')
      console.error(err)
    } finally {
      setLoadingApplicants(false)
    }
  }

  const handleCreateJob = () => {
    if (newJob.title.trim() && newJob.description.trim()) {
      const job: Job = {
        id: String(jobs.length + 1),
        title: newJob.title,
        company: 'Tech Corp',
        tech_stack: newJob.tech
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: newJob.description,
        applicationCount: 0,
      }
      setJobs([job, ...jobs])
      setNewJob({ title: '', description: '', tech: '' })
      setShowCreateForm(false)
    }
  }

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">JobMatch</h1>
              <p className="text-sm text-muted-foreground">Employer Dashboard</p>
            </div>
            {onRoleChange && (
              <Button variant="outline" onClick={onRoleChange}>
                Change Role
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                My Job Postings
              </h2>
              <p className="mt-2 text-muted-foreground">
                Manage your job listings and applicants
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? 'Cancel' : 'Post New Job'}
            </Button>
          </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {showCreateForm && (
        <Card className="space-y-4 border-primary/20 bg-primary/5 p-6">
          <h3 className="font-bold text-foreground">Create New Job Posting</h3>
          <input
            type="text"
            placeholder="Job Title (e.g., Senior React Developer)"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
          <textarea
            placeholder="Job Description..."
            value={newJob.description}
            onChange={(e) =>
              setNewJob({ ...newJob, description: e.target.value })
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            rows={4}
          />
          <input
            type="text"
            placeholder="Tech Stack (comma-separated, e.g., React, TypeScript, Node.js)"
            value={newJob.tech}
            onChange={(e) => setNewJob({ ...newJob, tech: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
          <Button onClick={handleCreateJob} className="w-full">
            Create Job
          </Button>
        </Card>
      )}

      {jobs.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="mb-4 text-muted-foreground">
            You haven't posted any jobs yet
          </p>
          <Link href="/dashboard/create">
            <Button>Create Your First Job</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">
                    {job.title}
                  </h2>
                  <p className="mt-1 text-muted-foreground">{job.company}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.tech_stack.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-6 text-sm">
                    <div>
                      <p className="text-muted-foreground">Applications</p>
                      <p className="font-bold text-foreground">
                        {job.applicationCount || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deadline</p>
                      <p className="font-bold text-foreground">
                        {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleViewApplicants(job.id)}
                    variant="outline"
                  >
                    View Applicants
                  </Button>
                  <Link href={`/dashboard/jobs/${job.id}`}>
                    <Button variant="ghost" className="w-full">
                      Edit Job
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Applicants Dialog */}
      <Dialog open={!!selectedJobId} onOpenChange={() => setSelectedJobId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Applicants for{' '}
              {jobs.find((j) => j.id === selectedJobId)?.title}
            </DialogTitle>
          </DialogHeader>

          {loadingApplicants ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading applicants...
            </div>
          ) : applicants.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No applicants yet
            </div>
          ) : (
            <div className="space-y-3">
              {applicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {applicant.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {applicant.email}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Applied on{' '}
                      {new Date(applicant.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Invite to Interview
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
          <p className="text-sm text-muted-foreground">
            JobMatch Demo - Employer Portal
          </p>
        </div>
      </footer>
    </div>
  )
}
