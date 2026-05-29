import { api } from '@/shared/api/client'
import type {
  AtualizarRegistroPayload,
  CriarSimulacaoPayload,
  FatorESocialPageResponse,
  FatorESocialRelatorio,
} from '../types/fatorEsocial.types'

type ListarParams = {
  q?: string
  page: number
  perPage: number
}

export async function fetchFatorEsocial(
  params: ListarParams,
): Promise<FatorESocialPageResponse> {
  const { data } = await api.get<FatorESocialPageResponse>('/fator-esocial', {
    params: { q: params.q || undefined, page: params.page, perPage: params.perPage },
  })
  return {
    items: Array.isArray(data?.items) ? data.items : [],
    total: typeof data?.total === 'number' ? data.total : 0,
  }
}

export async function createSimulacao(payload: CriarSimulacaoPayload): Promise<void> {
  await api.post('/fator-esocial', payload)
}

export async function updateRegistro(
  id: number,
  payload: AtualizarRegistroPayload,
): Promise<void> {
  await api.put(`/fator-esocial/${id}`, payload)
}

export async function deleteRegistro(id: number): Promise<void> {
  await api.delete(`/fator-esocial/${id}`)
}

export async function fetchRelatorio(id: number): Promise<FatorESocialRelatorio> {
  const { data } = await api.get<FatorESocialRelatorio>(`/fator-esocial/${id}/relatorio`)
  return data
}
