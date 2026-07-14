import React, { ReactNode } from 'react'
import { useCanvasRuntime } from '../hooks/useCanvasRuntime'
import { useEmptyStateStage } from '../hooks/useEmptyStateStage'

export interface CanvasBoundaryProps {
  children: ReactNode
  state?: 'loading' | 'empty' | 'error' | 'ready'
}

export function CanvasBoundary({ children, state = 'empty' }: CanvasBoundaryProps) {
  const runtime = useCanvasRuntime()
  const stage = useEmptyStateStage()

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

      {/* FTUE Stage 1: true-empty — no nodes placed yet */}
      {stage === 'true-empty' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="pointer-events-auto w-full max-w-sm p-6 bg-white border border-neutral-200 rounded-xl text-center">
            <div className="w-16 h-12 mx-auto mb-4 opacity-50" aria-hidden="true">
              <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect x="2" y="4" width="20" height="14" rx="3" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="3 2" />
                <rect x="42" y="4" width="20" height="14" rx="3" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="3 2" />
                <rect x="22" y="30" width="20" height="14" rx="3" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="3 2" />
                <path d="M12 18 L27 30" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="3 2" />
                <path d="M52 18 L37 30" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="3 2" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-neutral-900 mb-1">Start your journey</h2>
            <p className="text-sm text-neutral-500 mb-4">
              Every journey begins with a Welcome Screen — the first step your applicant sees.
            </p>
            <button
              type="button"
              onClick={() => runtime.createNodeAtViewportCenter('screen')}
              className="w-full h-9 px-4 rounded-lg bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              + Add Welcome Screen
            </button>
          </div>
        </div>
      )}

      {/* FTUE Stage 2: first-node-placed — nudge toward building a flow */}
      {stage === 'first-node-placed' && (
        <div className="absolute bottom-8 right-8 pointer-events-none z-10 flex items-center gap-2">
          <div className="pointer-events-auto flex items-center gap-2 bg-white border border-primary-200 rounded-full pl-2 pr-4 py-2">
            <span className="w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center text-base font-semibold leading-none">
              +
            </span>
            <span className="text-xs font-medium text-neutral-700">Add next screen</span>
          </div>
        </div>
      )}
    </div>
  )
}
