import { apiRequest } from './api-client.ts'

export type LoginRequest = {
  login: string
  senha: string
}

export type LoginResponse = {
  token: string
}

export type RegisterRequest = LoginRequest

export type RegisterResponse = {
  id: number
  login: string
}

export const authService = {
  login(data: LoginRequest) {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: data,
      authenticated: false,
    })
  },

  register(data: RegisterRequest) {
    return apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: data,
      authenticated: false,
    })
  },
}
