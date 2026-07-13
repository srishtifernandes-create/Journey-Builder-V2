import type { IInteractionManager, InteractionMode } from './contracts/IInteractionManager'

export class InteractionManager implements IInteractionManager {
  private mode: InteractionMode = 'select'
  private onModeChangeCallback?: (mode: InteractionMode) => void

  public get currentMode(): InteractionMode {
    return this.mode
  }

  public setMode(mode: InteractionMode): void {
    this.mode = mode
    if (this.onModeChangeCallback) {
      this.onModeChangeCallback(mode)
    }
  }

  public onModeChange(callback: (mode: InteractionMode) => void) {
    this.onModeChangeCallback = callback
  }
}
