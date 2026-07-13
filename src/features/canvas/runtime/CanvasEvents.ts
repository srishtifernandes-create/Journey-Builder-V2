import type { ViewportState, SelectionState } from './contracts/ICanvasAdapter'

type EventCallbackMap = {
  canvasClick: (event: MouseEvent) => void
  canvasDoubleClick: (event: MouseEvent) => void
  paneContextMenu: (event: MouseEvent) => void
  viewportChange: (viewport: ViewportState) => void
  selectionChange: (selection: SelectionState) => void
  keydown: (trigger: string) => void
}

export class CanvasEvents {
  private listeners: { [K in keyof EventCallbackMap]?: Set<EventCallbackMap[K]> } = {}

  public on<K extends keyof EventCallbackMap>(event: K, callback: EventCallbackMap[K]): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set()
    }
    this.listeners[event]!.add(callback)

    return () => {
      this.listeners[event]?.delete(callback)
    }
  }

  public emit<K extends keyof EventCallbackMap>(event: K, ...args: Parameters<EventCallbackMap[K]>): void {
    const list = this.listeners[event]
    if (list) {
      list.forEach((cb: any) => {
        try {
          cb(...args)
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err)
        }
      })
    }
  }

  public clear(): void {
    this.listeners = {}
  }
}
