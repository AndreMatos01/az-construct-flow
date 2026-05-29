import type { ReactNode } from 'react'
import { ApiErrorBanner } from './ApiErrorBanner'
import { AppFooter } from './AppFooter'
import { AppHeader } from './AppHeader'
import { AppSidebar } from './AppSidebar'

type Props = {
  children: ReactNode
  subtitle: string
  tema: 'dark' | 'light'
  loading: boolean
  apiError: string | null
  sidebarOpen: boolean
  onOpenMenu: () => void
  onCloseSidebar: () => void
  onToggleTema: () => void
  onRefresh: () => void
}

export function AppShell({
  children,
  subtitle,
  tema,
  loading,
  apiError,
  sidebarOpen,
  onOpenMenu,
  onCloseSidebar,
  onToggleTema,
  onRefresh,
}: Props) {
  return (
    <div className="min-h-dvh bg-linear-to-b from-slate-50 via-slate-50 to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      <AppHeader
        subtitle={subtitle}
        tema={tema}
        loading={loading}
        onOpenMenu={onOpenMenu}
        onToggleTema={onToggleTema}
        onRefresh={onRefresh}
      />

      {apiError ? <ApiErrorBanner message={apiError} /> : null}

      <div className="flex w-full">
        <AppSidebar open={sidebarOpen} onClose={onCloseSidebar} />

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="w-full p-0">{children}</main>
        </div>
      </div>

      <AppFooter />
    </div>
  )
}
