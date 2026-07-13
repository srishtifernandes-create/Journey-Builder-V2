import type { SelectionState } from './ICanvasAdapter'

export interface ISelectionManager {
  readonly currentSelection: SelectionState
  selectNode(nodeId: string | null): void
  clearSelection(): void
}
