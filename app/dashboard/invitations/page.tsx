'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function InvitationsPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // This page is accessed through the dashboard layout
    // Redirect to dashboard which shows invitations for talent users
    if (user?.role === 'Talent') {
      router.push('/dashboard')
    } else {
      router.push('/dashboard')
    }
  }, [user, router])

  return null
}
