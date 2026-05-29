import { describe, expect, it } from 'vitest'
import { brl, parsePtBrNumber } from './format'

describe('parsePtBrNumber', () => {
  it('interpreta separadores pt-BR (milhar e decimal)', () => {
    expect(parsePtBrNumber('1.234,56')).toBe(1234.56)
  })

  it('interpreta número simples com vírgula', () => {
    expect(parsePtBrNumber('10,5')).toBe(10.5)
  })

  it('retorna NaN para entrada inválida', () => {
    expect(parsePtBrNumber('abc')).toBeNaN()
  })
})

describe('brl', () => {
  it('formata como moeda brasileira', () => {
    // \u00a0 é o espaço não separável usado pelo Intl entre R$ e o valor.
    expect(brl.format(1234.5).replace(/\u00a0/g, ' ')).toBe('R$ 1.234,50')
  })
})
