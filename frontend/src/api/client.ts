import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

if (import.meta.env.PROD && typeof window !== 'undefined') {
  const host = window.location.hostname
  const isStaticHost =
    host.endsWith('vercel.app') ||
    host.endsWith('netlify.app') ||
    host === 'pages.dev'
  if (isStaticHost && baseURL === '/api') {
    // eslint-disable-next-line no-console
    console.warn(
      '[AZ ConstructFlow] Em produção no host estático, /api não existe. Defina VITE_API_BASE_URL na Vercel (URL HTTPS do Quarkus no Render) e faça redeploy.',
    )
  }
}

