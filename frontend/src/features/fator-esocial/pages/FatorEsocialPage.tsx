import { CircleAlert, Play } from 'lucide-react'
import { useState } from 'react'
import { EditarModal } from '../components/EditarModal'
import { FatorEsocialTable } from '../components/FatorEsocialTable'
import { SimulacaoModal } from '../components/SimulacaoModal'
import { useFatorEsocial } from '../hooks/useFatorEsocial'
import { imprimirRelatorio } from '../lib/printRelatorio'
import type { FatorESocialRow } from '../types/fatorEsocial.types'

export function FatorEsocialPage() {
  const {
    search,
    setSearch,
    perPage,
    setPerPage,
    setPage,
    loading,
    error,
    setError,
    rows,
    total,
    totalPages,
    safePage,
    carregar,
    criar,
    atualizar,
    deletar,
  } = useFatorEsocial()

  const [simulando, setSimulando] = useState(false)
  const [editing, setEditing] = useState<FatorESocialRow | null>(null)

  function imprimir(row: FatorESocialRow) {
    imprimirRelatorio(row.id, setError)
  }

  function confirmarDelecao(row: FatorESocialRow) {
    const ok = window.confirm(`Deseja deletar o registro #${row.id}?`)
    if (!ok) return
    void deletar(row.id)
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-white p-5 dark:bg-white/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Simuladores / eSocial
            </div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Fator de ajuste eSocial
            </h1>
            <p className="mt-2 max-w-2xl text-justify text-sm text-slate-600 dark:text-slate-300">
              Liste, gerencie e acompanhe suas simulações de fator de ajuste do
              eSocial. Use a busca e a paginação para encontrar registros
              rapidamente.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <button
              type="button"
              onClick={() => {
                setError(null)
                setSimulando(true)
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
            >
              <Play className="size-4" aria-hidden="true" />
              Simular eSocial
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-100 ring-1 ring-rose-500/20">
            <CircleAlert className="mt-0.5 size-4 text-rose-200" aria-hidden="true" />
            <div>{error}</div>
          </div>
        ) : null}
      </section>

      <FatorEsocialTable
        rows={rows}
        loading={loading}
        perPage={perPage}
        search={search}
        total={total}
        safePage={safePage}
        totalPages={totalPages}
        onPerPageChange={setPerPage}
        onSearchChange={setSearch}
        onBuscar={() => void carregar()}
        onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
        onNextPage={() => setPage((p) => Math.min(totalPages, p + 1))}
        onEdit={(row) => setEditing(row)}
        onPrint={imprimir}
        onDelete={confirmarDelecao}
      />

      {simulando ? (
        <SimulacaoModal
          loading={loading}
          onClose={() => setSimulando(false)}
          onValidationError={setError}
          onCalcular={(payload) => {
            void criar(payload).then((ok) => {
              if (ok) setSimulando(false)
            })
          }}
        />
      ) : null}

      {editing ? (
        <EditarModal
          key={editing.id}
          registro={editing}
          onClose={() => setEditing(null)}
          onSalvar={(id, payload) => {
            void atualizar(id, payload).then((ok) => {
              if (ok) setEditing(null)
            })
          }}
        />
      ) : null}
    </div>
  )
}
