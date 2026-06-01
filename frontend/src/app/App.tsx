import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { AppRouter } from '@/app/router'
import { AppShell } from '@/shared/components/layout/AppShell'
import { useActiveRoute, useSidebar, useTheme } from '@/shared/hooks'

export function App() {
  const { tema, toggleTema } = useTheme()
  const { open: sidebarOpen, openSidebar, closeSidebar } = useSidebar()
  const activeRoute = useActiveRoute()
  const queryClient = useQueryClient()
  const isFetching = useIsFetching()

  return (
    <AppShell
      subtitle={activeRoute.label}
      tema={tema}
      loading={isFetching > 0}
      apiError={null}
      sidebarOpen={sidebarOpen}
      onOpenMenu={openSidebar}
      onCloseSidebar={closeSidebar}
      onToggleTema={toggleTema}
      onRefresh={() => {
        void queryClient.invalidateQueries()
      }}
    >
      <AppRouter />
    </AppShell>
  )
}
