import { useMemo, useState } from 'react'
import { NodeRegistry } from '../../nodes/registry/NodeRegistry'
import type { IPaletteItem } from '../contracts/IPaletteItem'

function toPaletteItem(registration: ReturnType<typeof NodeRegistry.getAllNodes>[number]): IPaletteItem {
  const { metadata } = registration
  return {
    id: metadata.type,
    kind: 'node',
    nodeType: metadata.type,
    displayName: metadata.displayName,
    description: metadata.description,
    category: metadata.category,
    icon: metadata.icon,
    keywords: metadata.keywords,
  }
}

function matchesSearch(item: IPaletteItem, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    item.displayName.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q) ||
    item.keywords.some((keyword) => keyword.toLowerCase().includes(q))
  )
}

export function usePalette() {
  const [search, setSearch] = useState('')

  const items = useMemo(() => NodeRegistry.getAllNodes().map(toPaletteItem), [])

  const filteredItems = useMemo(
    () => items.filter((item) => matchesSearch(item, search)),
    [items, search]
  )

  const categories = useMemo(() => {
    const seen = new Set<string>()
    const ordered: string[] = []
    for (const item of filteredItems) {
      if (!seen.has(item.category)) {
        seen.add(item.category)
        ordered.push(item.category)
      }
    }
    return ordered
  }, [filteredItems])

  const itemsByCategory = useMemo(() => {
    const map = new Map<string, IPaletteItem[]>()
    for (const item of filteredItems) {
      const list = map.get(item.category) ?? []
      list.push(item)
      map.set(item.category, list)
    }
    return map
  }, [filteredItems])

  return {
    search,
    setSearch,
    categories,
    getItemsForCategory: (category: string) => itemsByCategory.get(category) ?? [],
  }
}
