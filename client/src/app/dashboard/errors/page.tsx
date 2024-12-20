'use client'

import { useEffect, useState } from 'react'
import { ErrorAnalyticsView } from '@/components/errors/ErrorAnalytics'
import { errorService } from '@/services/errorService'
import { ErrorAnalytics } from '@/types/robotErrors'
import { useCustomToast } from '@/hooks/useCustomToast'

export default function ErrorsPage() {
  const [analytics, setAnalytics] = useState<ErrorAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const toast = useCustomToast()

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await errorService.getErrorAnalytics('all') // 'all' for all robots
        setAnalytics(data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
        toast.error('Failed to load error analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No error data available</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Error Analytics</h1>
      <ErrorAnalyticsView data={analytics} />
    </div>
  )
} 