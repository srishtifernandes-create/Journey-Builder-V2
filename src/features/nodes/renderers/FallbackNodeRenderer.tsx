import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { BaseNodeRenderer } from './BaseNodeRenderer'
import type { INode } from '../contracts/INode'
import type { NodeMetadata } from '../contracts/INodeRegistry'
import type { RendererDefinition } from '../contracts/INodeRenderer'

export interface FallbackNodeRendererProps {
  node: INode
  selected?: boolean
}

const FALLBACK_METADATA: NodeMetadata = {
  type: '__fallback__',
  displayName: 'Unregistered Node',
  description: 'No renderer is registered for this node type.',
  category: 'unknown',
  group: 'unknown',
  icon: 'AlertTriangle',
  keywords: [],
  tags: [],
  schemaVersion: 0,
}

const FALLBACK_DEFINITION: RendererDefinition = {
  type: '__fallback__',
  component: FallbackNodeRenderer,
  defaultWidth: 160,
  defaultHeight: 64,
  minWidth: 120,
  minHeight: 48,
  supportsPorts: [],
  resizePolicy: 'fixed',
}

export function FallbackNodeRenderer({ node, selected }: FallbackNodeRendererProps) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(`No renderer registered for node type "${node.type}". Rendering fallback.`)
  }

  return (
    <BaseNodeRenderer node={node} metadata={FALLBACK_METADATA} definition={FALLBACK_DEFINITION} selected={selected}>
      <div className="flex items-center gap-2 text-amber-700">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate text-xs font-semibold">Unregistered: {node.type}</span>
      </div>
    </BaseNodeRenderer>
  )
}

export { FALLBACK_DEFINITION }
export default FallbackNodeRenderer
