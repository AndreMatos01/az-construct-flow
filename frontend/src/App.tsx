import { AppShell } from './components/layout/AppShell'
import { useActiveRoute, useCalculos, useSidebar, useTheme } from './hooks'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  const { tema, toggleTema } = useTheme()
  const { open: sidebarOpen, openSidebar, closeSidebar } = useSidebar()
  const { calculos, loading, error, refetch } = useCalculos()
  const activeRoute = useActiveRoute()

  return (
    <AppShell
      subtitle={activeRoute.label}
      tema={tema}
      loading={loading}
      apiError={error}
      sidebarOpen={sidebarOpen}
      onOpenMenu={openSidebar}
      onCloseSidebar={closeSidebar}
      onToggleTema={toggleTema}
      onRefresh={() => void refetch()}
    >
      <AppRoutes
        calculos={calculos}
        loading={loading}
        onAfterSave={refetch}
      />
    </AppShell>
  )
}

export default App
