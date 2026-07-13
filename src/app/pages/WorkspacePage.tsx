import React, { useEffect } from 'react'
import { CanvasEngineProvider } from '../../features/canvas/components/CanvasEngineProvider'
import { Workspace } from '../../features/workspace/components/Workspace'
import { useJourneyStore } from '../store/journeyStore'
import { NodeFactory } from '../../features/nodes/factory/NodeFactory'

export default function WorkspacePage() {
  const nodes = useJourneyStore((s) => s.nodes)
  const setNodes = useJourneyStore((s) => s.setNodes)

  useEffect(() => {
    if (nodes.length === 0) {
      // Create default nodes using the NodeFactory for validation
      const screenNode = NodeFactory.createNode('screen', { x: 250, y: 150 })
      screenNode.config.title = 'Applicant Onboarding Form'

      const terminalNode = NodeFactory.createNode('terminal', { x: 280, y: 350 })
      terminalNode.config.title = 'Welcome Finished'

      setNodes([screenNode, terminalNode])
    }
  }, [nodes.length, setNodes])

  return (
    <CanvasEngineProvider>
      <Workspace />
    </CanvasEngineProvider>
  )
}
