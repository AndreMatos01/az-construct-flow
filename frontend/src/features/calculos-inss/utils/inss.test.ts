import { describe, expect, it } from 'vitest'
import { calcularInssObra, calcularRestituicaoInss } from './inss'

describe('calcularInssObra', () => {
  it('usa os percentuais padrão (40% base, 11% alíquota)', () => {
    const r = calcularInssObra({ valorContrato: 1000 })
    expect(r.valorConsiderado).toBe(1000)
    expect(r.baseInss).toBe(400)
    expect(r.inss).toBe(44)
  })

  it('segrega materiais do valor considerado', () => {
    const r = calcularInssObra({ valorContrato: 1000, valorMateriais: 200 })
    expect(r.valorConsiderado).toBe(800)
    expect(r.baseInss).toBe(320)
    expect(r.inss).toBeCloseTo(35.2, 2)
  })

  it('nunca retorna valores negativos', () => {
    const r = calcularInssObra({ valorContrato: 100, valorMateriais: 500 })
    expect(r.valorConsiderado).toBe(0)
    expect(r.baseInss).toBe(0)
    expect(r.inss).toBe(0)
  })

  it('respeita percentuais customizados', () => {
    const r = calcularInssObra({
      valorContrato: 2000,
      percentualBase: 50,
      aliquotaInss: 20,
    })
    expect(r.baseInss).toBe(1000)
    expect(r.inss).toBe(200)
  })
})

describe('calcularRestituicaoInss', () => {
  it('calcula a partir apenas do valor do contrato', () => {
    expect(calcularRestituicaoInss(1000)).toBe(44)
  })
})
