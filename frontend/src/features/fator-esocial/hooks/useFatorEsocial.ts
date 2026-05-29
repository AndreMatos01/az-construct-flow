import { useCallback, useEffect, useState } from 'react'
import {
  createSimulacao,
  deleteRegistro,
  fetchFatorEsocial,
  updateRegistro,
} from '../api/fatorEsocialApi'
import type {
  AtualizarRegistroPayload,
  CriarSimulacaoPayload,
  FatorESocialRow,
} from '../types/fatorEsocial.types'

export function useFatorEsocial() {
  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<FatorESocialRow[]>([])
  const [total, setTotal] = useState(0)

  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(page, totalPages)

  const carregar = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await fetchFatorEsocial({ q: search, page: safePage, perPage })
      setRows(data.items)
      setTotal(data.total)
    } catch (e) {
      console.error('Erro ao carregar /fator-esocial', e)
      setError('Não foi possível carregar os registros do eSocial.')
      setRows([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [search, safePage, perPage])

  useEffect(() => {
    // Busca os dados quando a paginação muda; o setState aqui é intencional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage, safePage])

  useEffect(() => {
    const t = window.setTimeout(() => {
      setPage(1)
      void carregar()
    }, 350)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const criar = useCallback(
    async (payload: CriarSimulacaoPayload): Promise<boolean> => {
      setError(null)
      setLoading(true)
      try {
        await createSimulacao(payload)
        await carregar()
        return true
      } catch (e) {
        console.error('Erro ao criar POST /fator-esocial', e)
        setError('Não foi possível salvar a simulação.')
        return false
      } finally {
        setLoading(false)
      }
    },
    [carregar],
  )

  const atualizar = useCallback(
    async (id: number, payload: AtualizarRegistroPayload): Promise<boolean> => {
      setError(null)
      setLoading(true)
      try {
        await updateRegistro(id, payload)
        await carregar()
        return true
      } catch (e) {
        console.error('Erro ao editar PUT /fator-esocial/{id}', e)
        setError('Não foi possível salvar a edição.')
        return false
      } finally {
        setLoading(false)
      }
    },
    [carregar],
  )

  const deletar = useCallback(
    async (id: number): Promise<boolean> => {
      setError(null)
      setLoading(true)
      try {
        await deleteRegistro(id)
        await carregar()
        return true
      } catch (e) {
        console.error('Erro ao deletar DELETE /fator-esocial/{id}', e)
        setError('Não foi possível deletar o registro.')
        return false
      } finally {
        setLoading(false)
      }
    },
    [carregar],
  )

  return {
    search,
    setSearch,
    perPage,
    setPerPage,
    page,
    setPage,
    loading,
    error,
    setError,
    rows,
    total,
    totalPages,
    safePage,
    carregar,
    criar,
    atualizar,
    deletar,
  }
}
