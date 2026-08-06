export type FieldError = {
  campo: string
  mensagem: string
}

export type ProblemDetail = {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  dataHora?: string
  erros?: FieldError[]
}

export class ApiError extends Error {
  readonly status: number
  readonly problem: ProblemDetail | null

  constructor(status: number, problem: ProblemDetail | null) {
    super(problem?.detail ?? problem?.title ?? 'Não foi possível concluir a operação.')
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof TypeError) {
    return 'Não foi possível conectar à API. Verifique se o backend está em execução.'
  }

  return 'Ocorreu um erro inesperado. Tente novamente.'
}
