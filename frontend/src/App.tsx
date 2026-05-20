import axios from 'axios'
import { useEffect, useState } from 'react'
import { api } from './api/client'
import {
  AppShell,
  type AppMenuId,
} from './components/layout/AppShell'
import { MENU_SUBTITLES } from './components/layout/AppSidebar'
import { CalculosTable } from './pages/CalculosTable'
import { FatorESocialPage } from './pages/FatorESocialPage'
import { InssObrasPage } from './pages/InssObrasPage'
import type { CalculoDto } from './types/calculos'

function mensagemErroApi(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const st = e.response?.status
    if (st === 404) {
      return 'A API respondeu 404. Em produção na Vercel, defina a variável VITE_API_BASE_URL com a URL pública do backend (ex.: https://seu-app.onrender.com), sem barra no final, e faça um novo deploy.'
    }
    if (st != null) {
      return `A API respondeu HTTP ${st}. Confira se o backend está no ar e se o CORS no Quarkus inclui este domínio.`
    }
    if (e.code === 'ERR_NETWORK') {
      return 'Não foi possível alcançar a API (rede/CORS). Defina VITE_API_BASE_URL na Vercel apontando para o Render e inclua este site em CORS_ORIGINS no backend.'
    }
    return e.message || 'Erro ao falar com a API.'
  }
  return 'Erro ao falar com a API.'
}

function App() {
  const [loadingLista, setLoadingLista] = useState(false)
  const [calculos, setCalculos] = useState<CalculoDto[]>([])
  const [listaErro, setListaErro] = useState<string | null>(null)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<AppMenuId>('inss-obras')

  const [tema, setTema] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('azcf-theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  async function carregarCalculos() {
    setLoadingLista(true)
    setListaErro(null)
    try {
      const { data } = await api.get<CalculoDto[]>('/calculos')
      setCalculos(Array.isArray(data) ? data : [])
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Erro ao carregar /calculos', e)
      setListaErro(mensagemErroApi(e))
      setCalculos([])
    } finally {
      setLoadingLista(false)
    }
  }

  useEffect(() => {
    void carregarCalculos()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (tema === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('azcf-theme', tema)
  }, [tema])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <AppShell
      activeMenu={activeMenu}
      subtitle={MENU_SUBTITLES[activeMenu]}
      tema={tema}
      loading={loadingLista}
      apiError={listaErro}
      sidebarOpen={sidebarOpen}
      onOpenMenu={() => setSidebarOpen(true)}
      onCloseSidebar={() => setSidebarOpen(false)}
      onNavigate={setActiveMenu}
      onToggleTema={() => setTema((t) => (t === 'dark' ? 'light' : 'dark'))}
      onRefresh={() => void carregarCalculos()}
    >
      {activeMenu === 'fator-esocial' ? (
        <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 md:px-6">
          <FatorESocialPage />
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-3 py-4 sm:px-4 md:px-6">
          <InssObrasPage onAfterSave={carregarCalculos} />
          <CalculosTable calculos={calculos} loading={loadingLista} />
        </div>
      )}
    </AppShell>
  )
}

export default App
