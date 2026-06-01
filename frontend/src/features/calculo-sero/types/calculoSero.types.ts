import type {
  DestinacaoValue,
  EstadoValue,
  TipoObraValue,
  TipoPessoaValue,
} from '@/shared/constants/obraOptions'

export type CalculoSeroRow = {
  id: number
  nomeObra: string
  nomeCliente: string
  cpf: string
  telefone: string
  areaPrincipal: number
  areaComplementarDescoberta: number
  areaComplementarCoberta: number
  destinacao: DestinacaoValue
  tipoObra: TipoObraValue
  concretoUsinado: boolean
  estado: EstadoValue
  tipoPessoa: TipoPessoaValue
  dataInicio: string
  dataFim: string
  baseCalculo: number
  valorInss: number
  calculadoEm: string
}

export type CalculoSeroPageResponse = {
  items: CalculoSeroRow[]
  total: number
}

export type CalculoSeroPayload = {
  nomeObra: string
  nomeCliente: string
  cpf: string
  telefone: string
  areaPrincipal: number
  areaComplementarDescoberta: number
  areaComplementarCoberta: number
  destinacao: DestinacaoValue
  tipoObra: TipoObraValue
  concretoUsinado: boolean
  estado: EstadoValue
  tipoPessoa: TipoPessoaValue
  dataInicio: string
  dataFim: string
}

export type CalculoSeroFiltros = {
  nomeObra: string
  nomeCliente: string
  cpf: string
  telefone: string
}
