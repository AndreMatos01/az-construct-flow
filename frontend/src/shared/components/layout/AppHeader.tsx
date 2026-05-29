import { Calculator, Loader2, Menu, Moon, RefreshCw, Sun } from 'lucide-react'

type Props = {
  subtitle: string
  tema: 'dark' | 'light'
  loading: boolean
  onOpenMenu: () => void
  onToggleTema: () => void
  onRefresh: () => void
}

export function AppHeader({
  subtitle,
  tema,
  loading,
  onOpenMenu,
  onToggleTema,
  onRefresh,
}: Props) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900/5 p-2 text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-900/10 md:hidden dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
            onClick={onOpenMenu}
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
              {subtitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTema}
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
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/5 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200/70 transition hover:bg-slate-900/10 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
            disabled={loading}
            aria-label="Atualizar dados"
            title="Atualizar"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="size-4" aria-hidden="true" />
            )}
            Atualizar
          </button>
        </div>
      </div>
    </header>
  )
}
