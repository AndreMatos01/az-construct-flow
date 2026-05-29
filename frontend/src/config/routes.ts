import {
  Calculator,
  FileSliders,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'

export type RouteId = 'dash' | 'inss-obras' | 'fator-esocial'

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
    id: 'dash',
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    group: 'root',
  },
  {
    id: 'inss-obras',
    path: '/obras',
    label: 'Obras contratuais',
    icon: Calculator,
    group: 'simuladores',
    navVariant: 'neutral',
  },
  {
    id: 'fator-esocial',
    path: '/esocial',
    label: 'Fator de Ajuste eSocial',
    icon: FileSliders,
    group: 'simuladores',
  },
]

export const DEFAULT_ROUTE_PATH = '/obras'

export const ROOT_ROUTES = ROUTES.filter((r) => r.group === 'root')
export const SIMULADOR_ROUTES = ROUTES.filter((r) => r.group === 'simuladores')

export function findRouteByPath(pathname: string): RouteConfig | undefined {
  return ROUTES.find((r) => r.path === pathname)
}

export function getDefaultRoute(): RouteConfig {
  return findRouteByPath(DEFAULT_ROUTE_PATH) ?? ROUTES[1]
}
