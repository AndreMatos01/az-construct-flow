import { X } from 'lucide-react'
import type { CalculoSeroPayload } from '../types/calculoSero.types'
import { CalculoSeroForm } from './CalculoSeroForm'

type Props = {
  loading: boolean
  onClose: () => void
  onValidationError: (msg: string) => void
  onCalcular: (payload: CalculoSeroPayload) => void
}

export function SimulacaoModal({
  loading,
  onClose,
  onValidationError,
  onCalcular,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar simulação"
      />
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200/70 dark:bg-slate-950 dark:ring-white/10">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 p-4 dark:border-white/10">
          <div className="min-w-0">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Simuladores / SERO
            </div>
            <div className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Simulação — Valor SERO (INSS)
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900/5 p-2 text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
            aria-label="Fechar"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <CalculoSeroForm
          loading={loading}
          submitLabel="Calcular"
          onCancel={onClose}
          onValidationError={onValidationError}
          onSubmit={onCalcular}
        />
      </div>
    </div>
  )
}
