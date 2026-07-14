import React from 'react'
import { GitBranch } from 'lucide-react'
import { BaseNodeRenderer } from './BaseNodeRenderer'
import { useNodeRenderer } from '../hooks/useNodeRenderer'
import type { INode } from '../contracts/INode'

export interface FlowNodeRendererProps {
  data: {
    node: INode
  }
  selected?: boolean
}

export function FlowNodeRenderer({ data, selected }: FlowNodeRendererProps) {
  const { node } = data
  const { metadata, definition } = useNodeRenderer(node.type)
  const title = node.config.title || metadata.displayName

  return (
    <BaseNodeRenderer node={node} metadata={metadata} definition={definition} selected={selected}>
      <div className="flex items-center gap-2 mt-1">
        <div className="w-6 h-6 rounded bg-neutral-100 flex items-center justify-center text-neutral-600">
          <GitBranch className="w-3.5 h-3.5" />
        </div>
        <span className="truncate text-xs font-medium text-neutral-800">
          {title}
        </span>
      </div>
    </BaseNodeRenderer>
  )
}

export default FlowNodeRenderer
