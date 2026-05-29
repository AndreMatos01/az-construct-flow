import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormField } from './FormField'

describe('FormField', () => {
  it('renderiza o label e os filhos', () => {
    render(
      <FormField label="Nome">
        <input aria-label="campo-nome" />
      </FormField>,
    )
    expect(screen.getByText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('campo-nome')).toBeInTheDocument()
  })

  it('exibe a mensagem de erro com role alert', () => {
    render(
      <FormField label="E-mail" error="E-mail inválido">
        <input />
      </FormField>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('E-mail inválido')
  })

  it('não renderiza alerta quando não há erro', () => {
    render(
      <FormField label="Telefone">
        <input />
      </FormField>,
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
