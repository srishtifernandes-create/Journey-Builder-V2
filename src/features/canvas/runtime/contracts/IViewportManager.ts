import type { ViewportState, FlowPosition } from './ICanvasAdapter'

export interface IViewportManager {
  readonly viewport: ViewportState
  zoomIn(): void
  zoomOut(): void
  fitView(): void
  resetView(): void
  screenToFlowPosition(screenX: number, screenY: number): FlowPosition
}
