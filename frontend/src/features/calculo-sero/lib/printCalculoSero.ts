import { brl } from '@/shared/lib/format'
import type { CalculoSeroRow } from '../types/calculoSero.types'
import {
  destinacaoLabel,
  estadoLabel,
  tipoObraLabel,
  tipoPessoaLabel,
} from '../utils/labels'

function linha(rotulo: string, valor: string): string {
  return `<tr><td class="k">${rotulo}</td><td class="v">${valor}</td></tr>`
}

function buildHtml(r: CalculoSeroRow): string {
  const emitido = new Date().toLocaleString('pt-BR')
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Cálculo SERO #${r.id} - ${r.nomeObra}</title>
    <style>
      @page { size: A4; margin: 16mm; }
      * { box-sizing: border-box; }
      body { font-family: ui-sans-serif, system-ui, Segoe UI, Roboto, Arial; color: #0f172a; margin: 0; }
      h1 { font-size: 18px; margin: 0 0 4px; }
      .meta { font-size: 11px; color: #475569; margin-bottom: 16px; }
      table { width: 100%; border-collapse: collapse; }
      td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
      td.k { color: #475569; width: 45%; }
      td.v { font-weight: 600; }
      .total { margin-top: 20px; padding: 16px; border-radius: 12px; background: #ecfdf5; border: 1px solid #a7f3d0; }
      .total .label { font-size: 12px; color: #047857; }
      .total .value { font-size: 24px; font-weight: 800; color: #047857; }
    </style>
  </head>
  <body>
    <h1>Cálculo SERO — Valor do INSS</h1>
    <div class="meta">Registro #${r.id} · Emitido em ${emitido}</div>
    <table>
      ${linha('Nome da obra', r.nomeObra)}
      ${linha('Nome do cliente', r.nomeCliente)}
      ${linha('CPF', r.cpf)}
      ${linha('Telefone', r.telefone)}
      ${linha('Área principal', `${r.areaPrincipal.toLocaleString('pt-BR')} m²`)}
      ${linha('Destinação', destinacaoLabel(r.destinacao))}
      ${linha('Tipo de obra', tipoObraLabel(r.tipoObra))}
      ${linha('Concreto usinado', r.concretoUsinado ? 'Sim' : 'Não')}
      ${linha('Estado', estadoLabel(r.estado))}
      ${linha('Tipo de pessoa', tipoPessoaLabel(r.tipoPessoa))}
      ${linha('Data de início', r.dataInicio)}
      ${linha('Data final', r.dataFim)}
      ${linha('Base de cálculo', brl.format(r.baseCalculo))}
    </table>
    <div class="total">
      <div class="label">Valor do INSS a ser pago</div>
      <div class="value">${brl.format(r.valorInss)}</div>
    </div>
    <script>window.onload = function () { window.print(); };</script>
  </body>
</html>`
}

export function imprimirCalculoSero(row: CalculoSeroRow) {
  const w = window.open('', '_blank', 'width=900,height=1000')
  if (!w) return
  w.document.open()
  w.document.write(buildHtml(row))
  w.document.close()
}
