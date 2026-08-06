import { apiRequest } from './api-client.ts'

export const sessionService = {
  validate() {
    return apiRequest<unknown[]>('/transacoes')
  },
}
