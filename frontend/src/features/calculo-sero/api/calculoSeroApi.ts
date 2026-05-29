import { api } from '@/shared/api/client'
import type {
  CalculoSeroFiltros,
  CalculoSeroPageResponse,
  CalculoSeroPayload,
  CalculoSeroRow,
} from '../types/calculoSero.types'

type ListarParams = CalculoSeroFiltros & {
  page: number
  perPage: number
}

export async function fetchCalculoSero(
  params: ListarParams,
): Promise<CalculoSeroPageResponse> {
  const { data } = await api.get<CalculoSeroPageResponse>('/calculo-sero', {
    params: {
      nomeObra: params.nomeObra || undefined,
      nomeCliente: params.nomeCliente || undefined,
      cpf: params.cpf || undefined,
      telefone: params.telefone || undefined,
      page: params.page,
      perPage: params.perPage,
    },
  })
  return {
    items: Array.isArray(data?.items) ? data.items : [],
    total: typeof data?.total === 'number' ? data.total : 0,
  }
}

export async function simularSero(
  payload: CalculoSeroPayload,
): Promise<CalculoSeroRow> {
  const { data } = await api.post<CalculoSeroRow>('/calculo-sero', payload)
  return data
}

export async function updateCalculoSero(
  id: number,
  payload: CalculoSeroPayload,
): Promise<CalculoSeroRow> {
  const { data } = await api.put<CalculoSeroRow>(`/calculo-sero/${id}`, payload)
  return data
}

export async function deleteCalculoSero(id: number): Promise<void> {
  await api.delete(`/calculo-sero/${id}`)
}
