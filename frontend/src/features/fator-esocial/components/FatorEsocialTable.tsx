import { Loader2, Pencil, Printer, Search, Trash2 } from 'lucide-react'
import { brl } from '@/shared/lib/format'
import type { FatorESocialRow } from '../types/fatorEsocial.types'
import { chipStatusClasses, statusLabel } from '../utils/status'

type Props = {
  rows: FatorESocialRow[]
  loading: boolean
  perPage: number
  search: string
  total: number
  safePage: number
  totalPages: number
  onPerPageChange: (value: number) => void
  onSearchChange: (value: string) => void
  onBuscar: () => void
  onPrevPage: () => void
  onNextPage: () => void
  onEdit: (row: FatorESocialRow) => void
  onPrint: (row: FatorESocialRow) => void
  onDelete: (row: FatorESocialRow) => void
}

export function FatorEsocialTable({
  rows,
  loading,
  perPage,
  search,
  total,
  safePage,
  totalPages,
  onPerPageChange,
  onSearchChange,
  onBuscar,
  onPrevPage,
  onNextPage,
  onEdit,
  onPrint,
  onDelete,
}: Props) {
  return (
    <section className="rounded-2xl bg-white dark:bg-white/5">
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
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

        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Pesquisar…"
              className="w-full rounded-xl bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500"
            />
          </div>

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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <tr className="bg-slate-50/70 dark:bg-slate-950/40">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Identificador</th>
              <th className="px-4 py-3 font-medium">Nome do vínculo</th>
              <th className="px-4 py-3 font-medium">Área informada</th>
              <th className="px-4 py-3 font-medium">RMT informada</th>
              <th className="px-4 py-3 font-medium">Hora/min</th>
              <th className="px-4 py-3 font-medium">Data de início</th>
              <th className="px-4 py-3 font-medium">Data de fim</th>
              <th className="px-4 py-3 font-medium">Calculado em</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-slate-500 dark:text-slate-400" colSpan={11}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/5 dark:hover:bg-white/3">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{r.id}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{r.identificador}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{r.nomeVinculo}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{r.areaInformada.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{brl.format(r.rmtInformada)}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{r.horaMin}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.dataInicio}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.dataFim}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{new Date(r.calculadoEm).toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${chipStatusClasses(r.status)}`}>
                      {statusLabel(r.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(r)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/5 px-3 py-2 text-xs font-semibold text-slate-900 ring-1 ring-slate-200/70 transition hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
                        title="Editar"
                        aria-label={`Editar registro ${r.id}`}
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                        Editar
                      </button>
                      <div className="flex items-center gap-2">
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
