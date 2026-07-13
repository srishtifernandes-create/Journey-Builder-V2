import React, { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
