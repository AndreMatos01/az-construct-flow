import { brl } from '@/shared/lib/format'
import { fetchRelatorio } from '../api/fatorEsocialApi'
import type { FatorESocialRelatorio } from '../types/fatorEsocial.types'

function buildPrintHtml(r: FatorESocialRelatorio): string {
  const now = new Date(r.emitidoEm ?? Date.now())
  const obra = r.obra ?? {}
  const linhas = Array.isArray(r.linhas) ? r.linhas : []
  const resumo = r.resumo ?? {}
  const situacao = r.situacao ?? {}
  const rodape = r.rodape ?? {}

  const title = String(r.titulo ?? `Simulação PF - ESocial - ${obra.identificador ?? ''}`)
  const linha = linhas[0] ?? {}
  return `
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
}

/**
 * Abre uma janela e imprime o relatório do registro.
 * Importante: não usar `noopener/noreferrer`, senão o Chrome pode retornar `null`
 * e impedir a escrita do HTML para impressão.
 */
export function imprimirRelatorio(id: number, onError: (msg: string) => void) {
  const w = window.open('', '_blank', 'width=840,height=720')
  if (!w) {
    onError('Seu navegador bloqueou a janela de impressão (pop-up).')
    return
  }

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
      const data = await fetchRelatorio(id)
      const html = buildPrintHtml(data)
      window.clearTimeout(timeout)
      w.document.open()
      w.document.write(html)
      w.document.close()
    } catch (e) {
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
        w.document.open()
        w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Erro</title></head><body>Erro ao carregar relatório.</body></html>')
        w.document.close()
      }
    }
  })()
}
