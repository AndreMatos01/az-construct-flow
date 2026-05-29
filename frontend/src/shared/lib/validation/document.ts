/** Remove tudo que não for dígito. */
export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, '')
}

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export function validarEmail(email: string): boolean {
  const t = email.trim()
  if (!t) return true
  return EMAIL_RE.test(t)
}

function calcularDigitoCpf(base: string, pesos: number[]): number {
  const soma = base
    .split('')
    .reduce((acc, dig, i) => acc + Number(dig) * pesos[i], 0)
  const resto = soma % 11
  return resto < 2 ? 0 : 11 - resto
}

/** Valida CPF (11 dígitos, com dígitos verificadores). */
export function validarCpf(cpf: string): boolean {
  const d = apenasDigitos(cpf)
  if (d.length !== 11) return false
  if (/^(\d)\1{10}$/.test(d)) return false

  const digito1 = calcularDigitoCpf(d.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2])
  const digito2 = calcularDigitoCpf(d.slice(0, 9) + digito1, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2])
  return d.endsWith(`${digito1}${digito2}`)
}

function calcularDigitoCnpj(base: string, pesos: number[]): number {
  const soma = base
    .split('')
    .reduce((acc, dig, i) => acc + Number(dig) * pesos[i], 0)
  const resto = soma % 11
  return resto < 2 ? 0 : 11 - resto
}

/** Valida CNPJ (14 dígitos, com dígitos verificadores). */
export function validarCnpj(cnpj: string): boolean {
  const d = apenasDigitos(cnpj)
  if (d.length !== 14) return false
  if (/^(\d)\1{13}$/.test(d)) return false

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const digito1 = calcularDigitoCnpj(d.slice(0, 12), pesos1)
  const digito2 = calcularDigitoCnpj(d.slice(0, 12) + digito1, pesos2)
  return d.endsWith(`${digito1}${digito2}`)
}

export type ResultadoDocumento =
  | { ok: true; tipo: 'CPF' | 'CNPJ' }
  | { ok: false; mensagem: string }

/** Aceita CPF (11) ou CNPJ (14) com validação de dígitos. */
export function validarDocumentoCpfOuCnpj(documento: string): ResultadoDocumento {
  const d = apenasDigitos(documento)
  if (!d) {
    return { ok: false, mensagem: 'Este campo é obrigatório' }
  }
  if (d.length === 11) {
    return validarCpf(documento)
      ? { ok: true, tipo: 'CPF' }
      : { ok: false, mensagem: 'CPF inválido' }
  }
  if (d.length === 14) {
    return validarCnpj(documento)
      ? { ok: true, tipo: 'CNPJ' }
      : { ok: false, mensagem: 'CNPJ inválido' }
  }
  if (d.length < 11) {
    return { ok: false, mensagem: 'CPF incompleto (11 dígitos)' }
  }
  if (d.length > 11 && d.length < 14) {
    return { ok: false, mensagem: 'CNPJ incompleto (14 dígitos)' }
  }
  return { ok: false, mensagem: 'Informe um CPF ou CNPJ válido' }
}
