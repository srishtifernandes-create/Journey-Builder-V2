import React from 'react'
import { Flag } from 'lucide-react'
import { BaseNodeRenderer } from './BaseNodeRenderer'
import { useNodeRenderer } from '../hooks/useNodeRenderer'
import type { INode } from '../contracts/INode'

export interface TerminalNodeRendererProps {
  data: {
    node: INode
  }
  selected?: boolean
}

export function TerminalNodeRenderer({ data, selected }: TerminalNodeRendererProps) {
  const { node } = data
  const { metadata, definition } = useNodeRenderer(node.type)
  const title = node.config.title || 'Journey Complete'

  return (
    <BaseNodeRenderer node={node} metadata={metadata} definition={definition} selected={selected}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
          <Flag className="w-3.5 h-3.5" />
        </div>
        <span className="truncate text-xs font-semibold text-neutral-800">
          {title}
        </span>
      </div>
    </BaseNodeRenderer>
  )
}

export default TerminalNodeRenderer
