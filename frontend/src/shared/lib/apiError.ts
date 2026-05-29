import axios from 'axios'

export function mensagemErroApi(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const st = e.response?.status
    if (st === 404) {
      return 'A API respondeu 404. Em produção na Vercel, defina a variável VITE_API_BASE_URL com a URL pública do backend (ex.: https://seu-app.onrender.com), sem barra no final, e faça um novo deploy.'
    }
    if (st != null) {
      return `A API respondeu HTTP ${st}. Confira se o backend está no ar e se o CORS no Quarkus inclui este domínio.`
    }
    if (e.code === 'ERR_NETWORK') {
      return 'Não foi possível alcançar a API (rede/CORS). Defina VITE_API_BASE_URL na Vercel apontando para o Render e inclua este site em CORS_ORIGINS no backend.'
    }
    return e.message || 'Erro ao falar com a API.'
  }
  return 'Erro ao falar com a API.'
}
