import { Coins, FileSliders, type LucideIcon } from 'lucide-react'

export type RouteId = 'fator-esocial' | 'calculo-sero'

export type RouteConfig = {
  id: RouteId
  path: string
  label: string
  icon: LucideIcon
  group: 'root' | 'simuladores'
  navVariant?: 'sky' | 'neutral'
}

export const ROUTES: RouteConfig[] = [
  {
    id: 'fator-esocial',
    path: '/esocial',
    label: 'Fator de Ajuste eSocial',
    icon: FileSliders,
    group: 'simuladores',
  },
  {
    id: 'calculo-sero',
    path: '/sero',
    label: 'Valor SERO',
    icon: Coins,
    group: 'simuladores',
  },
]

export const DEFAULT_ROUTE_PATH = '/sero'

export const ROOT_ROUTES = ROUTES.filter((r) => r.group === 'root')
export const SIMULADOR_ROUTES = ROUTES.filter((r) => r.group === 'simuladores')

export function findRouteByPath(pathname: string): RouteConfig | undefined {
  return ROUTES.find((r) => r.path === pathname)
}

export function getDefaultRoute(): RouteConfig {
  return findRouteByPath(DEFAULT_ROUTE_PATH) ?? ROUTES[0]
}
