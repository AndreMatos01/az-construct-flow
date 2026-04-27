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

export type FatorESocialPageResponse = { items: FatorESocialRow[]; total: number }

