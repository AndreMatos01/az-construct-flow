import { Calculator } from 'lucide-react'
import { useState } from 'react'
import { FormField } from '@/shared/components/ui'
import {
  DESTINACOES_OBRA,
  ESTADOS_BR,
  TIPOS_OBRA,
  TIPOS_PESSOA,
  CATEGORIA_OBRA,
  type DestinacaoValue,
  type EstadoValue,
  type TipoObraValue,
  type CategoriaObraValue,
  type TipoPessoaValue,
} from '@/shared/constants/obraOptions'
import { parsePtBrNumber } from '@/shared/lib/format'
import type { CalculoSeroPayload } from '../types/calculoSero.types'

const fieldClass =
  'w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500'

const numeroPtBr = (n: number | undefined) =>
  n == null ? '' : String(n).replace('.', ',')

type Props = {
  initial?: Partial<CalculoSeroPayload>
  loading: boolean
  submitLabel: string
  onCancel: () => void
  onValidationError: (msg: string) => void
  onSubmit: (payload: CalculoSeroPayload) => void
}

export function CalculoSeroForm({
  initial,
  loading,
  submitLabel,
  onCancel,
  onValidationError,
  onSubmit,
}: Props) {
  const [nomeObra, setNomeObra] = useState(initial?.nomeObra ?? '')
  const [nomeCliente, setNomeCliente] = useState(initial?.nomeCliente ?? '')
  const [cpf, setCpf] = useState(initial?.cpf ?? '')
  const [telefone, setTelefone] = useState(initial?.telefone ?? '')
  const [areaPrincipalStr, setAreaPrincipalStr] = useState(() =>
    numeroPtBr(initial?.areaPrincipal),
  )
  
  const [destinacao, setDestinacao] = useState<DestinacaoValue>(
    initial?.destinacao ?? 'UNIFAMILIAR',
  )
  const [tipoObra, setTipoObra] = useState<TipoObraValue>(
    initial?.tipoObra ?? 'ALVENARIA',
  )
  const [categoriaObra, setCategoriaObra] = useState<CategoriaObraValue>(
    initial?.categoriaObra ?? 'NOVA',
  )
  const [concretoUsinado, setConcretoUsinado] = useState(
    initial?.concretoUsinado ?? false,
  )
  const [estado, setEstado] = useState<EstadoValue>(
    initial?.estado ?? 'SANTA_CATARINA',
  )
  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoaValue>(
    initial?.tipoPessoa ?? 'PF',
  )
  const [dataInicio, setDataInicio] = useState(initial?.dataInicio ?? '')
  const [dataFim, setDataFim] = useState(initial?.dataFim ?? '')

  function submeter() {
    const areaPrincipal = parsePtBrNumber(areaPrincipalStr)
    const areaCompDesc = areaCompDescStr.trim()
      ? parsePtBrNumber(areaCompDescStr)
      : 0
    const areaCompCob = areaCompCobStr.trim()
      ? parsePtBrNumber(areaCompCobStr)
      : 0

    if (!nomeObra.trim()) return onValidationError('Informe o nome da obra.')
    if (!nomeCliente.trim()) return onValidationError('Informe o nome do cliente.')
    if (!cpf.trim()) return onValidationError('Informe o CPF.')
    if (!telefone.trim()) return onValidationError('Informe o telefone.')
    if (!Number.isFinite(areaPrincipal) || areaPrincipal <= 0)
      return onValidationError('Informe a área principal (m²) corretamente.')
    if (!Number.isFinite(areaCompDesc) || areaCompDesc < 0)
      return onValidationError('Informe a área complementar descoberta (m²) corretamente.')
    if (!Number.isFinite(areaCompCob) || areaCompCob < 0)
      return onValidationError('Informe a área complementar coberta (m²) corretamente.')
    if (!dataInicio) return onValidationError('Informe a data de início da obra.')
    if (!dataFim) return onValidationError('Informe a data final da obra.')
    if (dataFim < dataInicio)
      return onValidationError('A data final não pode ser anterior à de início.')

    onSubmit({
      nomeObra: nomeObra.trim(),
      nomeCliente: nomeCliente.trim(),
      cpf: cpf.trim(),
      telefone: telefone.trim(),
      areaPrincipal,
      destinacao,
      tipoObra,
      categoriaObra,
      concretoUsinado,
      estado,
      tipoPessoa,
      dataInicio,
      dataFim,
    })
  }

  return (
    <form
      className="max-h-[75dvh] overflow-auto p-4"
      onSubmit={(e) => {
        e.preventDefault()
        submeter()
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Nome da obra:" required>
          <input
            className={fieldClass}
            value={nomeObra}
            onChange={(e) => setNomeObra(e.target.value)}
            autoFocus
          />
        </FormField>

        <FormField label="Nome do cliente:" required>
          <input
            className={fieldClass}
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
          />
        </FormField>

        <FormField label="CPF:" required>
          <input
            className={fieldClass}
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
          />
        </FormField>

        <FormField label="Telefone:" required>
          <input
            className={fieldClass}
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </FormField>

        <FormField label="Área Principal (m²):" required>
          <input
            className={fieldClass}
            inputMode="decimal"
            value={areaPrincipalStr}
            onChange={(e) => setAreaPrincipalStr(e.target.value)}
            placeholder="0,00"
          />
        </FormField>

        <FormField label="Destinação:" required>
          <select
            className={fieldClass}
            value={destinacao}
            onChange={(e) => setDestinacao(e.target.value as DestinacaoValue)}
          >
            {DESTINACOES_OBRA.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FormField>

      <FormField label="Categoria da Obra:" required>
        <select
          className={fieldClass}
          value={categoriaObra}
          onChange={(e) => setCategoriaObra(e.target.value as CategoriaObraValue)}
        >
          {CATEGORIA_OBRA.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FormField>

        <FormField label="Tipo de Obra:" required>
          <select
            className={fieldClass}
            value={tipoObra}
            onChange={(e) => setTipoObra(e.target.value as TipoObraValue)}
          >
            {TIPOS_OBRA.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Usou Concreto Usinado:" required>
          <select
            className={fieldClass}
            value={concretoUsinado ? 'true' : 'false'}
            onChange={(e) => setConcretoUsinado(e.target.value === 'true')}
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </FormField>

        <FormField label="Estado:" required>
          <select
            className={fieldClass}
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoValue)}
          >
            {ESTADOS_BR.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Tipo de pessoa:" required>
          <select
            className={fieldClass}
            value={tipoPessoa}
            onChange={(e) => setTipoPessoa(e.target.value as TipoPessoaValue)}
          >
            {TIPOS_PESSOA.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Data de Início da Obra:" required>
          <input
            type="date"
            className={fieldClass}
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </FormField>

        <FormField label="Data Final da Obra:" required>
          <input
            type="date"
            className={fieldClass}
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </FormField>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-200/70 pt-4 dark:border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl bg-slate-900/5 px-4 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
        >
          <Calculator className="size-4" aria-hidden="true" />
          {loading ? 'Processando…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
