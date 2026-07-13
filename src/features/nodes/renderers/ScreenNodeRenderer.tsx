import React from 'react'
import { Monitor } from 'lucide-react'
import { BaseNodeRenderer } from './BaseNodeRenderer'
import { useNodeRenderer } from '../hooks/useNodeRenderer'
import type { INode } from '../contracts/INode'

export interface ScreenNodeRendererProps {
  data: {
    node: INode
  }
  selected?: boolean
}

export function ScreenNodeRenderer({ data, selected }: ScreenNodeRendererProps) {
  const { node } = data
  const { metadata, definition } = useNodeRenderer(node.type)
  const title = node.config.title || 'Untitled Screen'

  return (
    <BaseNodeRenderer node={node} metadata={metadata} definition={definition} selected={selected}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
          <Monitor className="w-3.5 h-3.5" />
        </div>
        <span className="truncate text-xs font-semibold text-neutral-800">
          {title}
        </span>
      </div>
    </BaseNodeRenderer>
  )
}

export default ScreenNodeRenderer
