export type ClienteOption = {
  value: string
  label: string
}

/** Clientes mock até existir API de cadastro. */
export const CLIENTES_MOCK: ClienteOption[] = [
  { value: '1', label: 'João da Silva — CPF ***' },
  { value: '2', label: 'Construtora Alfa Ltda — CNPJ ***' },
  { value: '3', label: 'Maria Oliveira — CPF ***' },
]
