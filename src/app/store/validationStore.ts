import { create } from 'zustand'

export interface ValidationError {
  nodeId: string
  message: string
  severity: 'error' | 'warning' | 'info'
}

export interface ValidationState {
  errors: ValidationError[]
  warnings: ValidationError[]
  setErrors: (errors: ValidationError[]) => void
  setWarnings: (warnings: ValidationError[]) => void
}

export const useValidationStore = create<ValidationState>((set) => ({
  errors: [],
  warnings: [],
  setErrors: (errors) => set({ errors }),
  setWarnings: (warnings) => set({ warnings }),
}))
