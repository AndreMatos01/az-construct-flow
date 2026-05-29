import { useCallback, useEffect, useState } from 'react'
import { fetchCalculos } from '../api/calculosApi'
import type { CalculoObra } from '../types/calculo.types'
import { mensagemErroApi } from '@/shared/lib/apiError'
import { subscribeRefreshCalculos } from '@/shared/lib/refreshCalculos'

export function useCalculos() {
  const [calculos, setCalculos] = useState<CalculoObra[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setCalculos(await fetchCalculos())
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

  useEffect(() => subscribeRefreshCalculos(() => void refetch()), [refetch])

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('azcf:calculos-loading', { detail: loading }),
    )
  }, [loading])

  return {
    calculos,
    loading,
    error,
    refetch,
  }
}
