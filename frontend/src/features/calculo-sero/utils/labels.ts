import {
  DESTINACOES_OBRA,
  ESTADOS_BR,
  TIPOS_OBRA,
  TIPOS_PESSOA,
  CATEGORIA_OBRA,
} from '@/shared/constants/obraOptions'

function toLabel(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value
}

export const destinacaoLabel = (v: string) => toLabel(DESTINACOES_OBRA, v)
export const tipoObraLabel = (v: string) => toLabel(TIPOS_OBRA, v)
export const estadoLabel = (v: string) => toLabel(ESTADOS_BR, v)
export const tipoPessoaLabel = (v: string) => toLabel(TIPOS_PESSOA, v)
export const categoriaObraLabel = (v: string) => toLabel(CATEGORIA_OBRA, v)