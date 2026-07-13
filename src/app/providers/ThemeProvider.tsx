import React, { createContext, ReactNode } from 'react'

export interface ThemeContextType {
  theme: string
}

export const ThemeContext = createContext<ThemeContextType>({ theme: 'light' })

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: 'light' }}>
      {children}
    </ThemeContext.Provider>
  )
}
