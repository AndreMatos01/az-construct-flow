export const calculosKeys = {
  all: ['calculos'] as const,
}

export type FatorEsocialListParams = {
  q: string
  page: number
  perPage: number
}

export const fatorEsocialKeys = {
  all: ['fator-esocial'] as const,
  list: (params: FatorEsocialListParams) =>
    ['fator-esocial', 'list', params] as const,
}
