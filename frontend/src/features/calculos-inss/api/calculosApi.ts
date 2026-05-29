import { api } from '@/shared/api/client'
import type { CalculoObra, CreateCalculoObraPayload } from '../types/calculo.types'

export async function fetchCalculos(): Promise<CalculoObra[]> {
  const { data } = await api.get<CalculoObra[]>('/calculos')
  return Array.isArray(data) ? data : []
}

export async function createCalculo(payload: CreateCalculoObraPayload): Promise<void> {
  await api.post('/calculos', payload)
}
