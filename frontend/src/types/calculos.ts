export type CalculoDto = {
  id?: number
  nomeObra: string
  valorContrato: number
  /** Materiais segregados no contrato (R$). */
  valorMateriais?: number | null
  /** % de incidência sobre o valor considerado (ex.: 40). */
  percentualBase?: number | null
  /** % de retenção sobre a base (ex.: 11). */
  aliquotaInss?: number | null
  baseInss?: number | null
  inssEstimado?: number
  dataCriacao?: string
}
