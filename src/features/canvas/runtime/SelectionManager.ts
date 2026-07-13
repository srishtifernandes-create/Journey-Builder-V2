import type { ISelectionManager } from './contracts/ISelectionManager'
import type { SelectionState, ICanvasAdapter } from './contracts/ICanvasAdapter'
import type { CanvasEvents } from './CanvasEvents'

export class SelectionManager implements ISelectionManager {
  private events: CanvasEvents
  private adapter: ICanvasAdapter | null = null
  private selection: SelectionState = { nodes: [], edges: [] }

  constructor(events: CanvasEvents) {
    this.events = events
  }

  public setAdapter(adapter: ICanvasAdapter) {
    this.adapter = adapter
    
    // Subscribe to selection change event on the adapter
    this.adapter.onSelectionChange((selection) => {
      this.selection = selection
      this.events.emit('selectionChange', selection)
    })
  }

  public get currentSelection(): SelectionState {
    return this.selection
  }

  public clearSelection(): void {
    this.selection = { nodes: [], edges: [] }
    this.events.emit('selectionChange', this.selection)
  }
}
