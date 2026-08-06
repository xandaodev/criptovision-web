import { useQuery } from '@tanstack/react-query'
import { sessionService } from '../services/session-service.ts'
import { getApiErrorMessage } from '../services/api-error.ts'

export function DashboardPage() {
  const sessionQuery = useQuery({
    queryKey: ['session-validation'],
    queryFn: sessionService.validate,
  })

  return (
    <section className="dashboard-placeholder">
      <span className="eyebrow">Área protegida</span>
      <h1>Seu novo dashboard começa aqui.</h1>
      <p>
        A autenticação já está conectada à API. Na próxima etapa, esta tela receberá
        transações, patrimônio, PNL e a composição da carteira.
      </p>

      <div className="session-card">
        <span className={`status-dot ${sessionQuery.isError ? 'status-dot--error' : ''}`} />
        <div>
          <strong>
            {sessionQuery.isPending && 'Validando sua sessão...'}
            {sessionQuery.isSuccess && 'Sessão validada pela API'}
            {sessionQuery.isError && 'API indisponível'}
          </strong>
          <small>
            {sessionQuery.isError
              ? getApiErrorMessage(sessionQuery.error)
              : 'Seu token está sendo enviado somente para endpoints protegidos.'}
          </small>
        </div>
      </div>
    </section>
  )
}
