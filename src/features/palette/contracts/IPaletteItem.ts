export type PaletteItemKind = 'node' | 'template' | 'bundle' | 'favorite' | 'recent'

export interface IPaletteItem {
  id: string
  kind: PaletteItemKind
  nodeType: string
  displayName: string
  description: string
  category: string
  icon: string
  keywords: string[]
}
