import {
  Calculator,
  CircleAlert,
  FileSliders,
  LayoutDashboard,
  Menu,
  Loader2,
  Moon,
  Scale,
  RefreshCw,
  Sun,
  ChevronDown,
} from 'lucide-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { api } from './api/client'
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
  const [simuladoresOpen, setSimuladoresOpen] = useState(true)
  const [activeMenu, setActiveMenu] = useState<
    'dash' | 'fator-esocial' | 'inss-obras'
  >('inss-obras')

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
    <div className="min-h-dvh bg-linear-to-b from-slate-50 via-slate-50 to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      {/* Header global */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900/5 p-2 text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-900/10 md:hidden dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu lateral"
              title="Menu"
            >
              <Menu className="size-4" aria-hidden="true" />
            </button>

            <div className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-sky-500/20 to-indigo-500/20 ring-1 ring-slate-200/70 dark:ring-white/10">
              <Calculator
                className="size-4 text-sky-700 dark:text-sky-200"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-tight">
                AZ ConstructFlow - Simulador de INSS
              </div>
              <div className="truncate text-xs text-slate-600 dark:text-slate-300">
                {activeMenu === 'fator-esocial'
                  ? 'Fator de Ajuste eSocial'
                  : activeMenu === 'dash'
                    ? 'Dashboard'
                    : 'INSS de obras'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTema((t) => (t === 'dark' ? 'light' : 'dark'))}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/5 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200/70 transition hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
              aria-label="Alternar tema claro/escuro"
              title="Alternar tema"
            >
              {tema === 'dark' ? (
                <>
                  <Sun className="size-4" aria-hidden="true" />
                  Claro
                </>
              ) : (
                <>
                  <Moon className="size-4" aria-hidden="true" />
                  Escuro
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => void carregarCalculos()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/5 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200/70 transition hover:bg-slate-900/10 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
              disabled={loadingLista}
              aria-label="Atualizar dados"
              title="Atualizar"
            >
              {loadingLista ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="size-4" aria-hidden="true" />
              )}
              Atualizar
            </button>
          </div>
        </div>
      </header>

      {listaErro ? (
        <div
          role="alert"
          className="border-b border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950 md:px-6 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100"
        >
          <div className="mx-auto flex max-w-6xl gap-3">
            <CircleAlert
              className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-300"
              aria-hidden="true"
            />
            <div className="min-w-0 space-y-1">
              <p className="font-semibold">Não foi possível carregar os dados</p>
              <p className="text-amber-900/90 dark:text-amber-50/90">{listaErro}</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Overlay mobile */}
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fechar menu lateral"
        />
      ) : null}

      <div className="flex w-full">
        {/* Sidebar */}
        <aside
          className={[
            // Mobile: fixa abaixo do header global. Desktop: sidebar normal.
            'fixed left-0 top-14 z-50 h-[calc(100dvh-56px)] w-72 border-r border-slate-200/70 bg-white/80 backdrop-blur sm:w-80 md:static md:top-0 md:z-auto md:h-dvh md:w-80 md:translate-x-0 dark:border-white/10 dark:bg-slate-950/70',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            'transition-transform duration-200',
          ].join(' ')}
          aria-label="Menu lateral"
        >
        
          <nav className="px-3 py-3">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setActiveMenu('dash')
                  setSidebarOpen(false)
                }}
                className={[
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                  activeMenu === 'dash'
                    ? 'bg-sky-600/10 text-sky-900 ring-1 ring-sky-600/15 dark:bg-sky-400/10 dark:text-sky-100 dark:ring-sky-300/20'
                    : 'text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/5',
                ].join(' ')}
              >
                <LayoutDashboard className="size-4" aria-hidden="true" />
                Dash
              </button>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setSimuladoresOpen((s) => !s)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-900/5 dark:text-slate-100 dark:hover:bg-white/5"
                aria-expanded={simuladoresOpen}
              >
                <span className="inline-flex items-center gap-3">
                  <Scale className="size-4 text-slate-600 dark:text-slate-300" aria-hidden="true" />
                  Simuladores
                </span>
                <ChevronDown
                  className={[
                    'size-4 text-slate-500 transition-transform dark:text-slate-400',
                    simuladoresOpen ? 'rotate-180' : 'rotate-0',
                  ].join(' ')}
                  aria-hidden="true"
                />
              </button>

              {simuladoresOpen ? (
                <div className="mt-1 space-y-1 pl-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu('inss-obras')
                      setSidebarOpen(false)
                    }}
                    className={[
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                      activeMenu === 'inss-obras'
                        ? 'bg-slate-900/5 text-slate-900 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10'
                        : 'text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/5',
                    ].join(' ')}
                  >
                    <Calculator className="size-4" aria-hidden="true" />
                    Obras contratuais
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu('fator-esocial')
                      setSidebarOpen(false)
                    }}
                    className={[
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                      activeMenu === 'fator-esocial'
                        ? 'bg-sky-600/10 text-sky-900 ring-1 ring-sky-600/15 dark:bg-sky-400/10 dark:text-sky-100 dark:ring-sky-300/20'
                        : 'text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/5',
                    ].join(' ')}
                  >
                    <FileSliders className="size-4" aria-hidden="true" />
                    Fator de Ajuste eSocial
                  </button>
                </div>
              ) : null}
            </div>
          </nav>

          <div className="mt-auto p-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} AZ ConstructFlow
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="w-full p-0">
            {activeMenu === 'fator-esocial' ? (
              <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 md:px-6">
                <FatorESocialPage />
              </div>
            ) : (
              <div className="mx-auto grid w-full max-w-6xl gap-6 px-3 py-4 sm:px-4 md:grid-cols-5 md:px-6">
                <InssObrasPage onAfterSave={carregarCalculos} />
                <CalculosTable calculos={calculos} loading={loadingLista} />
              </div>
            )}
          </main>

        </div>
      </div>

      {/* Footer global */}
      <footer className="sticky bottom-0 z-50 w-full border-t border-slate-200/70 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
        <div className="flex flex-col gap-2 px-4 py-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between md:px-6 dark:text-slate-300">
          <div className="text-justify">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              Contato
            </span>
            : (11) 99999-9999 · contato@azconstructflow.com
          </div>
          <div>
            © {new Date().getFullYear()} AZ ConstructFlow. Todos os direitos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
