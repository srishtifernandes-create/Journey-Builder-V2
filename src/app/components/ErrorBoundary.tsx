import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-4 text-center">
          <div className="max-w-md p-6 bg-white border border-neutral-200 rounded-lg shadow-sm">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Something went wrong.</h1>
            <p className="text-neutral-500 mb-4">
              {this.state.error?.message || 'An unexpected error occurred in the workspace.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded font-medium text-sm transition-colors"
            >
              Reload application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}