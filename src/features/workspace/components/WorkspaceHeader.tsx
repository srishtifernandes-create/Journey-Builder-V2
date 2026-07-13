import React from 'react'
import { LAYOUT } from '../../../config/layout'

export function WorkspaceHeader() {
  return (
    <header
      className="w-full bg-white border-b border-neutral-200 px-6 flex items-center justify-between z-30"
      style={{ height: LAYOUT.header.height }}
    >
      {/* Left Area: Logo & Name */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary-500 flex items-center justify-center text-white font-bold text-base">
          OQ
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-neutral-900 text-sm">OnboardIQ</span>
          <span className="text-xs text-neutral-300">/</span>
          <span className="text-neutral-500 text-sm">Untitled Savings Journey</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-600 font-medium text-[10px] uppercase tracking-wider">
          Draft
        </span>
      </div>

      {/* Middle Area: Future Toolbar Slot */}
      <div className="flex items-center gap-1 text-xs text-neutral-300 italic">
        Toolbar slot (Sprint 03)
      </div>

      {/* Right Area: Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled
          className="h-9 px-4 rounded-lg border border-neutral-200 text-neutral-400 font-medium text-xs bg-neutral-50 cursor-not-allowed"
        >
          Save Draft
        </button>
        <button
          type="button"
          disabled
          className="h-9 px-4 rounded-lg bg-primary-500 opacity-50 text-white font-medium text-xs cursor-not-allowed shadow-sm"
        >
          Publish
        </button>
      </div>
    </header>
  )
}
