import { Navigate, Route, Routes } from 'react-router-dom'
import { FatorESocialPage } from '../pages/FatorESocialPage'
import type { CalculoDto } from '../types/calculos'
import { DEFAULT_ROUTE_PATH } from './config'
import { ObrasContratuaisView } from './ObrasContratuaisView'

type Props = {
  calculos: CalculoDto[]
  loading: boolean
  onAfterSave: () => Promise<void>
}

export function AppRoutes({ calculos, loading, onAfterSave }: Props) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={DEFAULT_ROUTE_PATH} replace />} />
      <Route
        path="/dashboard"
        element={
          <ObrasContratuaisView
            calculos={calculos}
            loading={loading}
            onAfterSave={onAfterSave}
          />
        }
      />
      <Route
        path="/obras"
        element={
          <ObrasContratuaisView
            calculos={calculos}
            loading={loading}
            onAfterSave={onAfterSave}
          />
        }
      />
      <Route
        path="/esocial"
        element={
          <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 md:px-6">
            <FatorESocialPage />
          </div>
        }
      />
      <Route path="*" element={<Navigate to={DEFAULT_ROUTE_PATH} replace />} />
    </Routes>
  )
}
