import React, { useState } from 'react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { WorkspaceHeader } from './WorkspaceHeader'
import { WorkspaceProperties } from './WorkspaceProperties'
import { WorkspaceCanvas } from './WorkspaceCanvas'
import { NodePalette } from '../../palette/components/NodePalette'
import { ScreenFlowTree } from '../../screenflow/components/ScreenFlowTree'
import { useSelectionStore } from '../../../app/store/selectionStore'
import { useJourneyStore } from '../../../app/store/journeyStore'
import { 
  ArrowLeft, 
  Pencil, 
  ChevronDown, 
  ChevronRight, 
  LayoutList, 
  Library 
} from 'lucide-react'

export function Workspace() {
  const selectedNodeId = useSelectionStore((s) => s.selectedNodeId)
  const metadata = useJourneyStore((s) => s.metadata)
  
  const [expandedFlow, setExpandedFlow] = useState(true)
  const [expandedLibrary, setExpandedLibrary] = useState(true)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [journeyTitle, setJourneyTitle] = useState(metadata?.name || 'CUB RM Assisted Account Opening')

  const handleTitleSubmit = () => {
    setIsEditingTitle(false)
    useJourneyStore.setState((s) => ({
      metadata: s.metadata ? { ...s.metadata, name: journeyTitle } : { id: 'cub-assisted', name: journeyTitle, version: 1.0, status: 'draft' }
    }))
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-50 text-neutral-900 select-none">
      {/* Top Header */}
      <WorkspaceHeader />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 w-full overflow-hidden">
        
        {/* Unified Figma-Spec Left Sidebar */}
        <aside className="w-80 h-full flex-shrink-0 bg-white border-r border-neutral-200 flex flex-col z-20 select-none">
          
          {/* Top Section: Journey Metadata */}
          <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 shrink-0">
            {/* Back to Lifecycle */}
            <button 
              type="button"
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 mb-3 font-semibold transition-colors focus:outline-none"
              onClick={() => console.log('Back to lifecycle')}
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Back to lifecycle</span>
            </button>

            {/* Title & Edit */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {isEditingTitle ? (
                  <input
                    value={journeyTitle}
                    onChange={(e) => setJourneyTitle(e.target.value)}
                    onBlur={handleTitleSubmit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleSubmit()
                      if (e.key === 'Escape') setIsEditingTitle(false)
                    }}
                    className="w-full text-sm font-bold text-neutral-900 bg-white border border-primary-500 rounded px-2 py-1 outline-none"
                    autoFocus
                  />
                ) : (
                  <h1 
                    onDoubleClick={() => setIsEditingTitle(true)}
                    className="text-sm font-bold text-neutral-900 tracking-tight leading-snug truncate cursor-text"
                  >
                    {journeyTitle}
                  </h1>
                )}
                
                {/* Journey Type */}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary-50 text-primary-700 uppercase tracking-wider">
                    RM Assisted
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">v1.0</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingTitle(true)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 transition-colors shrink-0 focus:outline-none"
                title="Edit Title"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Middle Section: Screen Flow (Collapsible) */}
          <div className={`flex flex-col border-b border-neutral-200 ${expandedFlow ? 'flex-1 min-h-0' : 'shrink-0'}`}>
            <button
              onClick={() => setExpandedFlow(!expandedFlow)}
              className="w-full px-4 py-2 bg-neutral-50 hover:bg-neutral-100 flex items-center justify-between transition-colors focus:outline-none select-none"
            >
              <div className="flex items-center gap-2">
                <LayoutList className="w-4 h-4 text-neutral-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Screen Flow</span>
              </div>
              {expandedFlow ? (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              )}
            </button>
            
            {expandedFlow && (
              <div className="flex-1 flex flex-col min-h-0">
                <ScreenFlowTree />
              </div>
            )}
          </div>

          {/* Bottom Section: Node Library (Collapsible) */}
          <div className={`flex flex-col ${expandedLibrary ? 'flex-1 min-h-0' : 'shrink-0'}`}>
            <button
              onClick={() => setExpandedLibrary(!expandedLibrary)}
              className="w-full px-4 py-2 bg-neutral-50 hover:bg-neutral-100 flex items-center justify-between border-b border-neutral-200 transition-colors focus:outline-none select-none"
            >
              <div className="flex items-center gap-2">
                <Library className="w-4 h-4 text-neutral-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Node Library</span>
              </div>
              {expandedLibrary ? (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              )}
            </button>

            {expandedLibrary && (
              <div className="flex-1 flex flex-col min-h-0">
                <NodePalette />
              </div>
            )}
          </div>

        </aside>

        {/* Center/Right Resizable Content Area */}
        <main className="flex-1 h-full overflow-hidden">
          <PanelGroup direction="horizontal">
            {/* Left Panel: Canvas Viewport */}
            <Panel defaultSize={80} minSize={60}>
              <WorkspaceCanvas />
            </Panel>

            {selectedNodeId && (
              <>
                {/* Drag Handle splitter separator */}
                <PanelResizeHandle
                  className="w-1 bg-neutral-100 hover:bg-neutral-300 active:bg-neutral-400 transition-colors cursor-col-resize z-30 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  aria-label="Resize panels separator"
                >
                  <div className="w-[2px] h-8 bg-neutral-300 rounded-full"></div>
                </PanelResizeHandle>

                {/* Right Panel: Inspector Panel */}
                <Panel
                  defaultSize={20}
                  minSize={15}
                  maxSize={30}
                >
                  <WorkspaceProperties />
                </Panel>
              </>
            )}
          </PanelGroup>
        </main>

      </div>
    </div>
  )
}
