const ALIQUOTA_INSS = 0.11
const PERCENTUAL_BASE = 0.4

export const calcularRestituicaoInss = (valorContrato: number) =>
  valorContrato * PERCENTUAL_BASE * ALIQUOTA_INSS

