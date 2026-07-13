import React from 'react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { WorkspaceHeader } from './WorkspaceHeader'
import { WorkspaceNavigation } from './WorkspaceNavigation'
import { WorkspaceCanvas } from './WorkspaceCanvas'
import { WorkspaceProperties } from './WorkspaceProperties'
import { LAYOUT } from '../../../config/layout'

export function Workspace() {
  const inspectorConfig = LAYOUT.inspector
  const canvasDefaultSize = 100 - inspectorConfig.defaultWidthPercent
  const canvasMinSize = 100 - inspectorConfig.maxWidthPercent

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-50 text-neutral-900 select-none">
      {/* Top Header */}
      <WorkspaceHeader />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Left Side Fixed Navigation */}
        <WorkspaceNavigation />

        {/* Center/Right Resizable Content Area */}
        <main className="flex-1 h-full overflow-hidden">
          <PanelGroup direction="horizontal">
            {/* Left Panel: Canvas Viewport */}
            <Panel defaultSize={canvasDefaultSize} minSize={canvasMinSize}>
              <WorkspaceCanvas />
            </Panel>

            {/* Drag Handle splitter separator */}
            <PanelResizeHandle
              className="w-1 bg-neutral-100 hover:bg-primary-500 active:bg-primary-600 transition-colors cursor-col-resize z-30 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Resize panels separator"
            >
              <div className="w-[2px] h-8 bg-neutral-300 rounded-full"></div>
            </PanelResizeHandle>

            {/* Right Panel: Inspector Panel */}
            <Panel
              defaultSize={inspectorConfig.defaultWidthPercent}
              minSize={inspectorConfig.minWidthPercent}
              maxSize={inspectorConfig.maxWidthPercent}
            >
              <WorkspaceProperties />
            </Panel>
          </PanelGroup>
        </main>
      </div>
    </div>
  )
}
