export const REFRESH_CALCULOS_EVENT = 'azcf:refresh-calculos'

export function requestRefreshCalculos() {
  window.dispatchEvent(new CustomEvent(REFRESH_CALCULOS_EVENT))
}

export function subscribeRefreshCalculos(handler: () => void) {
  window.addEventListener(REFRESH_CALCULOS_EVENT, handler)
  return () => window.removeEventListener(REFRESH_CALCULOS_EVENT, handler)
}
