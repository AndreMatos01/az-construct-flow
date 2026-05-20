import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import type { CalculoDto } from '../types/calculos'
import { mensagemErroApi } from '../utils/apiError'

export function useCalculos() {
  const [calculos, setCalculos] = useState<CalculoDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get<CalculoDto[]>('/calculos')
      setCalculos(Array.isArray(data) ? data : [])
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Erro ao carregar /calculos', e)
      setError(mensagemErroApi(e))
      setCalculos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return {
    calculos,
    loading,
    error,
    refetch,
  }
}
