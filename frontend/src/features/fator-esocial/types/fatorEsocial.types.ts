export type FatorESocialStatus = 'LEAD_FRIO' | 'LEAD_MORNO' | 'LEAD_QUENTE'

export type FatorESocialRow = {
  id: number
  identificador: string
  nomeVinculo: string
  areaInformada: number
  rmtInformada: number
  horaMin: string
  dataInicio: string
  dataFim: string
  calculadoEm: string
  status: FatorESocialStatus
}

export type FatorESocialPageResponse = {
  items: FatorESocialRow[]
  total: number
}

export type CriarSimulacaoPayload = {
  identificador: string
  nomeVinculo: string
  areaInformada: number
  rmtInformada: number
  horaMin: string
  dataInicio: string
  dataFim: string
  status: FatorESocialStatus
}

export type AtualizarRegistroPayload = {
  identificador: string
  nomeVinculo: string
  areaInformada: number
  rmtInformada: number
  horaMin: string
  dataInicio: string
  dataFim: string
  status: FatorESocialStatus
}

export type RelatorioLinha = {
  mesAno?: string
  remAtualizada?: number
  remOriginal?: number
  cpp20?: number
  multa20?: number
  selicAcumuladaPct?: number | string
  jurosMora?: number
  multaMaed?: number
  total?: number
}

export type RelatorioObra = {
  identificador?: string
  nome?: string
  metragemM2?: number
  inicioObra?: string
  fimObra?: string
  rmt100?: number
  rmt50?: number
  periodoComDctfweb?: number
}

export type RelatorioResumo = {
  inssDevido?: number
  inssReduzido?: number
  economiaGerada?: number
  economiaGeradaPct?: number
  custoServico?: number
  economiaReal?: number
  economiaRealPct?: number
}

export type RelatorioSituacao = {
  valoresAtrasados?: number
  totalEstimado?: number
}

export type RelatorioRodape = {
  empresa?: string
  cidade?: string
  telefone?: string
  link?: string
}

export type FatorESocialRelatorio = {
  titulo?: string
  emitidoEm?: string
  obra?: RelatorioObra
  linhas?: RelatorioLinha[]
  resumo?: RelatorioResumo
  situacao?: RelatorioSituacao
  rodape?: RelatorioRodape
  observacao?: string
}
