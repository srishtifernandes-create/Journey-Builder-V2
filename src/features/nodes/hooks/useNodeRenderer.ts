import { useMemo } from 'react'
import { NodeRegistry } from '../registry/NodeRegistry'
import { RendererRegistry } from '../registry/RendererRegistry'
import type { NodeMetadata } from '../contracts/INodeRegistry'
import type { RendererDefinition } from '../contracts/INodeRenderer'

export interface UseNodeRendererResult {
  metadata: NodeMetadata
  definition: RendererDefinition
}

const UNKNOWN_METADATA: NodeMetadata = {
  type: '__unknown__',
  displayName: 'Unknown Node',
  description: 'No metadata is registered for this node type.',
  category: 'unknown',
  group: 'unknown',
  icon: 'AlertTriangle',
  keywords: [],
  tags: [],
  schemaVersion: 0,
}

export function useNodeRenderer(type: string): UseNodeRendererResult {
  return useMemo(
    () => ({
      metadata: NodeRegistry.getNodeMetadata(type) ?? UNKNOWN_METADATA,
      definition: RendererRegistry.getRenderer(type),
    }),
    [type]
  )
}
