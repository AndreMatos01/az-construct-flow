/** Opções alinhadas aos enums do backend (com descrições para exibição). */

export const ESTADOS_BR = [
  { value: 'ACRE', label: 'AC - Acre' },
  { value: 'ALAGOAS', label: 'AL - Alagoas' },
  { value: 'AMAPA', label: 'AP - Amapá' },
  { value: 'AMAZONAS', label: 'AM - Amazonas' },
  { value: 'BAHIA', label: 'BA - Bahia' },
  { value: 'CEARA', label: 'CE - Ceará' },
  { value: 'DISTRITO_FEDERAL', label: 'DF - Distrito Federal' },
  { value: 'ESPIRITO_SANTO', label: 'ES - Espírito Santo' },
  { value: 'GOIAS', label: 'GO - Goiás' },
  { value: 'MARANHAO', label: 'MA - Maranhão' },
  { value: 'MATO_GROSSO', label: 'MT - Mato Grosso' },
  { value: 'MATO_GROSSO_DO_SUL', label: 'MS - Mato Grosso do Sul' },
  { value: 'MINAS_GERAIS', label: 'MG - Minas Gerais' },
  { value: 'PARA', label: 'PA - Pará' },
  { value: 'PARAIBA', label: 'PB - Paraíba' },
  { value: 'PARANA', label: 'PR - Paraná' },
  { value: 'PERNAMBUCO', label: 'PE - Pernambuco' },
  { value: 'PIAUI', label: 'PI - Piauí' },
  { value: 'RIO_DE_JANEIRO', label: 'RJ - Rio de Janeiro' },
  { value: 'RIO_GRANDE_DO_NORTE', label: 'RN - Rio Grande do Norte' },
  { value: 'RIO_GRANDE_DO_SUL', label: 'RS - Rio Grande do Sul' },
  { value: 'RONDONIA', label: 'RO - Rondônia' },
  { value: 'RORAIMA', label: 'RR - Roraima' },
  { value: 'SANTA_CATARINA', label: 'SC - Santa Catarina' },
  { value: 'SAO_PAULO', label: 'SP - São Paulo' },
  { value: 'SERGIPE', label: 'SE - Sergipe' },
  { value: 'TOCANTINS', label: 'TO - Tocantins' },
] as const

export const DESTINACOES_OBRA = [
  { value: 'UNIFAMILIAR', label: 'Residência Unifamiliar' },
  { value: 'MULTIFAMILIAR', label: 'Residência Multifamiliar' },
  { value: 'COMERCIAL_SALAS_LOJAS', label: 'Comercial - Salas e Lojas' },
  { value: 'GALPAO_INDUSTRIAL', label: 'Galpão Industrial' },
  { value: 'CASA_POPULAR', label: 'Casa Popular' },
  {
    value: 'CONJUNTO_HABITACIONAL_POPULAR',
    label: 'Conjunto Habitacional Popular',
  },
  { value: 'EDIFICIO_GARAGEM', label: 'Edifício Garagem' },
] as const

export const TIPOS_OBRA = [
  { value: 'ALVENARIA', label: 'Alvenaria' },
  { value: 'MADEIRA', label: 'Madeira' },
  { value: 'MISTA', label: 'Mista' },
  { value: 'ALVENARIA_PROJETO_SOCIAL', label: 'Alvenaria Interesse Social' },
  {
    value: 'MISTA_MADEIRA_PROJETO_SOCIAL',
    label: 'Mista/Madeira Interesse Social',
  },
] as const

export const CATEGORIAS_OBRA = [
  { value: 'NOVA', label: 'Nova' },
  { value: 'ACRESCIMO', label: 'Acréscimo' },
  { value: 'DEMOLICAO', label: 'Demolição' },
  { value: 'REFORMA', label: 'Reforma' },
] as const

export const TIPOS_RESPONSAVEL = [
  { value: 'PF', label: 'Pessoa Física' },
  { value: 'PJ', label: 'Pessoa Jurídica' },
] as const

export const SIM_NAO = [
  { value: 'NAO', label: 'NÃO' },
  { value: 'SIM', label: 'SIM' },
] as const

export const CONCRETO_USINADO = [
  { value: 'NAO', label: 'Não' },
  { value: 'SIM', label: 'Sim' },
] as const

export type { ClienteOption } from '../mocks/clientes'
