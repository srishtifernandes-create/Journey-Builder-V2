import type { ViewportState } from './ICanvasAdapter'

export interface IViewportManager {
  readonly viewport: ViewportState
  zoomIn(): void
  zoomOut(): void
  fitView(): void
  resetView(): void
}
