import { useLocation } from 'react-router-dom'
import { getDefaultRoute, findRouteByPath } from '../routes/config'

export function useActiveRoute() {
  const { pathname } = useLocation()
  return findRouteByPath(pathname) ?? getDefaultRoute()
}
