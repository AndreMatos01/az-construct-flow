import { Loader2, Pencil, Play, Printer, Trash2 } from 'lucide-react'
import { brl } from '@/shared/lib/format'
import type {
  CalculoSeroFiltros,
  CalculoSeroRow,
} from '../types/calculoSero.types'
import { estadoLabel, tipoPessoaLabel } from '../utils/labels'

const filtroInputClass =
  'w-full rounded-xl bg-white px-3 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500'

type Props = {
  rows: CalculoSeroRow[]
  loading: boolean
  filtros: CalculoSeroFiltros
  perPage: number
  total: number
  safePage: number
  totalPages: number
  onFiltroChange: (campo: keyof CalculoSeroFiltros, valor: string) => void
  onPerPageChange: (value: number) => void
  onBuscar: () => void
  onSimular: () => void
  onPrevPage: () => void
  onNextPage: () => void
  onEdit: (row: CalculoSeroRow) => void
  onPrint: (row: CalculoSeroRow) => void
  onDelete: (row: CalculoSeroRow) => void
}

export function CalculoSeroTable({
  rows,
  loading,
  filtros,
  perPage,
  total,
  safePage,
  totalPages,
  onFiltroChange,
  onPerPageChange,
  onBuscar,
  onSimular,
  onPrevPage,
  onNextPage,
  onEdit,
  onPrint,
  onDelete,
}: Props) {
  return (
    <section className="rounded-2xl bg-white dark:bg-white/5">
      <div className="border-b border-slate-200/70 p-4 dark:border-white/10">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
              Nome da obra
            </span>
            <input
              className={filtroInputClass}
              value={filtros.nomeObra}
              onChange={(e) => onFiltroChange('nomeObra', e.target.value)}
              placeholder="Filtrar por obra"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
              Nome do cliente
            </span>
            <input
              className={filtroInputClass}
              value={filtros.nomeCliente}
              onChange={(e) => onFiltroChange('nomeCliente', e.target.value)}
              placeholder="Filtrar por cliente"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
              CPF
            </span>
            <input
              className={filtroInputClass}
              value={filtros.cpf}
              onChange={(e) => onFiltroChange('cpf', e.target.value)}
              placeholder="Filtrar por CPF"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
              Telefone
            </span>
            <input
              className={filtroInputClass}
              value={filtros.telefone}
              onChange={(e) => onFiltroChange('telefone', e.target.value)}
              placeholder="Filtrar por telefone"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onSimular}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
          >
            <Play className="size-4" aria-hidden="true" />
            Simular
          </button>

          <button
            type="button"
            onClick={onBuscar}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/5 px-4 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200/70 transition hover:bg-slate-900/10 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Buscar registros
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 p-4 text-sm text-slate-700 dark:text-slate-200">
        <span className="text-slate-500 dark:text-slate-400">Exibir</span>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="rounded-xl bg-white px-2 py-1.5 text-sm ring-1 ring-slate-200/70 outline-none focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:ring-white/10"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span className="text-slate-500 dark:text-slate-400">
          resultados por página
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <tr className="bg-slate-50/70 dark:bg-slate-950/40">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Obra</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">CPF</th>
              <th className="px-4 py-3 font-medium">Telefone</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Tipo pessoa</th>
              <th className="px-4 py-3 font-medium">INSS a pagar</th>
              <th className="px-4 py-3 font-medium">Calculado em</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-8 text-slate-500 dark:text-slate-400"
                  colSpan={10}
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-slate-200/60 hover:bg-slate-900/5 dark:border-white/5 dark:hover:bg-white/3"
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {r.id}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                    {r.nomeObra}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                    {r.nomeCliente}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                    {r.cpf}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                    {r.telefone}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {estadoLabel(r.estado)}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {tipoPessoaLabel(r.tipoPessoa)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-700 dark:text-emerald-300">
                    {brl.format(r.valorInss)}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {new Date(r.calculadoEm).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(r)}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900/5 p-2 text-slate-900 ring-1 ring-slate-200/70 transition hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
                        title="Visualizar / Editar"
                        aria-label={`Editar registro ${r.id}`}
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onPrint(r)}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900/5 p-2 text-slate-900 ring-1 ring-slate-200/70 transition hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
                        title="Imprimir"
                        aria-label={`Imprimir registro ${r.id}`}
                      >
                        <Printer className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(r)}
                        className="inline-flex items-center justify-center rounded-xl bg-rose-600/10 p-2 text-rose-700 ring-1 ring-rose-600/20 transition hover:bg-rose-600/15 dark:bg-rose-400/10 dark:text-rose-100 dark:ring-rose-300/20"
                        title="Deletar"
                        aria-label={`Deletar registro ${r.id}`}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 p-4 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
        <div>
          Página <span className="font-semibold">{safePage}</span> de{' '}
          <span className="font-semibold">{totalPages}</span> ·{' '}
          <span className="font-semibold">{total}</span> registros
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-xl bg-slate-900/5 px-3 py-2 font-semibold text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-900/10 disabled:opacity-60 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
            disabled={safePage <= 1}
            onClick={onPrevPage}
          >
            Anterior
          </button>
          <button
            type="button"
            className="rounded-xl bg-slate-900/5 px-3 py-2 font-semibold text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-900/10 disabled:opacity-60 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
            disabled={safePage >= totalPages}
            onClick={onNextPage}
          >
            Próxima
          </button>
        </div>
      </div>
    </section>
  )
}
