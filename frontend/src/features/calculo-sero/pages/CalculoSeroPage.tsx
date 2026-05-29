import { CircleAlert } from 'lucide-react'
import { useState } from 'react'
import { CalculoSeroTable } from '../components/CalculoSeroTable'
import { EditarModal } from '../components/EditarModal'
import { ResultadoModal } from '../components/ResultadoModal'
import { SimulacaoModal } from '../components/SimulacaoModal'
import { useCalculoSero } from '../hooks/useCalculoSero'
import { imprimirCalculoSero } from '../lib/printCalculoSero'
import type { CalculoSeroRow } from '../types/calculoSero.types'

export function CalculoSeroPage() {
  const {
    filtros,
    setFiltro,
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
    buscar,
    simular,
    atualizar,
    deletar,
    simulando,
  } = useCalculoSero()

  const [abrirSimulacao, setAbrirSimulacao] = useState(false)
  const [editando, setEditando] = useState<CalculoSeroRow | null>(null)
  const [valorResultado, setValorResultado] = useState<number | null>(null)

  function confirmarDelecao(row: CalculoSeroRow) {
    const ok = window.confirm(`Deseja deletar o registro #${row.id}?`)
    if (!ok) return
    void deletar(row.id)
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-3 py-4 sm:px-4 md:px-6">
      <section className="rounded-2xl bg-white p-5 dark:bg-white/5">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Simuladores / SERO
        </div>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Valor SERO
        </h1>
        <p className="mt-2 max-w-2xl text-justify text-sm text-slate-600 dark:text-slate-300">
          Liste e gerencie os cálculos do valor do INSS (SERO). Use os filtros
          para localizar registros e clique em “Simular” para realizar um novo
          cálculo.
        </p>

        {error ? (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-600 ring-1 ring-rose-500/20 dark:text-rose-200">
            <CircleAlert className="mt-0.5 size-4" aria-hidden="true" />
            <div>{error}</div>
          </div>
        ) : null}
      </section>

      <CalculoSeroTable
        rows={rows}
        loading={loading}
        filtros={filtros}
        perPage={perPage}
        total={total}
        safePage={safePage}
        totalPages={totalPages}
        onFiltroChange={setFiltro}
        onPerPageChange={setPerPage}
        onBuscar={buscar}
        onSimular={() => {
          setError(null)
          setAbrirSimulacao(true)
        }}
        onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
        onNextPage={() => setPage((p) => Math.min(totalPages, p + 1))}
        onEdit={(row) => setEditando(row)}
        onPrint={imprimirCalculoSero}
        onDelete={confirmarDelecao}
      />

      {abrirSimulacao ? (
        <SimulacaoModal
          loading={simulando}
          onClose={() => setAbrirSimulacao(false)}
          onValidationError={setError}
          onCalcular={(payload) => {
            void simular(payload).then((row) => {
              if (row) {
                setAbrirSimulacao(false)
                setValorResultado(row.valorInss)
              }
            })
          }}
        />
      ) : null}

      {editando ? (
        <EditarModal
          key={editando.id}
          registro={editando}
          loading={loading}
          onClose={() => setEditando(null)}
          onValidationError={setError}
          onSalvar={(id, payload) => {
            void atualizar(id, payload).then((ok) => {
              if (ok) setEditando(null)
            })
          }}
        />
      ) : null}

      {valorResultado != null ? (
        <ResultadoModal
          valor={valorResultado}
          onClose={() => setValorResultado(null)}
        />
      ) : null}
    </div>
  )
}
