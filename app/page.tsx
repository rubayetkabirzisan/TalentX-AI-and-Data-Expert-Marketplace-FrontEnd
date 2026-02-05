'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BriefcaseIcon, UserIcon } from 'lucide-react'
import TalentDashboard from '@/components/talent-dashboard'
import EmployerDashboard from '@/components/employer-dashboard'

type Role = 'talent' | 'employer' | null

export default function LandingPage() {
  const [selectedRole, setSelectedRole] = useState<Role>(null)

  if (selectedRole === 'talent') {
    return <TalentDashboard onRoleChange={() => setSelectedRole(null)} />
  }

  if (selectedRole === 'employer') {
    return <EmployerDashboard onRoleChange={() => setSelectedRole(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Navigation Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary md:text-3xl animate-fade-in-up">
              JobMatch
            </h1>
            <p className="text-xs text-muted-foreground md:text-sm animate-fade-in-up">
              Demo - No Authentication Required
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-5xl space-y-12 text-center">
          {/* Hero Section */}
          <div className="animate-fade-in-up space-y-6">
            <h2 className="text-balance text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Match
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              Select a role to explore the JobMatch platform. No login required for this demo.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {/* Talent Card */}
            <button
              onClick={() => setSelectedRole('talent')}
              className="group relative animate-slide-in-left overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-gradient-to-br from-primary to-accent p-4 shadow-lg">
                    <UserIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground">I'm a Talent</h3>
                <p className="text-muted-foreground">
                  Browse jobs, apply to opportunities, and grow your career
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Explore opportunities
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Receive invitations
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Track applications
                  </li>
                </ul>
                <Button className="mt-4 w-full">Enter as Talent</Button>
              </div>
            </button>

            {/* Employer Card */}
            <button
              onClick={() => setSelectedRole('employer')}
              className="group relative animate-slide-in-right overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-accent hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-gradient-to-br from-accent to-primary p-4 shadow-lg">
                    <BriefcaseIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground">I'm Hiring</h3>
                <p className="text-muted-foreground">
                  Post jobs, find talent, and build your team
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Post job openings
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Invite qualified talent
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Manage candidates
                  </li>
                </ul>
                <Button className="mt-4 w-full">Enter as Employer</Button>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
          <p className="text-sm text-muted-foreground">
            JobMatch Demo 2026 - Connecting talent with opportunities
          </p>
        </div>
      </footer>
    </div>
  )
}
