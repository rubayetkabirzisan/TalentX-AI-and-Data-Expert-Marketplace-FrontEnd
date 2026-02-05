'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createJob } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

export default function CreateJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: '',
    deadline: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const jobData = {
        ...formData,
        tech_stack: formData.tech_stack
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      }

      await createJob(jobData)
      router.push('/dashboard')
    } catch (err) {
      setError('Failed to create job. Please try again.')
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Post a New Job</h1>
        <p className="mt-2 text-muted-foreground">
          Create an engaging job posting to attract top talent
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-foreground">
              Job Title
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Senior React Developer"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-foreground">
              Job Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={6}
              required
              disabled={loading}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Note: In the full app, you can click "Generate JD" to use AI to
              generate a job description
            </p>
          </div>

          <div>
            <Label htmlFor="tech_stack" className="text-foreground">
              Required Skills/Tech Stack
            </Label>
            <Input
              id="tech_stack"
              name="tech_stack"
              value={formData.tech_stack}
              onChange={handleChange}
              placeholder="React, TypeScript, Node.js (comma-separated)"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="deadline" className="text-foreground">
              Application Deadline
            </Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Job'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
