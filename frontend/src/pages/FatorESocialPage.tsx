import {
  CircleAlert,
  Loader2,
  Pencil,
  Play,
  Printer,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import type { FatorESocialPageResponse, FatorESocialRow, FatorESocialStatus } from '../types/fatorEsocial'
import { brl, parsePtBrNumber } from '../utils/format'

function chipStatusClasses(status: FatorESocialStatus) {
  if (status === 'LEAD_QUENTE') {
    return 'bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-100 dark:ring-emerald-300/20'
  }
  if (status === 'LEAD_MORNO') {
    return 'bg-amber-500/15 text-amber-900 ring-1 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-100 dark:ring-amber-300/20'
  }
  return 'bg-slate-900/5 text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10'
}

function statusLabel(status: FatorESocialStatus) {
  if (status === 'LEAD_QUENTE') return 'Lead Quente'
  if (status === 'LEAD_MORNO') return 'Lead Morno'
  return 'Lead Frio'
}

export function FatorESocialPage() {
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editing, setEditing] = useState<FatorESocialRow | null>(null)
  const [editIdentificador, setEditIdentificador] = useState('')
  const [editNomeVinculo, setEditNomeVinculo] = useState('')

  const [simulando, setSimulando] = useState(false)
  const [simIdentificador, setSimIdentificador] = useState('')
  const [simNome, setSimNome] = useState('')
  const [simAreaStr, setSimAreaStr] = useState('')
  const [simRmtStr, setSimRmtStr] = useState('')
  const [simTipoHonorarios, setSimTipoHonorarios] = useState<'Hora/min (%)' | 'R$'>('R$')
  const [simHonorariosStr, setSimHonorariosStr] = useState('')
  const [simDataInicio, setSimDataInicio] = useState('')
  const [simDataFim, setSimDataFim] = useState('')
  const [simMultaMAED, setSimMultaMAED] = useState<'Sim' | 'Não'>('Sim')

  const [rows, setRows] = useState<FatorESocialRow[]>([])
  const [total, setTotal] = useState(0)

  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(page, totalPages)
  const pageRows = useMemo(() => rows, [rows])

  async function carregar() {
    setError(null)
    setLoading(true)
    try {
      const { data } = await api.get<FatorESocialPageResponse>('/fator-esocial', {
        params: { q: search || undefined, page: safePage, perPage },
      })
      setRows(Array.isArray(data?.items) ? data.items : [])
      setTotal(typeof data?.total === 'number' ? data.total : 0)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Erro ao carregar /fator-esocial', e)
      setError('Não foi possível carregar os registros do eSocial.')
      setRows([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage, safePage])

  useEffect(() => {
    const t = window.setTimeout(() => {
      setPage(1)
      void carregar()
    }, 350)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  function abrirSimulacao() {
    setError(null)
    setSimIdentificador('')
    setSimNome('')
    setSimAreaStr('')
    setSimRmtStr('')
    setSimTipoHonorarios('R$')
    setSimHonorariosStr('')
    setSimDataInicio('')
    setSimDataFim('')
    setSimMultaMAED('Sim')
    setSimulando(true)
  }

  async function calcularSimulacao() {
    setError(null)
    const identificador = simIdentificador.trim()
    const nomeVinculo = simNome.trim()
    const areaInformada = parsePtBrNumber(simAreaStr)
    const rmtInformada = parsePtBrNumber(simRmtStr)

    if (!identificador) return setError('Informe o identificador do registro.')
    if (!nomeVinculo) return setError('Informe o nome.')
    if (!Number.isFinite(areaInformada) || areaInformada < 0)
      return setError('Informe a área (m²) corretamente.')
    if (!Number.isFinite(rmtInformada) || rmtInformada < 0)
      return setError('Informe a RMT corretamente.')
    if (!simHonorariosStr.trim()) return setError('Informe os honorários.')
    if (!simDataInicio) return setError('Informe a data de início da obra.')
    if (!simDataFim) return setError('Informe a data de fim da obra.')

    const honorariosRaw = simHonorariosStr.trim()
    const horaMin = simTipoHonorarios === 'R$' ? `R$ ${honorariosRaw}` : honorariosRaw

    setLoading(true)
    try {
      await api.post('/fator-esocial', {
        identificador,
        nomeVinculo,
        areaInformada,
        rmtInformada,
        horaMin,
        dataInicio: simDataInicio,
        dataFim: simDataFim,
        status: simMultaMAED === 'Sim' ? 'LEAD_MORNO' : 'LEAD_FRIO',
      })
      setSimulando(false)
      await carregar()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Erro ao criar POST /fator-esocial', e)
      setError('Não foi possível salvar a simulação.')
    } finally {
      setLoading(false)
    }
  }

  function abrirEdicao(row: FatorESocialRow) {
    setEditing(row)
    setEditIdentificador(row.identificador)
    setEditNomeVinculo(row.nomeVinculo)
  }

  function salvarEdicao() {
    if (!editing) return
    const identificador = editIdentificador.trim()
    const nomeVinculo = editNomeVinculo.trim()
    if (!identificador || !nomeVinculo) return

    setError(null)
    setLoading(true)
    void (async () => {
      try {
        await api.put(`/fator-esocial/${editing.id}`, {
          identificador,
          nomeVinculo,
          areaInformada: editing.areaInformada,
          rmtInformada: editing.rmtInformada,
          horaMin: editing.horaMin,
          dataInicio: editing.dataInicio,
          dataFim: editing.dataFim,
          status: editing.status,
        })
        setEditing(null)
        await carregar()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Erro ao editar PUT /fator-esocial/{id}', e)
        setError('Não foi possível salvar a edição.')
      } finally {
        setLoading(false)
      }
    })()
  }

  function imprimir(row: FatorESocialRow) {
    // Importante: não usar `noopener/noreferrer` aqui, senão o Chrome pode retornar `null`
    // e impedir que a gente escreva o HTML para impressão.
    const w = window.open('', '_blank', 'width=840,height=720')
    if (!w) {
      setError('Seu navegador bloqueou a janela de impressão (pop-up).')
      return
    }
    // Render inicial (mais confiável que document.write em alguns browsers)
    w.document.documentElement.innerHTML = `
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Carregando…</title>
        <style>
          body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; margin: 24px; color: #0f172a; }
          .box { padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; }
          .muted { color: #475569; font-size: 12px; margin-top: 8px; }
        </style>
      </head>
      <body>
        <div class="box">
          <div><b>Gerando relatório…</b></div>
          <div class="muted">Aguarde enquanto buscamos os dados no backend.</div>
        </div>
      </body>
    `

    void (async () => {
      const timeout = window.setTimeout(() => {
        try {
          w.document.body.innerHTML = `
            <div class="box">
              <div><b>Não foi possível carregar o relatório.</b></div>
              <div class="muted">Verifique se o backend está rodando e tente novamente.</div>
            </div>
          `
        } catch {
          // ignore
        }
      }, 7000)

      try {
        const { data } = await api.get(`/fator-esocial/${row.id}/relatorio`)
        const html = buildPrintHtml(data)
        window.clearTimeout(timeout)
        w.document.open()
        w.document.write(html)
        w.document.close()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Erro ao buscar relatório para impressão', e)
        window.clearTimeout(timeout)
        try {
          w.document.body.innerHTML = `
            <div class="box">
              <div><b>Erro ao carregar relatório.</b></div>
              <div class="muted">Abra o Console do navegador para ver detalhes.</div>
            </div>
          `
        } catch {
          // fallback
          w.document.open()
          w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Erro</title></head><body>Erro ao carregar relatório.</body></html>')
          w.document.close()
        }
      }
    })()
  }

  function buildPrintHtml(r: any) {
    const now = new Date(r.emitidoEm ?? Date.now())
    const obra = r.obra ?? {}
    const linhas = Array.isArray(r.linhas) ? r.linhas : []
    const resumo = r.resumo ?? {}
    const situacao = r.situacao ?? {}
    const rodape = r.rodape ?? {}

    const title = String(r.titulo ?? `Simulação PF - ESocial - ${obra.identificador ?? ''}`)
    const linha = linhas[0] ?? {}
    const html = `
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${title}</title>
    <style>
      @page { size: A4; margin: 16mm; }
      * { box-sizing: border-box; }
      body {
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Liberation Sans";
        margin: 0;
        color: #0f172a;
        background: #fff;
      }
      .page { padding: 0; }
      .topbar { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
      .logo {
        width: 72px; height: 72px;
        border: 2px solid #b38b1d;
        display: grid; place-items: center;
        color: #b38b1d;
        font-weight: 800;
        font-size: 28px;
        line-height: 1;
      }
      .title {
        flex: 1;
        text-align: center;
        font-size: 16px;
        font-weight: 800;
        text-decoration: underline;
        margin-top: 10px;
      }
      .meta { font-size: 11px; color: #334155; white-space: nowrap; margin-top: 12px; }
      .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 18px; }
      .kv { font-size: 11px; line-height: 1.6; }
      .kv b { display: inline-block; min-width: 110px; }
      .sectionTitle {
        margin: 18px 0 8px;
        font-size: 14px;
        font-weight: 800;
        text-align: center;
      }
      table { width: 100%; border-collapse: collapse; }
      td, th { border: 1px solid #cbd5e1; padding: 9px 10px; text-align: left; font-size: 11px; vertical-align: top; }
      th { background: #f8fafc; font-weight: 800; }
      .right { text-align: right; }
      .center { text-align: center; }
      .muted { color: #475569; }
      .note { margin-top: 12px; font-size: 11px; line-height: 1.5; }
      .note .hl { color: #dc2626; font-weight: 800; }
      .footer { margin-top: 18px; text-align: center; }
      .footer h2 { margin: 0; font-size: 14px; font-weight: 900; letter-spacing: 0.4px; }
      .footer .small { margin-top: 6px; font-size: 11px; color: #334155; }
      .footer .link { margin-top: 6px; font-size: 10px; color: #0f172a; }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="topbar">
        <div class="logo">LF</div>
        <div class="title">${title}</div>
        <div class="meta">${now.toLocaleString('pt-BR')}</div>
      </div>

      <div class="grid2">
        <div class="kv">
          <div><b>Nome:</b> ${obra.nome ?? '-'}</div>
          <div><b>Metragem:</b> ${(obra.metragemM2 ?? 0).toLocaleString?.('pt-BR') ?? obra.metragemM2 ?? 0} m²</div>
          <div><b>Início da obra:</b> ${obra.inicioObra ?? '-'}</div>
          <div><b>Término da obra:</b> ${obra.fimObra ?? '-'}</div>
        </div>
        <div class="kv">
          <div><b>RMT 100%:</b> ${brl.format(Number(obra.rmt100 ?? 0))}</div>
          <div><b>RMT 50%:</b> ${brl.format(Number(obra.rmt50 ?? 0))}</div>
          <div><b>Período com DCTFweb:</b> ${obra.periodoComDctfweb ?? 1}</div>
        </div>
      </div>

      <div style="margin-top: 18px;">
        <table>
          <thead>
            <tr>
              <th>MÊS/ANO</th>
              <th>REM. ATUALIZADA</th>
              <th>REM. ORIGINAL</th>
              <th>CPP DE 20%</th>
              <th>MULTA DE 20%</th>
              <th>SELIC ACUMULADA (%)</th>
              <th>JUROS DE MORA</th>
              <th>MULTA MAED</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${linha.mesAno ?? '-'}</td>
              <td>${brl.format(Number(linha.remAtualizada ?? 0))}</td>
              <td>${brl.format(Number(linha.remOriginal ?? 0))}</td>
              <td>${brl.format(Number(linha.cpp20 ?? 0))}</td>
              <td>${brl.format(Number(linha.multa20 ?? 0))}</td>
              <td>${String(linha.selicAcumuladaPct ?? '0').replace('.', ',')}%</td>
              <td>${brl.format(Number(linha.jurosMora ?? 0))}</td>
              <td>${brl.format(Number(linha.multaMaed ?? 0))}</td>
              <td>${brl.format(Number(linha.total ?? 0))}</td>
            </tr>
            <tr>
              <th class="right" colspan="8">TOTAL</th>
              <th>${brl.format(Number(linha.total ?? 0))}</th>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="sectionTitle">Situação da obra</div>
      <table>
        <thead>
          <tr>
            <th>Valores atrasados</th>
            <th>A pagar (por mês)</th>
            <th>A pagar (futuro)</th>
            <th>TOTAL ESTIMADO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${brl.format(Number(situacao.valoresAtrasados ?? 0))}</td>
            <td class="center">-</td>
            <td class="center">-</td>
            <td>${brl.format(Number(situacao.totalEstimado ?? 0))}</td>
          </tr>
        </tbody>
      </table>

      <div class="sectionTitle">Resumo</div>
      <table>
        <thead>
          <tr>
            <th>INSS devido</th>
            <th>INSS a pagar com redução</th>
            <th>Economia gerada</th>
            <th>Custo do serviço</th>
            <th>Economia real</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${brl.format(Number(resumo.inssDevido ?? 0))}</td>
            <td>${brl.format(Number(resumo.inssReduzido ?? 0))}</td>
            <td>${brl.format(Number(resumo.economiaGerada ?? 0))} / ${Number(resumo.economiaGeradaPct ?? 0).toFixed(0)}%</td>
            <td>${brl.format(Number(resumo.custoServico ?? 0))}</td>
            <td>${brl.format(Number(resumo.economiaReal ?? 0))} / ${Number(resumo.economiaRealPct ?? 0).toFixed(0)}%</td>
          </tr>
        </tbody>
      </table>

      <div class="note">
        ${r.observacao ?? ''}
      </div>

      <div class="footer">
        <h2>${rodape.empresa ?? 'LF SOLUÇÕES FINANCEIRAS'}</h2>
        <div class="small">${rodape.cidade ?? 'Urubici - SC'} · ${rodape.telefone ?? '(47) 9 8856-4033'}</div>
        <div class="link">${rodape.link ?? 'https://www.instagram.com/luciaferrariconsultoria/'}</div>
      </div>
    </div>
    <script>window.onload = () => window.print();</script>
  </body>
</html>`
    return html
  }

  function deletar(row: FatorESocialRow) {
    const ok = window.confirm(`Deseja deletar o registro #${row.id}?`)
    if (!ok) return
    setError(null)
    setLoading(true)
    void (async () => {
      try {
        await api.delete(`/fator-esocial/${row.id}`)
        await carregar()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Erro ao deletar DELETE /fator-esocial/{id}', e)
        setError('Não foi possível deletar o registro.')
      } finally {
        setLoading(false)
      }
    })()
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
              onClick={abrirSimulacao}
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

      <section className="rounded-2xl bg-white dark:bg-white/5">
        <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <span className="text-slate-500 dark:text-slate-400">Exibir</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar…"
                className="w-full rounded-xl bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500"
              />
            </div>

            <button
              type="button"
              onClick={() => void carregar()}
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
              {pageRows.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-slate-500 dark:text-slate-400" colSpan={11}>
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                pageRows.map((r) => (
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
                          onClick={() => abrirEdicao(r)}
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
                            onClick={() => imprimir(r)}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900/5 p-2 text-slate-900 ring-1 ring-slate-200/70 transition hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
                            title="Imprimir"
                            aria-label={`Imprimir registro ${r.id}`}
                          >
                            <Printer className="size-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deletar(r)}
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
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </button>
            <button
              type="button"
              className="rounded-xl bg-slate-900/5 px-3 py-2 font-semibold text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-900/10 disabled:opacity-60 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Próxima
            </button>
          </div>
        </div>
      </section>

      {/* Modal: simulação */}
      {simulando ? (
        <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setSimulando(false)}
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
                onClick={() => setSimulando(false)}
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
                        value={simIdentificador}
                        onChange={(e) => setSimIdentificador(e.target.value)}
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
                          value={simNome}
                          onChange={(e) => setSimNome(e.target.value)}
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
                            value={simAreaStr}
                            onChange={(e) => setSimAreaStr(e.target.value)}
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
                          value={simRmtStr}
                          onChange={(e) => setSimRmtStr(e.target.value)}
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
                          value={simTipoHonorarios}
                          onChange={(e) =>
                            setSimTipoHonorarios(e.target.value === 'Hora/min (%)' ? 'Hora/min (%)' : 'R$')
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
                          value={simHonorariosStr}
                          onChange={(e) => setSimHonorariosStr(e.target.value)}
                          inputMode="decimal"
                          className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500"
                          placeholder={simTipoHonorarios === 'R$' ? 'R$ 0,00' : '20%'}
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
                        value={simDataInicio}
                        onChange={(e) => setSimDataInicio(e.target.value)}
                        className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10"
                      />
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Este campo é obrigatório</div>
                    </label>

                    <label className="block">
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Data do fim da obra</div>
                      <input
                        type="date"
                        value={simDataFim}
                        onChange={(e) => setSimDataFim(e.target.value)}
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
                        value={simMultaMAED}
                        onChange={(e) => setSimMultaMAED(e.target.value === 'Não' ? 'Não' : 'Sim')}
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
                onClick={() => setSimulando(false)}
                className="rounded-xl bg-slate-900/5 px-4 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void calcularSimulacao()}
                disabled={loading}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
              >
                {loading ? 'Calculando…' : 'Calcular'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Modal: editar */}
      {editing ? (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setEditing(null)}
            aria-label="Fechar edição"
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-xl dark:bg-slate-950 dark:ring-white/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Editar registro #{editing.id}
                </div>
                <div className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Fator de ajuste eSocial
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
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
                  value={editIdentificador}
                  onChange={(e) => setEditIdentificador(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500"
                />
              </label>

              <label className="block">
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Nome do vínculo
                </div>
                <input
                  value={editNomeVinculo}
                  onChange={(e) => setEditNomeVinculo(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:placeholder:text-slate-500"
                />
              </label>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl bg-slate-900/5 px-4 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={salvarEdicao}
                className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

