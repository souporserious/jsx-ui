import * as React from 'react'

export function Stack({ alignment, children }) {
  return (
    <div
      style={{
        alignItems: alignment,
      }}
    >
      {children}
    </div>
  )
}
