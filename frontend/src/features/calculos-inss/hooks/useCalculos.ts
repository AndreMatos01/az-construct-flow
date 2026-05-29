import { useQuery } from '@tanstack/react-query'
import { mensagemErroApi } from '@/shared/lib/apiError'
import { calculosKeys } from '@/shared/lib/queryKeys'
import { fetchCalculos } from '../api/calculosApi'

export function useCalculos() {
  const query = useQuery({
    queryKey: calculosKeys.all,
    queryFn: fetchCalculos,
  })

  return {
    calculos: query.data ?? [],
    loading: query.isFetching,
    error: query.isError ? mensagemErroApi(query.error) : null,
  }
}
