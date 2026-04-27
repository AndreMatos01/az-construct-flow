import { CircleAlert, Loader2, Save } from 'lucide-react'
import { useMemo, useState } from 'react'
import { api } from '../api/client'
import type { CalculoDto } from '../types/calculos'
import { brl } from '../utils/format'
import { calcularRestituicaoInss } from '../utils/inss'

type Props = {
  onAfterSave?: () => Promise<void> | void
}

export function InssObrasPage({ onAfterSave }: Props) {
  const [nomeObra, setNomeObra] = useState('')
  const [valorContratoStr, setValorContratoStr] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const valorContrato = useMemo(() => {
    const raw = valorContratoStr.replace(/\./g, '').replace(',', '.').trim()
    const n = Number(raw)
    return Number.isFinite(n) ? n : 0
  }, [valorContratoStr])

  const restitucao = useMemo(
    () => calcularRestituicaoInss(Math.max(0, valorContrato)),
    [valorContrato],
  )

  async function salvarCalculo() {
    setErro(null)
    const nome = nomeObra.trim()
    if (!nome) {
      setErro('Informe o nome da obra.')
      return
    }
    if (!(valorContrato > 0)) {
      setErro('Informe um valor de contrato válido.')
      return
    }

    setSalvando(true)
    try {
      const payload: CalculoDto = {
        nomeObra: nome,
        valorContrato,
        inssEstimado: restitucao,
      }
      await api.post('/calculos', payload)
      setNomeObra('')
      setValorContratoStr('')
      await onAfterSave?.()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Erro ao salvar POST /calculos', e)
      setErro(
        'Não foi possível salvar. Verifique o endpoint POST /calculos e se ele aceita { nomeObra, valorContrato, inssEstimado }.',
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <section className="md:col-span-2">
      <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Calculadora de INSS (obras)
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Alíquota de 11% sobre 40% do valor do contrato.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Nome da obra
            </div>
            <input
              value={nomeObra}
              onChange={(e) => setNomeObra(e.target.value)}
              placeholder="Ex.: Residencial Alameda"
              className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500"
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Valor do contrato (R$)
            </div>
            <input
              inputMode="decimal"
              value={valorContratoStr}
              onChange={(e) => setValorContratoStr(e.target.value)}
              placeholder="Ex.: 150000,00"
              className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500"
            />
          </label>

          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:ring-white/10">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Restituição estimada
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">
              {brl.format(restitucao || 0)}
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Base: 40% do contrato = {brl.format((valorContrato || 0) * 0.4)}
              {' · '}
              INSS: 11% sobre a base
            </div>
          </div>

          {erro ? (
            <div className="flex items-start gap-2 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-100 ring-1 ring-rose-500/20">
              <CircleAlert
                className="mt-0.5 size-4 text-rose-200"
                aria-hidden="true"
              />
              <div>{erro}</div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => void salvarCalculo()}
            disabled={salvando}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
          >
            {salvando ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="size-4" aria-hidden="true" />
            )}
            Salvar em /calculos
          </button>
        </div>
      </div>
    </section>
  )
}

