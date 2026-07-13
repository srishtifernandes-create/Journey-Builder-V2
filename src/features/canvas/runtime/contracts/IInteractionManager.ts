export type InteractionMode = 'select' | 'pan' | 'connect' | 'disabled'

export interface IInteractionManager {
  readonly currentMode: InteractionMode
  setMode(mode: InteractionMode): void
}
