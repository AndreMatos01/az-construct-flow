import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AppRouter } from '@/app/router'
import { AppShell } from '@/shared/components/layout/AppShell'
import { useActiveRoute, useSidebar, useTheme } from '@/shared/hooks'
import { requestRefreshCalculos } from '@/shared/lib/refreshCalculos'

function isObrasRoute(pathname: string) {
  return pathname === '/obras' || pathname === '/dashboard'
}

export function App() {
  const { tema, toggleTema } = useTheme()
  const { open: sidebarOpen, openSidebar, closeSidebar } = useSidebar()
  const activeRoute = useActiveRoute()
  const location = useLocation()
  const onObrasRoute = isObrasRoute(location.pathname)
  const [calculosLoading, setCalculosLoading] = useState(false)

  useEffect(() => {
    function onLoading(event: Event) {
      setCalculosLoading(Boolean((event as CustomEvent<boolean>).detail))
    }
    window.addEventListener('azcf:calculos-loading', onLoading)
    return () => window.removeEventListener('azcf:calculos-loading', onLoading)
  }, [])

  return (
    <AppShell
      subtitle={activeRoute.label}
      tema={tema}
      loading={onObrasRoute && calculosLoading}
      apiError={null}
      sidebarOpen={sidebarOpen}
      onOpenMenu={openSidebar}
      onCloseSidebar={closeSidebar}
      onToggleTema={toggleTema}
      onRefresh={() => {
        if (onObrasRoute) requestRefreshCalculos()
      }}
    >
      <AppRouter />
    </AppShell>
  )
}

export default App
