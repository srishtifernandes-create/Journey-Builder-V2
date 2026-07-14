import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useJourneyStore } from '../../../app/store/journeyStore'
import { useSelectionStore } from '../../../app/store/selectionStore'
import { useCanvasEngine } from '../../canvas/components/CanvasEngineProvider'
import { 
  LayoutList, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  GripVertical, 
  MoreVertical, 
  Copy, 
  Trash2, 
  Edit3, 
  FolderPlus,
  Monitor
} from 'lucide-react'

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface FlatItem {
  id: string
  title: string
  type: string
  category: string
  depth: number
  isSection: boolean
}

// Subcomponent for each sortable list item
interface SortableItemProps {
  item: FlatItem
  selectedNodeId: string | null
  onSelect: (id: string) => void
  onRename: (id: string, newTitle: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  collapsedSections: Set<string>
  onToggleSection: (id: string) => void
}

function SortableTreeItem({
  item,
  selectedNodeId,
  onSelect,
  onRename,
  onDuplicate,
  onDelete,
  collapsedSections,
  onToggleSection
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id })

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(item.title)
  const [menuOpen, setMenuOpen] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Close context menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const handleCommitRename = () => {
    if (editValue.trim() && editValue !== item.title) {
      onRename(item.id, editValue.trim())
    }
    setIsEditing(false)
  }

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
    position: 'relative'
  }

  const isActive = selectedNodeId === item.id
  const isCollapsed = collapsedSections.has(item.id)

  if (item.isSection) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="mb-2 group/section bg-neutral-50/80 border border-neutral-200/80 rounded-lg p-2.5 flex items-center justify-between hover:bg-neutral-100/50 transition-colors"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="text-neutral-400 hover:text-neutral-600 cursor-grab active:cursor-grabbing p-0.5"
            title="Drag Section"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => onToggleSection(item.id)}
            className="text-neutral-500 hover:text-neutral-800 p-0.5 rounded"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {isEditing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleCommitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCommitRename()
                if (e.key === 'Escape') setIsEditing(false)
              }}
              className="text-xs font-semibold text-neutral-800 bg-white border border-primary-500 rounded px-1.5 py-0.5 outline-none w-full"
            />
          ) : (
            <span
              onDoubleClick={() => {
                setIsEditing(true)
                setEditValue(item.title)
              }}
              className="text-xs font-bold text-neutral-800 uppercase tracking-wider truncate cursor-text flex-1 select-text"
            >
              {item.title}
            </span>
          )}
        </div>

        {/* Section Actions Menu */}
        <div className="relative flex items-center" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 top-6 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 w-28 text-left z-50 animate-in fade-in slide-in-from-top-1 duration-100">
              <button
                onClick={() => {
                  setIsEditing(true)
                  setMenuOpen(false)
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-xs text-neutral-700 flex items-center gap-1.5 font-medium"
              >
                <Edit3 className="w-3.5 h-3.5" /> Rename
              </button>
              <button
                onClick={() => {
                  onDelete(item.id)
                  setMenuOpen(false)
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-xs text-red-600 flex items-center gap-1.5 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render standard screen/node flow card
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "flex items-center gap-2 p-2 rounded-lg border text-xs transition-all mb-1 group/item",
        isActive 
          ? "bg-primary-50 border-primary-200 text-primary-900 font-medium" 
          : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50/50"
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-neutral-300 hover:text-neutral-500 cursor-grab active:cursor-grabbing p-0.5"
        title="Drag Item"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>

      {/* Node Icon */}
      <div className="w-5 h-5 rounded bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
        <Monitor className="w-3 h-3" />
      </div>

      {isEditing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleCommitRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCommitRename()
            if (e.key === 'Escape') setIsEditing(false)
          }}
          className="text-xs bg-white border border-primary-500 rounded px-1.5 py-0.5 outline-none w-full"
        />
      ) : (
        <span
          onClick={() => onSelect(item.id)}
          onDoubleClick={() => {
            setIsEditing(true)
            setEditValue(item.title)
          }}
          className="truncate flex-1 cursor-text select-text py-0.5 text-left"
        >
          {item.title}
        </span>
      )}

      {/* Item metadata category badge */}
      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-500 shrink-0 font-semibold group-hover/item:opacity-0 transition-opacity">
        {item.category}
      </span>

      {/* Item Context Actions */}
      <div className="relative flex items-center" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 opacity-0 group-hover/item:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
        
        {menuOpen && (
          <div className="absolute right-0 top-6 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 w-28 text-left z-50 animate-in fade-in slide-in-from-top-1 duration-100">
            <button
              onClick={() => {
                setIsEditing(true)
                setMenuOpen(false)
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-xs text-neutral-700 flex items-center gap-1.5 font-medium"
            >
              <Edit3 className="w-3.5 h-3.5" /> Rename
            </button>
            <button
              onClick={() => {
                onDuplicate(item.id)
                setMenuOpen(false)
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-xs text-neutral-700 flex items-center gap-1.5 font-medium"
            >
              <Copy className="w-3.5 h-3.5" /> Duplicate
            </button>
            <button
              onClick={() => {
                onDelete(item.id)
                setMenuOpen(false)
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-xs text-red-600 flex items-center gap-1.5 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function ScreenFlowTree() {
  const nodes = useJourneyStore((s) => s.nodes)
  const edges = useJourneyStore((s) => s.edges)
  const setNodes = useJourneyStore((s) => s.setNodes)
  const deleteNode = useJourneyStore((s) => s.deleteNode)
  const duplicateNode = useJourneyStore((s) => s.duplicateNode)
  const updateNodeConfig = useJourneyStore((s) => s.updateNodeConfig)
  
  const selectedNodeId = useSelectionStore((s) => s.selectedNodeId)
  const selectNode = useSelectionStore((s) => s.selectNode)
  const clearSelection = useSelectionStore((s) => s.clearSelection)
  
  const { runtime } = useCanvasEngine()

  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  // Sensors for DND Kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4, // 4px drag threshold to allow click vs drag
      },
    })
  )

  // Generate flat list of screens/sections based on graph traversal
  const flatItems = useMemo(() => {
    if (nodes.length === 0) return []

    // Map targets to quickly check incoming connections
    const targetIds = new Set<string>()
    edges.forEach((edge) => {
      if (edge.target) targetIds.add(edge.target)
    })

    // Separate section nodes from canvas-renderable nodes
    const sections = nodes.filter((n) => n.type === 'section')
    
    // Non-section roots are nodes without incoming edges, or start nodes
    let nonSectionRoots = nodes.filter((n) => n.type !== 'section' && (!targetIds.has(n.id) || n.type === 'start'))
    if (nonSectionRoots.length === 0 && nodes.length > sections.length) {
      nonSectionRoots = [nodes.find((n) => n.type !== 'section')!]
    }

    const visited = new Set<string>()
    const traversedList: FlatItem[] = []

    const traverse = (nodeId: string, depth: number) => {
      if (visited.has(nodeId)) return
      visited.add(nodeId)

      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return

      traversedList.push({
        id: node.id,
        title: node.config?.title || node.metadata?.displayName || node.type,
        type: node.type,
        category: node.metadata?.category || 'Unknown',
        depth,
        isSection: false
      })

      // Follow outgoing edges
      const outgoingEdges = edges.filter((e) => e.source === nodeId)
      outgoingEdges.forEach((edge) => {
        traverse(edge.target, depth + 1)
      })
    }

    // Traverse starting from roots
    nonSectionRoots.forEach((root) => {
      traverse(root.id, 0)
    })

    // Collect any orphan screens that were missed by traversal
    nodes.forEach((node) => {
      if (node.type !== 'section' && !visited.has(node.id)) {
        traverse(node.id, 0)
      }
    })

    // Now interleave sections. A section will group all nodes that come after it.
    // In our nodes array, the physical order determines section placement.
    const combinedList: FlatItem[] = []
    
    // We group by physical index: sections partition the physical array order.
    // Let's create flat list items representing the PHYSICAL order of sections
    // and TRAVERSED/PHYSICAL order of screens.
    // To keep it simple and match Figma reordering perfectly, we construct the list
    // based on the physical `nodes` array order in the store!
    nodes.forEach((node) => {
      const isSec = node.type === 'section'
      const title = node.config?.title || node.metadata?.displayName || node.type
      
      // Compute depth for screens in sections (just 1 if under a section, 0 otherwise)
      combinedList.push({
        id: node.id,
        title,
        type: node.type,
        category: node.metadata?.category || (isSec ? 'Section' : 'Unknown'),
        depth: isSec ? 0 : 1,
        isSection: isSec
      })
    })

    // Filter out items in collapsed sections
    const filteredList: FlatItem[] = []
    let currentSectionCollapsed = false

    combinedList.forEach((item) => {
      if (item.isSection) {
        currentSectionCollapsed = collapsedSections.has(item.id)
        filteredList.push(item)
      } else {
        if (!currentSectionCollapsed) {
          filteredList.push(item)
        }
      }
    })

    return filteredList
  }, [nodes, edges, collapsedSections])

  const handleAddScreen = () => {
    const vp = runtime.viewport.viewport
    const centerX = -vp.x / vp.zoom + 300
    const centerY = -vp.y / vp.zoom + 200
    runtime.createNode('consent_screen', { x: centerX, y: centerY })
  }

  const handleAddSection = () => {
    // Add a virtual section spacer node to the store
    const id = `section-${crypto.randomUUID()}`
    const newSectionNode = {
      id,
      type: 'section',
      schemaVersion: 1,
      position: { x: 0, y: 0 },
      config: { title: 'New Section' },
      ports: {},
      capabilities: { canHaveFields: false, canRoute: false, isIntegration: false, isTerminal: false },
      uiState: {
        status: 'default',
        configCompleteStatus: 'not_started'
      }
    }
    useJourneyStore.setState((s) => ({
      nodes: [...s.nodes, newSectionNode]
    }))
  }

  const handleToggleSection = (id: string) => {
    const nextCollapsed = new Set(collapsedSections)
    if (nextCollapsed.has(id)) {
      nextCollapsed.delete(id)
    } else {
      nextCollapsed.add(id)
    }
    setCollapsedSections(nextCollapsed)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeIndex = nodes.findIndex((n) => n.id === active.id)
    const overIndex = nodes.findIndex((n) => n.id === over.id)

    if (activeIndex !== -1 && overIndex !== -1) {
      const newNodes = [...nodes]
      const [removed] = newNodes.splice(activeIndex, 1)
      newNodes.splice(overIndex, 0, removed)
      setNodes(newNodes)
    }
  }

  const handleDeleteItem = (id: string) => {
    if (id === selectedNodeId) {
      clearSelection()
    }
    deleteNode(id)
  }

  const handleRenameItem = (id: string, newTitle: string) => {
    updateNodeConfig(id, { title: newTitle })
  }

  const handleDuplicateItem = (id: string) => {
    duplicateNode(id)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* Screen Flow Section Header */}
      <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between bg-white select-none">
        <div className="flex items-center gap-2">
          <LayoutList className="w-4 h-4 text-neutral-500" />
          <span className="text-sm font-semibold text-neutral-900">Screen Flow</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleAddSection}
            className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors"
            title="Add Section"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddScreen}
            className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors"
            title="Add Screen"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Screen Flow Tree List (DND Context) */}
      <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
        {flatItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-neutral-400">No screens or sections yet.</p>
            <button
              onClick={handleAddScreen}
              className="mt-3 text-xs text-primary-600 font-semibold hover:text-primary-700 hover:bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 transition-colors"
            >
              Add Screen
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={flatItems.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1">
                {flatItems.map((item) => (
                  <SortableTreeItem
                    key={item.id}
                    item={item}
                    selectedNodeId={selectedNodeId}
                    onSelect={selectNode}
                    onRename={handleRenameItem}
                    onDuplicate={handleDuplicateItem}
                    onDelete={handleDeleteItem}
                    collapsedSections={collapsedSections}
                    onToggleSection={handleToggleSection}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
