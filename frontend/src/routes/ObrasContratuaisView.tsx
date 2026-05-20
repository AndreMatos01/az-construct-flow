import { CalculosTable } from '../pages/CalculosTable'
import { InssObrasPage } from '../pages/InssObrasPage'
import type { CalculoDto } from '../types/calculos'

type Props = {
  calculos: CalculoDto[]
  loading: boolean
  onAfterSave: () => Promise<void>
}

export function ObrasContratuaisView({ calculos, loading, onAfterSave }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-3 py-4 sm:px-4 md:px-6">
      <InssObrasPage onAfterSave={onAfterSave} />
      <CalculosTable calculos={calculos} loading={loading} />
    </div>
  )
}
