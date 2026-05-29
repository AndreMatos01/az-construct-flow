import { Loader2 } from 'lucide-react'
import type { CalculoObra } from '@/features/calculos-inss/types/calculo.types'
import { calcularInssObra } from '@/features/calculos-inss/utils/inss'
import { brl } from '@/shared/lib/format'

type Props = {
  calculos: CalculoObra[]
  loading?: boolean
}

function inssExibido(c: CalculoObra): number {
  if (c.inssEstimado != null) return c.inssEstimado
  return calcularInssObra({
    valorContrato: c.valorContrato ?? 0,
    valorMateriais: c.valorMateriais ?? undefined,
    percentualBase: c.percentualBase ?? undefined,
    aliquotaInss: c.aliquotaInss ?? undefined,
  }).inss
}

function baseExibida(c: CalculoObra): number {
  if (c.baseInss != null) return c.baseInss
  return calcularInssObra({
    valorContrato: c.valorContrato ?? 0,
    valorMateriais: c.valorMateriais ?? undefined,
    percentualBase: c.percentualBase ?? undefined,
    aliquotaInss: c.aliquotaInss ?? undefined,
  }).baseInss
}

export function CalculosTable({ calculos, loading }: Props) {
  return (
    <section className="col-span-full">
      <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 p-5 dark:border-white/10">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Histórico de cálculos
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Dados carregados do banco via{' '}
              <code className="text-slate-900 dark:text-slate-200">/calculos</code>
              .
            </p>
          </div>
          {loading ? (
            <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Carregando…
            </div>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <tr className="border-b border-slate-200/70 dark:border-white/10">
                <th className="px-5 py-3 font-medium">Obra</th>
                <th className="px-5 py-3 font-medium">Contrato</th>
                <th className="px-5 py-3 font-medium">Mat.</th>
                <th className="px-5 py-3 font-medium">Base</th>
                <th className="px-5 py-3 font-medium">INSS</th>
                <th className="px-5 py-3 font-medium">Criado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
              {calculos.length === 0 ? (
                <tr>
                  <td
                    className="px-5 py-6 text-slate-500 dark:text-slate-400"
                    colSpan={6}
                  >
                    Nenhum cálculo encontrado.
                  </td>
                </tr>
              ) : (
                calculos.map((c, idx) => (
                  <tr
                    key={c.id ?? `${c.nomeObra}-${idx}`}
                    className="hover:bg-slate-900/5 dark:hover:bg-white/3"
                  >
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {c.nomeObra}
                    </td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-200">
                      {brl.format(c.valorContrato ?? 0)}
                    </td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-200">
                      {brl.format(c.valorMateriais ?? 0)}
                    </td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-200">
                      {brl.format(baseExibida(c))}
                    </td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-200">
                      {brl.format(inssExibido(c))}
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                      {c.dataCriacao
                        ? new Date(c.dataCriacao).toLocaleString('pt-BR')
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
