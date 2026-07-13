import React, { ReactNode } from 'react'

export interface CanvasBoundaryProps {
  children: ReactNode
  state?: 'loading' | 'empty' | 'error' | 'ready'
}

export function CanvasBoundary({ children, state = 'empty' }: CanvasBoundaryProps) {
  if (state === 'loading') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-50 text-neutral-500 font-sans">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin"></div>
          <span className="text-xs">Loading workspace...</span>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-50 text-neutral-500 font-sans">
        <div className="text-center p-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-1">Canvas Error</h3>
          <p className="text-xs text-neutral-500">Failed to render the layout workspace.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      {/* React Flow Viewport always mounts in the background */}
      {children}

      {/* Overlay Empty State Card */}
      {state === 'empty' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="pointer-events-auto w-full max-w-sm p-6 bg-white border border-neutral-200 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mx-auto mb-4 text-primary-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-git-branch"
              >
                <line x1="6" x2="6" y1="3" y2="15" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <path d="M18 9a9 9 0 0 1-9 9" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-neutral-900 mb-1">Journey Builder</h2>
            <p className="text-sm text-neutral-500 mb-4">
              Start by adding your first screen.<br />
              <span className="text-xs text-neutral-400">Node creation becomes available in Sprint 04.</span>
            </p>
            <button
              type="button"
              className="w-full h-9 px-4 rounded-lg bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Add Screen Node
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
