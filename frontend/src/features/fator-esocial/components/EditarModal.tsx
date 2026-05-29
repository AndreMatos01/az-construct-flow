import { X } from 'lucide-react'
import { useState } from 'react'
import type {
  AtualizarRegistroPayload,
  FatorESocialRow,
} from '../types/fatorEsocial.types'

type Props = {
  registro: FatorESocialRow
  onClose: () => void
  onSalvar: (id: number, payload: AtualizarRegistroPayload) => void
}

export function EditarModal({ registro, onClose, onSalvar }: Props) {
  const [identificador, setIdentificador] = useState(registro.identificador)
  const [nomeVinculo, setNomeVinculo] = useState(registro.nomeVinculo)

  function salvar() {
    const id = identificador.trim()
    const nome = nomeVinculo.trim()
    if (!id || !nome) return

    onSalvar(registro.id, {
      identificador: id,
      nomeVinculo: nome,
      areaInformada: registro.areaInformada,
      rmtInformada: registro.rmtInformada,
      horaMin: registro.horaMin,
      dataInicio: registro.dataInicio,
      dataFim: registro.dataFim,
      status: registro.status,
    })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar edição"
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-xl dark:bg-slate-950 dark:ring-white/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Editar registro #{registro.id}
            </div>
            <div className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Fator de ajuste eSocial
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

        <div className="mt-4 space-y-4">
          <label className="block">
            <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Identificador
            </div>
            <input
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500"
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Nome do vínculo
            </div>
            <input
              value={nomeVinculo}
              onChange={(e) => setNomeVinculo(e.target.value)}
              className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500"
            />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900/5 px-4 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={salvar}
            className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
