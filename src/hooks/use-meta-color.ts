"use client"

import * as React from "react"

export function useMetaColor() {
  const setMetaColor = React.useCallback((color: string) => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute("content", color)
    }
  }, [])

  return { setMetaColor }
}
