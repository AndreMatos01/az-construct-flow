import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { AppRouter } from '@/app/router'
import { AppShell } from '@/shared/components/layout/AppShell'
import { useActiveRoute, useSidebar, useTheme } from '@/shared/hooks'
import { calculosKeys } from '@/shared/lib/queryKeys'

function isObrasRoute(pathname: string) {
  return pathname === '/obras' || pathname === '/dashboard'
}

export function App() {
  const { tema, toggleTema } = useTheme()
  const { open: sidebarOpen, openSidebar, closeSidebar } = useSidebar()
  const activeRoute = useActiveRoute()
  const location = useLocation()
  const queryClient = useQueryClient()
  const onObrasRoute = isObrasRoute(location.pathname)
  const calculosFetching = useIsFetching({ queryKey: calculosKeys.all })

  return (
    <AppShell
      subtitle={activeRoute.label}
      tema={tema}
      loading={onObrasRoute && calculosFetching > 0}
      apiError={null}
      sidebarOpen={sidebarOpen}
      onOpenMenu={openSidebar}
      onCloseSidebar={closeSidebar}
      onToggleTema={toggleTema}
      onRefresh={() => {
        if (onObrasRoute) {
          void queryClient.invalidateQueries({ queryKey: calculosKeys.all })
        }
      }}
    >
      <AppRouter />
    </AppShell>
  )
}
