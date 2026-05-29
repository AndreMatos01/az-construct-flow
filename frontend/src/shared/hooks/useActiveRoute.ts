import { useLocation } from 'react-router-dom'
import { findRouteByPath, getDefaultRoute } from '@/config/routes'

export function useActiveRoute() {
  const { pathname } = useLocation()
  return findRouteByPath(pathname) ?? getDefaultRoute()
}
