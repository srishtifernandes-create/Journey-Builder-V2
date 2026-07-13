import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white p-4">
      <div className="text-center max-w-sm">
        <h2 className="text-4xl font-bold text-neutral-900 mb-2">404</h2>
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">Page Not Found</h3>
        <p className="text-sm text-neutral-500 mb-6">
          The requested workspace page could not be found.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded font-medium text-sm transition-colors"
        >
          Return to Workspace
        </Link>
      </div>
    </div>
  )
}
