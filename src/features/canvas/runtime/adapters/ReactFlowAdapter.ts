import type { ICanvasAdapter, ViewportState, SelectionState } from '../contracts/ICanvasAdapter'

// Minimal typing wrapper for `@xyflow/react` instance to keep the adapter type-safe
export interface RFInstance {
  zoomIn(options?: { duration?: number }): void
  zoomOut(options?: { duration?: number }): void
  fitView(options?: { duration?: number; padding?: number }): void
  getViewport(): { x: number; y: number; zoom: number }
  setViewport(viewport: { x: number; y: number; zoom: number }, options?: { duration?: number }): void
}

export class ReactFlowAdapter implements ICanvasAdapter {
  private rf: RFInstance | null = null
  private viewportListeners = new Set<(vp: ViewportState) => void>()
  private clickListeners = new Set<(e: MouseEvent) => void>()
  private doubleClickListeners = new Set<(e: MouseEvent) => void>()
  private contextMenuListeners = new Set<(e: MouseEvent) => void>()
  private selectionListeners = new Set<(sel: SelectionState) => void>()

  public setInstance(rfInstance: RFInstance | null) {
    this.rf = rfInstance
  }

  public zoomIn(): void {
    this.rf?.zoomIn({ duration: 200 })
  }

  public zoomOut(): void {
    this.rf?.zoomOut({ duration: 200 })
  }

  public fitView(): void {
    this.rf?.fitView({ duration: 200 })
  }

  public resetView(): void {
    this.rf?.setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 200 })
  }

  public getViewport(): ViewportState {
    if (!this.rf) return { x: 0, y: 0, zoom: 1 }
    const vp = this.rf.getViewport()
    return { x: vp.x, y: vp.y, zoom: vp.zoom }
  }

  public setViewport(x: number, y: number, zoom: number): void {
    this.rf?.setViewport({ x, y, zoom }, { duration: 200 })
  }

  // Propagation Trigger Hooks called by CanvasViewport element callbacks
  public triggerViewportChange(vp: ViewportState): void {
    this.viewportListeners.forEach((cb) => cb(vp))
  }

  public triggerPaneClick(e: MouseEvent): void {
    this.clickListeners.forEach((cb) => cb(e))
  }

  public triggerPaneDoubleClick(e: MouseEvent): void {
    this.doubleClickListeners.forEach((cb) => cb(e))
  }

  public triggerPaneContextMenu(e: MouseEvent): void {
    this.contextMenuListeners.forEach((cb) => cb(e))
  }

  public triggerSelectionChange(nodes: string[], edges: string[]): void {
    this.selectionListeners.forEach((cb) => cb({ nodes, edges }))
  }

  // Contract Listener Registration
  public onViewportChange(callback: (viewport: ViewportState) => void): () => void {
    this.viewportListeners.add(callback)
    return () => this.viewportListeners.delete(callback)
  }

  public onPaneClick(callback: (event: MouseEvent) => void): () => void {
    this.clickListeners.add(callback)
    return () => this.clickListeners.delete(callback)
  }

  public onPaneDoubleClick(callback: (event: MouseEvent) => void): () => void {
    this.doubleClickListeners.add(callback)
    return () => this.doubleClickListeners.delete(callback)
  }

  public onPaneContextMenu(callback: (event: MouseEvent) => void): () => void {
    this.contextMenuListeners.add(callback)
    return () => this.contextMenuListeners.delete(callback)
  }

  public onSelectionChange(callback: (selection: SelectionState) => void): () => void {
    this.selectionListeners.add(callback)
    return () => this.selectionListeners.delete(callback)
  }
}
