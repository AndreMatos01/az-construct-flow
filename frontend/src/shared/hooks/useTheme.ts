import { useCallback, useEffect, useState } from 'react'

export type Tema = 'dark' | 'light'

const STORAGE_KEY = 'azcf-theme'

function temaInicial(): Tema {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function useTheme() {
  const [tema, setTema] = useState<Tema>(temaInicial)

  useEffect(() => {
    const root = document.documentElement
    if (tema === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem(STORAGE_KEY, tema)
  }, [tema])

  const toggleTema = useCallback(() => {
    setTema((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return {
    tema,
    isDark: tema === 'dark',
    toggleTema,
  }
}
