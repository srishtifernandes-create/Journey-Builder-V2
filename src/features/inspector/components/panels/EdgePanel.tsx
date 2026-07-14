import React from 'react'
import type { Edge } from '../../../../app/store/journeyStore'

export function EdgePanel({ edge }: { edge: Edge }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-1">Edge ID</label>
        <input
          type="text"
          disabled
          value={edge.id}
          className="w-full text-sm border border-neutral-200 rounded px-2 py-1.5 bg-neutral-50 text-neutral-500 font-mono text-xs cursor-not-allowed"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-neutral-700 mb-1">Source Node</label>
          <input
            type="text"
            disabled
            value={edge.source}
            className="w-full text-sm border border-neutral-200 rounded px-2 py-1.5 bg-neutral-50 text-neutral-500 font-mono text-xs cursor-not-allowed truncate"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-neutral-700 mb-1">Target Node</label>
          <input
            type="text"
            disabled
            value={edge.target}
            className="w-full text-sm border border-neutral-200 rounded px-2 py-1.5 bg-neutral-50 text-neutral-500 font-mono text-xs cursor-not-allowed truncate"
          />
        </div>
      </div>
      <div className="pt-4 border-t border-neutral-100">
        <p className="text-xs text-neutral-500">
          Transition rules and conditions will be available here.
        </p>
      </div>
    </div>
  )
}
