import {
  Calculator,
  ChevronDown,
  FileSliders,
  LayoutDashboard,
  Scale,
} from 'lucide-react'
import { useState } from 'react'

export type AppMenuId = 'dash' | 'fator-esocial' | 'inss-obras'

type Props = {
  activeMenu: AppMenuId
  open: boolean
  onNavigate: (menu: AppMenuId) => void
  onClose: () => void
}

function navButtonClass(active: boolean, variant: 'sky' | 'neutral' = 'sky') {
  if (active) {
    return variant === 'sky'
      ? 'bg-sky-600/10 text-sky-900 ring-1 ring-sky-600/15 dark:bg-sky-400/10 dark:text-sky-100 dark:ring-sky-300/20'
      : 'bg-slate-900/5 text-slate-900 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10'
  }
  return 'text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/5'
}

export function AppSidebar({ activeMenu, open, onNavigate, onClose }: Props) {
  const [simuladoresOpen, setSimuladoresOpen] = useState(true)

  function navigate(menu: AppMenuId) {
    onNavigate(menu)
    onClose()
  }

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-label="Fechar menu lateral"
        />
      ) : null}

      <aside
        className={[
          'fixed left-0 top-14 z-50 flex h-[calc(100dvh-56px)] w-72 flex-col border-r border-slate-200/70 bg-white/80 backdrop-blur sm:w-80 md:static md:top-0 md:z-auto md:h-dvh md:w-80 md:translate-x-0 dark:border-white/10 dark:bg-slate-950/70',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          'transition-transform duration-200',
        ].join(' ')}
        aria-label="Menu lateral"
      >
        <nav className="px-3 py-3">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => navigate('dash')}
              className={[
                'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                navButtonClass(activeMenu === 'dash'),
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
                <Scale
                  className="size-4 text-slate-600 dark:text-slate-300"
                  aria-hidden="true"
                />
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
                  onClick={() => navigate('inss-obras')}
                  className={[
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                    navButtonClass(activeMenu === 'inss-obras', 'neutral'),
                  ].join(' ')}
                >
                  <Calculator className="size-4" aria-hidden="true" />
                  Obras contratuais
                </button>

                <button
                  type="button"
                  onClick={() => navigate('fator-esocial')}
                  className={[
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                    navButtonClass(activeMenu === 'fator-esocial'),
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
    </>
  )
}

export const MENU_SUBTITLES: Record<AppMenuId, string> = {
  dash: 'Dashboard',
  'inss-obras': 'Obras contratuais',
  'fator-esocial': 'Fator de Ajuste eSocial',
}
