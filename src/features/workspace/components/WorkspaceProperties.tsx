import React, { useState } from 'react'
import { useUIStore } from '../../../app/store/uiStore'
import { useEmptyStateStage, isCoachMarkDismissed, dismissCoachMark } from '../../canvas/hooks/useEmptyStateStage'
import { useSelectionStore } from '../../../app/store/selectionStore'
import { useJourneyStore } from '../../../app/store/journeyStore'
import { useNodeRenderer } from '../../nodes/hooks/useNodeRenderer'

export function WorkspaceProperties() {
  const { activeInspectorTab, setActiveInspectorTab } = useUIStore()
  const stage = useEmptyStateStage()
  const [coachMarkDismissed, setCoachMarkDismissed] = useState(isCoachMarkDismissed())
  const selectedNodeId = useSelectionStore(s => s.selectedNodeId)
  const node = useJourneyStore(s => s.nodes.find(n => n.id === selectedNodeId))
  const { metadata } = useNodeRenderer(node?.type || 'screen')

  const showCoachMark = stage === 'normal' && !coachMarkDismissed

  const handleDismissCoachMark = () => {
    dismissCoachMark()
    setCoachMarkDismissed(true)
  }

  const tabs: Array<{ id: 'config' | 'rules' | 'history'; label: string }> = [
    { id: 'config', label: 'Config' },
    { id: 'rules', label: 'Rules' },
    { id: 'history', label: 'History' },
  ]

  return (
    <aside className="w-full h-full bg-white flex flex-col z-20">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
        <h2 className="text-sm font-semibold text-neutral-900">{node ? metadata.displayName : 'Properties'}</h2>
        {node && (
          <span className="text-[10px] bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded font-medium">
            {node.type}
          </span>
        )}
      </div>

      {showCoachMark && (
        <div className="px-4 py-3 bg-primary-50 border-b border-primary-100 flex items-start justify-between gap-3">
          <p className="text-xs text-primary-700 leading-snug">
            Select a node on the canvas to configure it here.
          </p>
          <button
            type="button"
            onClick={handleDismissCoachMark}
            className="text-primary-500 hover:text-primary-700 text-xs font-medium flex-shrink-0 focus:outline-none"
          >
            Got it
          </button>
        </div>
      )}

      {/* Tabs list */}
      <div className="flex border-b border-neutral-200 bg-neutral-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveInspectorTab(tab.id)}
            className={`flex-1 py-2 text-xs font-medium border-b-2 text-center transition-colors focus:outline-none ${
              activeInspectorTab === tab.id
                ? 'border-primary-500 text-primary-500 bg-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel Content (Scrollable Skeleton Container) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {node && activeInspectorTab === 'config' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Title</label>
              <input
                type="text"
                defaultValue={node.config.title}
                className="w-full text-sm border border-neutral-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Node ID</label>
              <input
                type="text"
                disabled
                defaultValue={node.id}
                className="w-full text-sm border border-neutral-200 rounded px-2 py-1.5 bg-neutral-50 text-neutral-500 font-mono text-xs cursor-not-allowed"
              />
            </div>
            <div className="pt-4 border-t border-neutral-100">
              <p className="text-xs text-neutral-500">More configuration options for {metadata.displayName} will be available here.</p>
            </div>
          </div>
        )}

        {node && activeInspectorTab === 'rules' && (
          <div className="flex items-center justify-center h-32">
            <p className="text-xs text-neutral-400">No rules configured.</p>
          </div>
        )}

        {node && activeInspectorTab === 'history' && (
          <div className="flex items-center justify-center h-32">
            <p className="text-xs text-neutral-400">No history available.</p>
          </div>
        )}
      </div>
    </aside>
  )
}
