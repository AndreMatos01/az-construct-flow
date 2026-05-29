import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { fatorEsocialKeys } from '@/shared/lib/queryKeys'
import {
  createSimulacao,
  deleteRegistro,
  fetchFatorEsocial,
  updateRegistro,
} from '../api/fatorEsocialApi'
import type {
  AtualizarRegistroPayload,
  CriarSimulacaoPayload,
} from '../types/fatorEsocial.types'

export function useFatorEsocial() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => window.clearTimeout(t)
  }, [search])

  const params = { q: debouncedSearch, page, perPage }
  const query = useQuery({
    queryKey: fatorEsocialKeys.list(params),
    queryFn: () => fetchFatorEsocial(params),
    placeholderData: keepPreviousData,
  })

  const rows = query.data?.items ?? []
  const total = query.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(page, totalPages)

  const queryError = query.isError
    ? 'Não foi possível carregar os registros do eSocial.'
    : null

  function invalidateLista() {
    return queryClient.invalidateQueries({ queryKey: fatorEsocialKeys.all })
  }

  const criarMut = useMutation({
    mutationFn: createSimulacao,
    onSuccess: invalidateLista,
  })

  const atualizarMut = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AtualizarRegistroPayload }) =>
      updateRegistro(id, payload),
    onSuccess: invalidateLista,
  })

  const deletarMut = useMutation({
    mutationFn: deleteRegistro,
    onSuccess: invalidateLista,
  })

  async function criar(payload: CriarSimulacaoPayload): Promise<boolean> {
    setError(null)
    try {
      await criarMut.mutateAsync(payload)
      return true
    } catch (e) {
      console.error('Erro ao criar POST /fator-esocial', e)
      setError('Não foi possível salvar a simulação.')
      return false
    }
  }

  async function atualizar(
    id: number,
    payload: AtualizarRegistroPayload,
  ): Promise<boolean> {
    setError(null)
    try {
      await atualizarMut.mutateAsync({ id, payload })
      return true
    } catch (e) {
      console.error('Erro ao editar PUT /fator-esocial/{id}', e)
      setError('Não foi possível salvar a edição.')
      return false
    }
  }

  async function deletar(id: number): Promise<boolean> {
    setError(null)
    try {
      await deletarMut.mutateAsync(id)
      return true
    } catch (e) {
      console.error('Erro ao deletar DELETE /fator-esocial/{id}', e)
      setError('Não foi possível deletar o registro.')
      return false
    }
  }

  const loading =
    query.isFetching ||
    criarMut.isPending ||
    atualizarMut.isPending ||
    deletarMut.isPending

  return {
    search,
    setSearch,
    perPage,
    setPerPage,
    page,
    setPage,
    loading,
    error: error ?? queryError,
    setError,
    rows,
    total,
    totalPages,
    safePage,
    carregar: () => void query.refetch(),
    criar,
    atualizar,
    deletar,
  }
}
