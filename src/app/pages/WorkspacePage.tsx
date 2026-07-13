import React from 'react'
import { CanvasEngineProvider } from '../../features/canvas/components/CanvasEngineProvider'
import { Workspace } from '../../features/workspace/components/Workspace'

export default function WorkspacePage() {
  return (
    <CanvasEngineProvider>
      <Workspace />
    </CanvasEngineProvider>
  )
}
