'use client'

import { useAuth } from '@/lib/auth-context'
import EmployerDashboard from '@/components/employer-dashboard'
import TalentDashboard from '@/components/talent-dashboard'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      {user?.role === 'Employer' && <EmployerDashboard />}
      {user?.role === 'Talent' && <TalentDashboard />}
      {!user?.role && (
        <div className="text-center text-muted-foreground">
          Please complete onboarding first
        </div>
      )}
    </div>
  )
}
