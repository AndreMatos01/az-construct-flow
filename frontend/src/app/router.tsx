import { Loader2 } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { DEFAULT_ROUTE_PATH } from '@/config/routes'

const ObrasContratuaisPage = lazy(() =>
  import('@/features/calculos-inss').then((m) => ({
    default: m.ObrasContratuaisPage,
  })),
)

const FatorEsocialPage = lazy(() =>
  import('@/features/fator-esocial').then((m) => ({
    default: m.FatorEsocialPage,
  })),
)

const CalculoSeroPage = lazy(() =>
  import('@/features/calculo-sero').then((m) => ({
    default: m.CalculoSeroPage,
  })),
)

function RouteFallback() {
  return (
    <div
      className="grid place-items-center py-20 text-slate-500 dark:text-slate-400"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-6 animate-spin" aria-hidden="true" />
      <span className="sr-only">Carregando…</span>
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to={DEFAULT_ROUTE_PATH} replace />} />
        <Route path="/dashboard" element={<ObrasContratuaisPage />} />
        <Route path="/obras" element={<ObrasContratuaisPage />} />
        <Route
          path="/esocial"
          element={
            <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 md:px-6">
              <FatorEsocialPage />
            </div>
          }
        />
        <Route path="/sero" element={<CalculoSeroPage />} />
        <Route path="*" element={<Navigate to={DEFAULT_ROUTE_PATH} replace />} />
      </Routes>
    </Suspense>
  )
}
