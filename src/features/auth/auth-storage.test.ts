import { describe, expect, it } from 'vitest'
import { authStorage } from './auth-storage.ts'

describe('authStorage', () => {
  it('salva, recupera e remove o token', () => {
    authStorage.setToken('token-de-teste')
    expect(authStorage.getToken()).toBe('token-de-teste')

    authStorage.clearToken()
    expect(authStorage.getToken()).toBeNull()
  })
})
