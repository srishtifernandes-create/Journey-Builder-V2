import React, { useState, useRef, useEffect } from 'react'
import { useJourneyStore } from '../../../app/store/journeyStore'
import { useSelectionStore } from '../../../app/store/selectionStore'
import { useCanvasEngine } from '../../canvas/components/CanvasEngineProvider'
import { LayoutList, Plus } from 'lucide-react'

export function ScreenFlowTree() {
  const nodes = useJourneyStore((s) => s.nodes)
  const updateNodeConfig = useJourneyStore((s) => s.updateNodeConfig)
  const selectedNodeId = useSelectionStore((s) => s.selectedNodeId)
  const selectNode = useSelectionStore((s) => s.selectNode)
  const { runtime } = useCanvasEngine()

  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when editing starts
  useEffect(() => {
    if (editingNodeId && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingNodeId])

  // For Milestone 1, we only display nodes that are screens
  const screenNodes = nodes.filter((n) => n.metadata?.category === 'Screens')

  const handleAddScreen = () => {
    // Determine center of viewport
    const vp = runtime.viewport.viewport
    // A simple approximate center (in flow coordinates)
    const centerX = -vp.x / vp.zoom + 400
    const centerY = -vp.y / vp.zoom + 300
    runtime.createNode('otp', { x: centerX, y: centerY })
  }

  return (
    <div className="h-full w-full flex flex-col bg-white">
      <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
          <LayoutList className="w-4 h-4 text-neutral-500" />
          Screen Flow
        </h3>
        <button
          onClick={handleAddScreen}
          className="p-1 rounded-md text-neutral-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          title="Add Screen"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {screenNodes.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-neutral-500 mb-4">No screens in this journey yet.</p>
            <button
              onClick={handleAddScreen}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-md transition-colors"
            >
              Add First Screen
            </button>
          </div>
        ) : (
          <ul className="space-y-1 px-2">
            {screenNodes.map((node) => {
              const isActive = node.id === selectedNodeId
              const isEditing = node.id === editingNodeId
              const title = node.config?.title || node.metadata.displayName

              const handleStartEdit = () => {
                setEditingNodeId(node.id)
                setEditValue(title)
              }

              const handleCommitEdit = () => {
                if (editValue.trim() && editValue !== title) {
                  updateNodeConfig?.(node.id, { title: editValue.trim() })
                }
                setEditingNodeId(null)
              }

              return (
                <li key={node.id}>
                  {isEditing ? (
                    <input
                      ref={inputRef}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCommitEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCommitEdit()
                        if (e.key === 'Escape') setEditingNodeId(null)
                      }}
                      className="w-full px-3 py-2 text-sm border border-primary-500 rounded-md outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  ) : (
                    <button
                      onClick={() => selectNode(node.id)}
                      onDoubleClick={handleStartEdit}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="truncate">{title}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                      )}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
