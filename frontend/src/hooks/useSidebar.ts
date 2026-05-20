import { useCallback, useEffect, useState } from 'react'

export function useSidebar() {
  const [open, setOpen] = useState(false)

  const openSidebar = useCallback(() => setOpen(true), [])
  const closeSidebar = useCallback(() => setOpen(false), [])
  const toggleSidebar = useCallback(() => setOpen((v) => !v), [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeSidebar()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeSidebar])

  return {
    open,
    openSidebar,
    closeSidebar,
    toggleSidebar,
  }
}
