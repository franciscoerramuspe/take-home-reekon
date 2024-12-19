'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-bold text-red-500 mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-4">We're sorry, but there was an error loading this content.</p>
          <Button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
} 