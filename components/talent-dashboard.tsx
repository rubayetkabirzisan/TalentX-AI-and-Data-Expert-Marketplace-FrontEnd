'use client'

import { useState, useEffect } from 'react'
import {
  getTalentApplications,
  getTalentInvitations,
  respondToInvitation,
} from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Application {
  id: string
  jobTitle: string
  company: string
  appliedAt: string
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted'
}

interface Invitation {
  id: string
  jobTitle: string
  company: string
  sentAt: string
  status: 'pending' | 'accepted' | 'declined'
}

interface TalentDashboardProps {
  onRoleChange?: () => void
}

export default function TalentDashboard({ onRoleChange }: TalentDashboardProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('invitations')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [appsData, invData] = await Promise.all([
        getTalentApplications(),
        getTalentInvitations(),
      ])
      setApplications(Array.isArray(appsData) ? appsData : [])
      setInvitations(Array.isArray(invData) ? invData : [])
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRespondToInvitation = async (
    invId: string,
    status: 'accepted' | 'declined'
  ) => {
    setRespondingTo(invId)
    try {
      await respondToInvitation(invId, status)
      setInvitations(invitations.map((inv) =>
        inv.id === invId ? { ...inv, status } : inv
      ))
    } catch (err) {
      setError('Failed to respond to invitation')
      console.error(err)
    } finally {
      setRespondingTo(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
      case 'declined':
        return 'bg-red-100 text-red-800'
      case 'reviewed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
              <p className="text-sm text-muted-foreground">Talent Dashboard</p>
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
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              My Job Activity
            </h2>
            <p className="mt-2 text-muted-foreground">
              Track your invitations and applications
            </p>
          </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
        <h3 className="font-bold text-foreground">Ready to find opportunities?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse available jobs to find the perfect match for your skills.
        </p>
        <Button className="mt-4">
          Browse Jobs
        </Button>
      </div>

      <Tabs defaultValue="invitations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invitations">
            Invitations ({invitations.length})
          </TabsTrigger>
          <TabsTrigger value="applications">
            Applications ({applications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invitations" className="space-y-4">
          {invitations.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                You don't have any invitations yet
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {invitations.map((inv) => (
                <Card key={inv.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground">
                          {inv.jobTitle}
                        </h3>
                        <Badge className={getStatusColor(inv.status)}>
                          {inv.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-muted-foreground">
                        {inv.company}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Invited on{' '}
                        {new Date(inv.sentAt).toLocaleDateString()}
                      </p>
                    </div>

                    {inv.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            handleRespondToInvitation(inv.id, 'accepted')
                          }
                          disabled={respondingTo === inv.id}
                          size="sm"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() =>
                            handleRespondToInvitation(inv.id, 'declined')
                          }
                          disabled={respondingTo === inv.id}
                          variant="outline"
                          size="sm"
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {applications.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="mb-4 text-muted-foreground">
                You haven't applied to any jobs yet
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground">
                          {app.jobTitle}
                        </h3>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-muted-foreground">
                        {app.company}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Applied on{' '}
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
          <p className="text-sm text-muted-foreground">
            JobMatch Demo - Talent Portal
          </p>
        </div>
      </footer>
    </div>
  )
}
