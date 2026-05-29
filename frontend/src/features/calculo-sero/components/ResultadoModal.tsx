import { CheckCircle2, X } from 'lucide-react'
import { brl } from '@/shared/lib/format'

type Props = {
  valor: number
  onClose: () => void
}

export function ResultadoModal({ valor, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar resultado"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="resultado-sero-titulo"
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl ring-1 ring-slate-200/70 dark:bg-slate-950 dark:ring-white/10"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex items-center justify-center rounded-xl bg-slate-900/5 p-2 text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
          aria-label="Fechar"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </div>

        <h2
          id="resultado-sero-titulo"
          className="mt-4 text-base font-medium text-slate-700 dark:text-slate-200"
        >
          O valor do INSS calculado a ser pago é de{' '}
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">
            {brl.format(valor)}
          </span>
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
