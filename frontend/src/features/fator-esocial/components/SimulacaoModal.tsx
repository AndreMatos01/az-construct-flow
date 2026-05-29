import { X } from 'lucide-react'
import { useState } from 'react'
import { parsePtBrNumber } from '@/shared/lib/format'
import type { CriarSimulacaoPayload } from '../types/fatorEsocial.types'

type TipoHonorarios = 'Hora/min (%)' | 'R$'
type MultaMAED = 'Sim' | 'Não'

type Props = {
  loading: boolean
  onClose: () => void
  onValidationError: (msg: string) => void
  onCalcular: (payload: CriarSimulacaoPayload) => void
}

export function SimulacaoModal({
  loading,
  onClose,
  onValidationError,
  onCalcular,
}: Props) {
  const [identificador, setIdentificador] = useState('')
  const [nome, setNome] = useState('')
  const [areaStr, setAreaStr] = useState('')
  const [rmtStr, setRmtStr] = useState('')
  const [tipoHonorarios, setTipoHonorarios] = useState<TipoHonorarios>('R$')
  const [honorariosStr, setHonorariosStr] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [multaMAED, setMultaMAED] = useState<MultaMAED>('Sim')

  function calcular() {
    const id = identificador.trim()
    const nomeVinculo = nome.trim()
    const areaInformada = parsePtBrNumber(areaStr)
    const rmtInformada = parsePtBrNumber(rmtStr)

    if (!id) return onValidationError('Informe o identificador do registro.')
    if (!nomeVinculo) return onValidationError('Informe o nome.')
    if (!Number.isFinite(areaInformada) || areaInformada < 0)
      return onValidationError('Informe a área (m²) corretamente.')
    if (!Number.isFinite(rmtInformada) || rmtInformada < 0)
      return onValidationError('Informe a RMT corretamente.')
    if (!honorariosStr.trim()) return onValidationError('Informe os honorários.')
    if (!dataInicio) return onValidationError('Informe a data de início da obra.')
    if (!dataFim) return onValidationError('Informe a data de fim da obra.')

    const honorariosRaw = honorariosStr.trim()
    const horaMin = tipoHonorarios === 'R$' ? `R$ ${honorariosRaw}` : honorariosRaw

    onCalcular({
      identificador: id,
      nomeVinculo,
      areaInformada,
      rmtInformada,
      horaMin,
      dataInicio,
      dataFim,
      status: multaMAED === 'Sim' ? 'LEAD_MORNO' : 'LEAD_FRIO',
    })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar simulação"
      />
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200/70 dark:bg-slate-950 dark:ring-white/10">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 p-4 dark:border-white/10">
          <div className="min-w-0">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Simuladores / eSocial
            </div>
            <div className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Simulação — Fator de ajuste eSocial
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

        <div className="max-h-[75dvh] overflow-auto p-4">
          <div className="space-y-5">
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:ring-white/10">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-100 dark:ring-emerald-300/20">
                Informações base
              </div>

              <div className="mt-4 grid gap-4">
                <label className="block">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Identificador do registro
                  </div>
                  <input
                    value={identificador}
                    onChange={(e) => setIdentificador(e.target.value)}
                    className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500"
                    placeholder="Identificador do registro"
                  />
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Este campo é obrigatório
                  </div>
                </label>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block md:col-span-1">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Nome
                    </div>
                    <input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500"
                      placeholder="Seu nome completo"
                    />
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Este campo é obrigatório
                    </div>
                  </label>

                  <label className="block md:col-span-1">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Área (m²)
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        value={areaStr}
                        onChange={(e) => setAreaStr(e.target.value)}
                        inputMode="decimal"
                        className="w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500"
                        placeholder="0,00"
                      />
                      <span className="text-sm text-slate-500 dark:text-slate-400">m²</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Este campo é obrigatório
                    </div>
                  </label>

                  <label className="block md:col-span-1">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      RMT
                    </div>
                    <input
                      value={rmtStr}
                      onChange={(e) => setRmtStr(e.target.value)}
                      inputMode="decimal"
                      className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500"
                      placeholder="R$ 0,00"
                    />
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Este campo é obrigatório
                    </div>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Tipo de honorários
                    </div>
                    <select
                      value={tipoHonorarios}
                      onChange={(e) =>
                        setTipoHonorarios(e.target.value === 'Hora/min (%)' ? 'Hora/min (%)' : 'R$')
                      }
                      className="mt-2 w-full rounded-xl bg-white px-3 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10"
                    >
                      <option value="R$">R$</option>
                      <option value="Hora/min (%)">Hora/min (%)</option>
                    </select>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Este campo é obrigatório
                    </div>
                  </label>

                  <label className="block">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Honorários
                    </div>
                    <input
                      value={honorariosStr}
                      onChange={(e) => setHonorariosStr(e.target.value)}
                      inputMode="decimal"
                      className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500"
                      placeholder={tipoHonorarios === 'R$' ? 'R$ 0,00' : '20%'}
                    />
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Este campo é obrigatório
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:ring-white/10">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-900 ring-1 ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-100 dark:ring-sky-300/20">
                Período
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Data de início da obra</div>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10"
                  />
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Este campo é obrigatório</div>
                </label>

                <label className="block">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Data do fim da obra</div>
                  <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10"
                  />
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Este campo é obrigatório</div>
                </label>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:ring-white/10">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                Opções adicionais
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Aplicar multa MAED?</div>
                  <select
                    value={multaMAED}
                    onChange={(e) => setMultaMAED(e.target.value === 'Não' ? 'Não' : 'Sim')}
                    className="mt-2 w-full rounded-xl bg-white px-3 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10"
                  >
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200/70 p-4 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900/5 px-4 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={calcular}
            disabled={loading}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
          >
            {loading ? 'Calculando…' : 'Calcular'}
          </button>
        </div>
      </div>
    </div>
  )
}
