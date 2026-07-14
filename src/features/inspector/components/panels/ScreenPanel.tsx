import React from 'react'
import type { INode } from '../../../nodes/contracts/INode'
import { useJourneyStore } from '../../../../app/store/journeyStore'

export function ScreenPanel({ node }: { node: INode }) {
  const updateNodeConfig = useJourneyStore((s) => s.updateNodeConfig)

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-1">Screen Title</label>
        <input
          type="text"
          value={node.config.title || ''}
          onChange={(e) => updateNodeConfig(node.id, { title: e.target.value })}
          className="w-full text-sm border border-neutral-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-1">Node ID</label>
        <input
          type="text"
          disabled
          value={node.id}
          className="w-full text-sm border border-neutral-200 rounded px-2 py-1.5 bg-neutral-50 text-neutral-500 font-mono text-xs cursor-not-allowed"
        />
      </div>
      <div className="pt-4 border-t border-neutral-100">
        <p className="text-xs text-neutral-500">
          Form builder and content configuration will be available here.
        </p>
      </div>
    </div>
  )
}
