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
          <div className="pointer-events-auto w-full max-w-lg p-8 bg-white border border-neutral-200 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Welcome to Journey Builder</h2>
            <p className="text-sm text-neutral-500 mb-6">
              Get started by exploring the four primary workspaces:
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center text-neutral-600 font-bold">1</div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-900">Node Library</h3>
                  <p className="text-xs text-neutral-500">Drag banking capabilities from the left panel.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center text-neutral-600 font-bold">2</div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-900">Canvas</h3>
                  <p className="text-xs text-neutral-500">Drop nodes here to design your journey flow.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center text-neutral-600 font-bold">3</div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-900">Properties</h3>
                  <p className="text-xs text-neutral-500">Select a node to configure it in the right panel.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center text-neutral-600 font-bold">4</div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-900">Screen Flow</h3>
                  <p className="text-xs text-neutral-500">Use the top-left navigation to switch views.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => runtime.createNodeAtViewportCenter('aadhaar')}
              className="w-full h-10 px-4 rounded-lg bg-neutral-900 text-white font-medium text-sm hover:bg-neutral-800 transition-colors focus:outline-none"
            >
              Get Started
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
