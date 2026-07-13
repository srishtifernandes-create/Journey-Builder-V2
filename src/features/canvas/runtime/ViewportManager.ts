import type { IViewportManager } from './contracts/IViewportManager'
import type { ViewportState, ICanvasAdapter, FlowPosition } from './contracts/ICanvasAdapter'

export class ViewportManager implements IViewportManager {
  private adapter: ICanvasAdapter | null = null

  public setAdapter(adapter: ICanvasAdapter) {
    this.adapter = adapter
  }

  public get viewport(): ViewportState {
    if (!this.adapter) {
      return { x: 0, y: 0, zoom: 1 }
    }
    return this.adapter.getViewport()
  }

  public zoomIn(): void {
    this.adapter?.zoomIn()
  }

  public zoomOut(): void {
    this.adapter?.zoomOut()
  }

  public fitView(): void {
    this.adapter?.fitView()
  }

  public resetView(): void {
    this.adapter?.resetView()
  }

  public screenToFlowPosition(screenX: number, screenY: number): FlowPosition {
    if (!this.adapter) return { x: screenX, y: screenY }
    return this.adapter.screenToFlowPosition(screenX, screenY)
  }
}
