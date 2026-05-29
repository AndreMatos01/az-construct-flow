import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { calculoSeroKeys } from '@/shared/lib/queryKeys'
import {
  deleteCalculoSero,
  fetchCalculoSero,
  simularSero,
  updateCalculoSero,
} from '../api/calculoSeroApi'
import type {
  CalculoSeroFiltros,
  CalculoSeroPayload,
  CalculoSeroRow,
} from '../types/calculoSero.types'

const FILTROS_VAZIOS: CalculoSeroFiltros = {
  nomeObra: '',
  nomeCliente: '',
  cpf: '',
  telefone: '',
}

export function useCalculoSero() {
  const queryClient = useQueryClient()
  const [filtros, setFiltros] = useState<CalculoSeroFiltros>(FILTROS_VAZIOS)
  const [filtrosAtivos, setFiltrosAtivos] =
    useState<CalculoSeroFiltros>(FILTROS_VAZIOS)
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => {
      setFiltrosAtivos(filtros)
      setPage(1)
    }, 350)
    return () => window.clearTimeout(t)
  }, [filtros])

  const params = { ...filtrosAtivos, page, perPage }
  const query = useQuery({
    queryKey: calculoSeroKeys.list(params),
    queryFn: () => fetchCalculoSero(params),
    placeholderData: keepPreviousData,
  })

  const rows = query.data?.items ?? []
  const total = query.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(page, totalPages)

  const queryError = query.isError
    ? 'Não foi possível carregar os cálculos SERO.'
    : null

  function invalidateLista() {
    return queryClient.invalidateQueries({ queryKey: calculoSeroKeys.all })
  }

  const simularMut = useMutation({
    mutationFn: simularSero,
    onSuccess: invalidateLista,
  })

  const atualizarMut = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CalculoSeroPayload }) =>
      updateCalculoSero(id, payload),
    onSuccess: invalidateLista,
  })

  const deletarMut = useMutation({
    mutationFn: deleteCalculoSero,
    onSuccess: invalidateLista,
  })

  async function simular(
    payload: CalculoSeroPayload,
  ): Promise<CalculoSeroRow | null> {
    setError(null)
    try {
      return await simularMut.mutateAsync(payload)
    } catch (e) {
      console.error('Erro ao simular POST /calculo-sero', e)
      setError('Não foi possível calcular. Verifique os dados informados.')
      return null
    }
  }

  async function atualizar(
    id: number,
    payload: CalculoSeroPayload,
  ): Promise<boolean> {
    setError(null)
    try {
      await atualizarMut.mutateAsync({ id, payload })
      return true
    } catch (e) {
      console.error('Erro ao editar PUT /calculo-sero/{id}', e)
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
      console.error('Erro ao deletar DELETE /calculo-sero/{id}', e)
      setError('Não foi possível deletar o registro.')
      return false
    }
  }

  function setFiltro(campo: keyof CalculoSeroFiltros, valor: string) {
    setFiltros((f) => ({ ...f, [campo]: valor }))
  }

  const loading =
    query.isFetching ||
    simularMut.isPending ||
    atualizarMut.isPending ||
    deletarMut.isPending

  return {
    filtros,
    setFiltro,
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
    buscar: () => void query.refetch(),
    simular,
    atualizar,
    deletar,
    simulando: simularMut.isPending,
  }
}
