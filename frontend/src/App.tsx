import { useState } from 'react'
import {
  AppShell,
  type AppMenuId,
} from './components/layout/AppShell'
import { MENU_SUBTITLES } from './components/layout/AppSidebar'
import { useCalculos, useSidebar, useTheme } from './hooks'
import { CalculosTable } from './pages/CalculosTable'
import { FatorESocialPage } from './pages/FatorESocialPage'
import { InssObrasPage } from './pages/InssObrasPage'

function App() {
  const { tema, toggleTema } = useTheme()
  const { open: sidebarOpen, openSidebar, closeSidebar } = useSidebar()
  const { calculos, loading, error, refetch } = useCalculos()
  const [activeMenu, setActiveMenu] = useState<AppMenuId>('inss-obras')

  return (
    <AppShell
      activeMenu={activeMenu}
      subtitle={MENU_SUBTITLES[activeMenu]}
      tema={tema}
      loading={loading}
      apiError={error}
      sidebarOpen={sidebarOpen}
      onOpenMenu={openSidebar}
      onCloseSidebar={closeSidebar}
      onNavigate={setActiveMenu}
      onToggleTema={toggleTema}
      onRefresh={() => void refetch()}
    >
      {activeMenu === 'fator-esocial' ? (
        <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 md:px-6">
          <FatorESocialPage />
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-3 py-4 sm:px-4 md:px-6">
          <InssObrasPage onAfterSave={refetch} />
          <CalculosTable calculos={calculos} loading={loading} />
        </div>
      )}
    </AppShell>
  )
}

export default App
