import React from 'react'
import {
  Workflow,
  Library,
  FolderClosed,
  ShieldCheck,
  History,
  Settings,
} from 'lucide-react'
import { LAYOUT } from '../../../config/layout'

export function WorkspaceNavigation() {
  const items = [
    { icon: Workflow, label: 'Canvas', active: true },
    { icon: Library, label: 'Templates' },
    { icon: FolderClosed, label: 'Assets' },
    { icon: ShieldCheck, label: 'Validation' },
    { icon: History, label: 'History' },
    { icon: Settings, label: 'Settings' },
  ]

  return (
    <nav
      className="bg-white border-r border-neutral-200 flex flex-col items-center py-4 gap-2 z-20"
      style={{ width: LAYOUT.sidebar.width }}
    >
      {items.map((item, idx) => {
        const IconComponent = item.icon
        return (
          <button
            key={idx}
            type="button"
            title={item.label}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
              item.active
                ? 'bg-primary-50 text-primary-500'
                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
            }`}
          >
            <IconComponent className="w-5 h-5 stroke-[1.75]" />
            <span className="absolute left-12 bg-neutral-900 text-white text-[10px] font-medium px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
