import { useQueryClient } from '@tanstack/react-query'
import { CircleAlert, Loader2, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { createCalculo } from '@/features/calculos-inss/api/calculosApi'
import { CadastroClienteModal } from '@/features/calculos-inss/components/CadastroClienteModal'
import {
  obraFormInputClass,
  obraFormSelectClass,
} from '@/features/calculos-inss/components/obraFormStyles'
import {
  CATEGORIAS_OBRA,
  CONCRETO_USINADO,
  DESTINACOES_OBRA,
  ESTADOS_BR,
  SIM_NAO,
  TIPOS_OBRA,
  TIPOS_RESPONSAVEL,
  type ClienteOption,
} from '@/features/calculos-inss/constants/obraFormOptions'
import { CLIENTES_MOCK } from '@/features/calculos-inss/mocks/clientes'
import type { CreateCalculoObraPayload } from '@/features/calculos-inss/types/calculo.types'
import { calcularInssObra } from '@/features/calculos-inss/utils/inss'
import {
  FormAccordion,
  FormAccordionTrigger,
  FormField,
} from '@/shared/components/ui'
import { brl, parsePtBrNumber } from '@/shared/lib/format'
import { calculosKeys } from '@/shared/lib/queryKeys'

const MSG_OBRIGATORIO = 'Este campo é obrigatório'

function parsePercent(s: string, fallback: number): number {
  const raw = s.replace(',', '.').trim()
  if (raw === '') return fallback
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export function InssObrasForm() {
  const queryClient = useQueryClient()
  const [identificador, setIdentificador] = useState('')
  const [clienteId, setClienteId] = useState('')
  const [accordionClienteCadastrado, setAccordionClienteCadastrado] = useState(true)
  const [modalCadastroCliente, setModalCadastroCliente] = useState(false)
  const [salvandoCliente, setSalvandoCliente] = useState(false)
  const [clientes, setClientes] = useState<ClienteOption[]>(() => [
    ...CLIENTES_MOCK,
  ])

  const [estado, setEstado] = useState('ACRE')
  const [tipoResponsavel, setTipoResponsavel] = useState('PF')
  const [nfPreMoldado, setNfPreMoldado] = useState('NAO')
  const [dataInicio, setDataInicio] = useState('')
  const [dataTermino, setDataTermino] = useState('')

  const [destinacao, setDestinacao] = useState('')
  const [tipoObra, setTipoObra] = useState('')
  const [areaPrincipal, setAreaPrincipal] = useState('200')
  const [categoria, setCategoria] = useState('')
  const [concretoUsinado, setConcretoUsinado] = useState('NAO')

  const [accordionAreas, setAccordionAreas] = useState(false)
  const [valorContratoStr, setValorContratoStr] = useState('')
  const [valorMateriaisStr, setValorMateriaisStr] = useState('')
  const [percentualBaseStr, setPercentualBaseStr] = useState('40')
  const [aliquotaInssStr, setAliquotaInssStr] = useState('11')

  const [submetido, setSubmetido] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [resultadoVisivel, setResultadoVisivel] = useState(false)

  const valorContrato = useMemo(
    () => Math.max(0, parsePtBrNumber(valorContratoStr)),
    [valorContratoStr],
  )
  const valorMateriais = useMemo(
    () => Math.max(0, parsePtBrNumber(valorMateriaisStr)),
    [valorMateriaisStr],
  )
  const percentualBase = useMemo(
    () => parsePercent(percentualBaseStr, 40),
    [percentualBaseStr],
  )
  const aliquotaInss = useMemo(
    () => parsePercent(aliquotaInssStr, 11),
    [aliquotaInssStr],
  )

  const resultado = useMemo(
    () =>
      calcularInssObra({
        valorContrato,
        valorMateriais,
        percentualBase,
        aliquotaInss,
      }),
    [valorContrato, valorMateriais, percentualBase, aliquotaInss],
  )

  const erros = useMemo(() => {
    const e: Record<string, string | null> = {}
    if (!identificador.trim()) e.identificador = MSG_OBRIGATORIO
    if (accordionClienteCadastrado && !clienteId) e.cliente = MSG_OBRIGATORIO
    if (!estado) e.estado = MSG_OBRIGATORIO
    if (!tipoResponsavel) e.tipoResponsavel = MSG_OBRIGATORIO
    if (!nfPreMoldado) e.nfPreMoldado = MSG_OBRIGATORIO
    if (!destinacao) e.destinacao = MSG_OBRIGATORIO
    if (!tipoObra) e.tipoObra = MSG_OBRIGATORIO
    const area = parsePtBrNumber(areaPrincipal)
    if (!areaPrincipal.trim() || area <= 0) e.areaPrincipal = MSG_OBRIGATORIO
    if (!categoria) e.categoria = MSG_OBRIGATORIO
    if (!concretoUsinado) e.concretoUsinado = MSG_OBRIGATORIO
    return e
  }, [
    identificador,
    clienteId,
    accordionClienteCadastrado,
    estado,
    tipoResponsavel,
    nfPreMoldado,
    destinacao,
    tipoObra,
    areaPrincipal,
    categoria,
    concretoUsinado,
  ])

  function campoErro(chave: string) {
    return submetido ? erros[chave] ?? null : null
  }

  async function calcular() {
    setSubmetido(true)
    setErro(null)
    setResultadoVisivel(false)

    if (Object.keys(erros).length > 0) return

    if (!(valorContrato > 0)) {
      setAccordionAreas(true)
      setErro(
        'Informe o valor do contrato em "Áreas Complementares" para calcular o INSS.',
      )
      return
    }
    if (valorMateriais > valorContrato) {
      setErro('O valor de materiais não pode ser maior que o valor do contrato.')
      return
    }

    setSalvando(true)
    try {
      const payload: CreateCalculoObraPayload = {
        nomeObra: identificador.trim(),
        valorContrato,
        valorMateriais,
        percentualBase,
        aliquotaInss,
        inssEstimado: resultado.inss,
      }
      await createCalculo(payload)
      setResultadoVisivel(true)
      await queryClient.invalidateQueries({ queryKey: calculosKeys.all })
    } catch (e) {
      console.error('Erro ao salvar POST /calculos', e)
      setErro(
        'Não foi possível calcular/salvar. Verifique o backend e os dados informados.',
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <section className="col-span-full">
      <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10 sm:p-6">
        <div className="border-b border-slate-200/70 pb-5 dark:border-white/10">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Cálculo de INSS — Obras contratuais
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Preencha os dados da obra e do contrato. Base usual:{' '}
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {percentualBase}%
            </span>{' '}
            sobre o valor considerado e alíquota de{' '}
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {aliquotaInss}%
            </span>{' '}
            sobre a base (Lei 8.212/1991, art. 22, III).
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <FormField
            label="Identificador do registro:"
            required
            info
            error={campoErro('identificador')}
          >
            <input
              type="text"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              placeholder="Identificador da obra"
              className={obraFormInputClass}
            />
          </FormField>

          <FormAccordion
            title="Usar cliente já cadastrado"
            open={accordionClienteCadastrado}
            onToggle={() => setAccordionClienteCadastrado((v) => !v)}
          >
            <FormField label="Cliente" required error={campoErro('cliente')}>
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className={obraFormSelectClass}
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </FormField>
          </FormAccordion>

          <FormAccordionTrigger
            title="Cadastrar novo cliente"
            trailingIcon="plus"
            onClick={() => setModalCadastroCliente(true)}
          />

          {modalCadastroCliente ? (
            <CadastroClienteModal
              onClose={() => setModalCadastroCliente(false)}
              salvando={salvandoCliente}
              onSalvar={async (novo) => {
                setSalvandoCliente(true)
                try {
                  const id = `local-${Date.now()}`
                  const doc = novo.documento
                  const label = `${novo.nome} — ${doc.length > 6 ? `${doc.slice(0, 3)}***` : doc}`
                  setClientes((lista) => [
                    { value: id, label },
                    ...lista,
                  ])
                  setClienteId(id)
                  setAccordionClienteCadastrado(true)
                  setModalCadastroCliente(false)
                } finally {
                  setSalvandoCliente(false)
                }
              }}
            />
          ) : null}

          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              label="Selecione seu estado:"
              required
              error={campoErro('estado')}
            >
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className={obraFormSelectClass}
              >
                {ESTADOS_BR.map((uf) => (
                  <option key={uf.value} value={uf.value}>
                    {uf.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Selecione o tipo do responsável:"
              required
              error={campoErro('tipoResponsavel')}
            >
              <select
                value={tipoResponsavel}
                onChange={(e) => setTipoResponsavel(e.target.value)}
                className={obraFormSelectClass}
              >
                {TIPOS_RESPONSAVEL.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Utilizou NF de pré moldado acima de 40% COD?"
              required
              info
              error={campoErro('nfPreMoldado')}
            >
              <select
                value={nfPreMoldado}
                onChange={(e) => setNfPreMoldado(e.target.value)}
                className={obraFormSelectClass}
              >
                {SIM_NAO.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Data de início da obra:">
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className={obraFormInputClass}
                placeholder="dd/mm/aaaa"
              />
            </FormField>
            <FormField label="Data de término da obra:">
              <input
                type="date"
                value={dataTermino}
                onChange={(e) => setDataTermino(e.target.value)}
                className={obraFormInputClass}
                placeholder="dd/mm/aaaa"
              />
            </FormField>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:ring-white/10">
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr_0.9fr_1fr_0.9fr_auto] lg:items-end">
              <FormField
                label="Selecione a destinação:"
                required
                info
                error={campoErro('destinacao')}
              >
                <select
                  value={destinacao}
                  onChange={(e) => setDestinacao(e.target.value)}
                  className={obraFormSelectClass}
                >
                  <option value="">Selecione Uma Destinação:</option>
                  {DESTINACOES_OBRA.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Tipo de obra:"
                required
                info
                error={campoErro('tipoObra')}
              >
                <select
                  value={tipoObra}
                  onChange={(e) => setTipoObra(e.target.value)}
                  className={obraFormSelectClass}
                >
                  <option value="">Selecione O Tipo De Obra:</option>
                  {TIPOS_OBRA.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Área principal:"
                required
                info
                error={campoErro('areaPrincipal')}
              >
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={areaPrincipal}
                    onChange={(e) => setAreaPrincipal(e.target.value)}
                    className={`${obraFormInputClass} pr-10`}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 dark:text-slate-400">
                    m²
                  </span>
                </div>
              </FormField>

              <FormField
                label="Selecione a categoria:"
                required
                info
                error={campoErro('categoria')}
              >
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className={obraFormSelectClass}
                >
                  <option value="">Selecione A Categoria:</option>
                  {CATEGORIAS_OBRA.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Concreto usinado:"
                required
                info
                error={campoErro('concretoUsinado')}
              >
                <select
                  value={concretoUsinado}
                  onChange={(e) => setConcretoUsinado(e.target.value)}
                  className={obraFormSelectClass}
                >
                  {CONCRETO_USINADO.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <button
                type="button"
                title="Adicionar área complementar"
                className="flex h-[46px] w-full items-center justify-center rounded-xl bg-sky-600 text-white transition hover:bg-sky-500 disabled:opacity-70 dark:bg-sky-500 dark:hover:bg-sky-400 lg:w-[46px]"
                onClick={() => setAccordionAreas(true)}
              >
                <Plus className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <FormAccordion
            title="Áreas Complementares"
            open={accordionAreas}
            onToggle={() => setAccordionAreas((v) => !v)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Valor total do contrato (R$):" required>
                <input
                  inputMode="decimal"
                  value={valorContratoStr}
                  onChange={(e) => setValorContratoStr(e.target.value)}
                  placeholder="Ex.: 1.500.000,00"
                  className={obraFormInputClass}
                />
              </FormField>
              <FormField label="Materiais segregados no contrato (R$):">
                <input
                  inputMode="decimal"
                  value={valorMateriaisStr}
                  onChange={(e) => setValorMateriaisStr(e.target.value)}
                  placeholder="0"
                  className={obraFormInputClass}
                />
              </FormField>
              <FormField label="Percentual da base (%):">
                <input
                  inputMode="decimal"
                  value={percentualBaseStr}
                  onChange={(e) => setPercentualBaseStr(e.target.value)}
                  placeholder="40"
                  className={obraFormInputClass}
                />
              </FormField>
              <FormField label="Alíquota INSS sobre a base (%):">
                <input
                  inputMode="decimal"
                  value={aliquotaInssStr}
                  onChange={(e) => setAliquotaInssStr(e.target.value)}
                  placeholder="11"
                  className={obraFormInputClass}
                />
              </FormField>
            </div>
          </FormAccordion>

          {resultadoVisivel && valorContrato > 0 ? (
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:ring-white/10">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                INSS a reter (estimado)
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                {brl.format(resultado.inss)}
              </p>
              <dl className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between gap-2">
                  <dt>Valor considerado</dt>
                  <dd className="font-medium tabular-nums text-slate-900 dark:text-slate-100">
                    {brl.format(resultado.valorConsiderado)}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Base ({percentualBase}%)</dt>
                  <dd className="font-medium tabular-nums text-slate-900 dark:text-slate-100">
                    {brl.format(resultado.baseInss)}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}

          {erro ? (
            <div className="flex items-start gap-2 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-800 ring-1 ring-rose-500/20 dark:text-rose-100">
              <CircleAlert
                className="mt-0.5 size-4 shrink-0 text-rose-600 dark:text-rose-200"
                aria-hidden="true"
              />
              <div>{erro}</div>
            </div>
          ) : null}

          <div className="flex justify-end border-t border-slate-200/70 pt-4 dark:border-white/10">
            <button
              type="button"
              onClick={() => void calcular()}
              disabled={salvando}
              className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-xl bg-sky-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
            >
              {salvando ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              Calcular
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
