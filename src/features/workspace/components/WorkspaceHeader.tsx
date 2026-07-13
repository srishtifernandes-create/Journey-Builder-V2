import React from 'react'
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react'
import { LAYOUT } from '../../../config/layout'
import { useCanvasRuntime } from '../../canvas/hooks/useCanvasRuntime'
import { useCanvasStore } from '../../../app/store/canvasStore'

export function WorkspaceHeader() {
  const runtime = useCanvasRuntime()
  const zoom = useCanvasStore((s) => s.zoom)
  const pan = useCanvasStore((s) => s.pan)

  // Format zoom to percentage
  const zoomPercent = Math.round(zoom * 100)

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

      {/* Middle Area: Viewport Control Toolbar */}
      <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg p-1">
        <button
          type="button"
          onClick={() => runtime.viewport.zoomIn()}
          title="Zoom In"
          className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200 rounded transition-colors focus:outline-none"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => runtime.viewport.zoomOut()}
          title="Zoom Out"
          className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200 rounded transition-colors focus:outline-none"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => runtime.viewport.fitView()}
          title="Fit View"
          className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200 rounded transition-colors focus:outline-none"
        >
          <Maximize className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => runtime.viewport.resetView()}
          title="Reset View"
          className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200 rounded transition-colors focus:outline-none"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <span className="h-4 w-px bg-neutral-200 mx-1"></span>

        <span className="text-[10px] font-mono text-neutral-500 px-1 whitespace-nowrap">
          {zoomPercent}% (x: {Math.round(pan.x)}, y: {Math.round(pan.y)})
        </span>
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
