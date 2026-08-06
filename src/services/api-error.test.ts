import { describe, expect, it } from 'vitest'
import { ApiError, getApiErrorMessage } from './api-error.ts'

describe('getApiErrorMessage', () => {
  it('prioriza o detalhe retornado pela API', () => {
    const error = new ApiError(401, {
      title: 'Não autorizado',
      detail: 'Login ou senha inválidos.',
    })

    expect(getApiErrorMessage(error)).toBe('Login ou senha inválidos.')
  })

  it('explica falhas de conexão', () => {
    expect(getApiErrorMessage(new TypeError('Failed to fetch'))).toContain(
      'conectar à API',
    )
  })
})
