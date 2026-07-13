import React from 'react'
import { useUIStore } from '../../../app/store/uiStore'

export function WorkspaceProperties() {
  const { activeInspectorTab, setActiveInspectorTab } = useUIStore()

  const tabs: Array<{ id: 'config' | 'rules' | 'history'; label: string }> = [
    { id: 'config', label: 'Config' },
    { id: 'rules', label: 'Rules' },
    { id: 'history', label: 'History' },
  ]

  return (
    <aside className="w-full h-full bg-white flex flex-col z-20">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">Properties Inspector</h2>
        <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded font-mono">
          Sprint 02
        </span>
      </div>

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
        {activeInspectorTab === 'config' && (
          <div className="space-y-4 animate-pulse">
            <div>
              <div className="h-3 w-16 bg-neutral-200 rounded mb-2"></div>
              <div className="h-9 w-full bg-neutral-100 rounded"></div>
            </div>
            <div>
              <div className="h-3 w-24 bg-neutral-200 rounded mb-2"></div>
              <div className="h-9 w-full bg-neutral-100 rounded"></div>
            </div>
            <div>
              <div className="h-3 w-20 bg-neutral-200 rounded mb-2"></div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-neutral-200 rounded"></div>
                  <div className="h-3 w-28 bg-neutral-100 rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-neutral-200 rounded"></div>
                  <div className="h-3 w-32 bg-neutral-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeInspectorTab === 'rules' && (
          <div className="space-y-4 animate-pulse">
            <div>
              <div className="h-3.5 w-24 bg-neutral-200 rounded mb-2"></div>
              <div className="h-20 w-full bg-neutral-100 rounded"></div>
            </div>
            <div>
              <div className="h-3.5 w-28 bg-neutral-200 rounded mb-2"></div>
              <div className="h-20 w-full bg-neutral-100 rounded"></div>
            </div>
          </div>
        )}

        {activeInspectorTab === 'history' && (
          <div className="space-y-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-neutral-200 rounded"></div>
                <div className="h-2.5 w-16 bg-neutral-100 rounded"></div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 bg-neutral-200 rounded"></div>
                <div className="h-2.5 w-16 bg-neutral-100 rounded"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
