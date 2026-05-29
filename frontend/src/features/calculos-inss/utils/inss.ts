const DEFAULT_PCT_BASE = 40
const DEFAULT_ALIQUOTA = 11

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export type InssObraInput = {
  valorContrato: number
  valorMateriais?: number
  percentualBase?: number
  aliquotaInss?: number
}

export type InssObraResult = {
  valorConsiderado: number
  baseInss: number
  inss: number
}

/**
 * INSS obra civil — regra geral: alíquota sobre a base (padrão 11% × 40% do valor considerado).
 * Valor considerado = contrato − materiais segregados (≥ 0).
 */
export function calcularInssObra(input: InssObraInput): InssObraResult {
  const vc = Math.max(0, input.valorContrato)
  const mat = Math.max(0, input.valorMateriais ?? 0)
  const considerado = Math.max(0, vc - mat)
  const pct = (input.percentualBase ?? DEFAULT_PCT_BASE) / 100
  const ali = (input.aliquotaInss ?? DEFAULT_ALIQUOTA) / 100
  const base = round2(considerado * pct)
  const inss = round2(base * ali)
  return { valorConsiderado: round2(considerado), baseInss: base, inss }
}

/** Compatibilidade: apenas valor do contrato, sem materiais, percentuais padrão. */
export function calcularRestituicaoInss(valorContrato: number): number {
  return calcularInssObra({ valorContrato }).inss
}
