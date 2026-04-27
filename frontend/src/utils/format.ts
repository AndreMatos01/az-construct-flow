export const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function parsePtBrNumber(s: string) {
  const raw = s.replace(/\./g, '').replace(',', '.').trim()
  const n = Number(raw)
  return Number.isFinite(n) ? n : NaN
}

