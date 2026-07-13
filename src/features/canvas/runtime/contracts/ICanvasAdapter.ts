export interface ViewportState {
  readonly x: number
  readonly y: number
  readonly zoom: number
}

export interface SelectionState {
  readonly nodes: string[]
  readonly edges: string[]
}

export interface ICanvasAdapter {
  zoomIn(): void
  zoomOut(): void
  fitView(): void
  resetView(): void
  getViewport(): ViewportState
  setViewport(x: number, y: number, zoom: number): void
  
  onViewportChange(callback: (viewport: ViewportState) => void): () => void
  onPaneClick(callback: (event: MouseEvent) => void): () => void
  onPaneDoubleClick(callback: (event: MouseEvent) => void): () => void
  onPaneContextMenu(callback: (event: MouseEvent) => void): () => void
  onSelectionChange(callback: (selection: SelectionState) => void): () => void
}
