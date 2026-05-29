import { Navigate, Route, Routes } from 'react-router-dom'
import { ObrasContratuaisPage } from '@/features/calculos-inss/pages/ObrasContratuaisPage'
import { FatorEsocialPage } from '@/features/fator-esocial/pages/FatorEsocialPage'
import { DEFAULT_ROUTE_PATH } from '@/config/routes'

export function AppRouter() {
  return (
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
      <Route path="*" element={<Navigate to={DEFAULT_ROUTE_PATH} replace />} />
    </Routes>
  )
}
