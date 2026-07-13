import React from 'react'
import { Outlet } from 'react-router-dom'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      <main className="w-full h-screen">
        <Outlet />
      </main>
    </div>
  )
}
