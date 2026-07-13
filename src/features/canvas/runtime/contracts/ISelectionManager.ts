import type { SelectionState } from './ICanvasAdapter'

export interface ISelectionManager {
  readonly currentSelection: SelectionState
  clearSelection(): void
}
