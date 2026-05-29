import { ApiErrorBanner } from '@/shared/components/layout/ApiErrorBanner'
import { CalculosTable } from '../components/CalculosTable'
import { InssObrasForm } from '../components/InssObrasForm'
import { useCalculos } from '../hooks/useCalculos'

export function ObrasContratuaisPage() {
  const { calculos, loading, error } = useCalculos()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-3 py-4 sm:px-4 md:px-6">
      {error ? <ApiErrorBanner message={error} /> : null}
      <InssObrasForm />
      <CalculosTable calculos={calculos} loading={loading} />
    </div>
  )
}
