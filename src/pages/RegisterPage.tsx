import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { ApiErrorAlert } from '../components/ApiErrorAlert.tsx'
import { AuthLayout } from '../components/AuthLayout.tsx'
import {
  registerSchema,
  type RegisterFormData,
} from '../features/auth/auth-schemas.ts'
import { authService } from '../services/auth-service.ts'
import { ApiError, getApiErrorMessage } from '../services/api-error.ts'

export function RegisterPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { login: '', senha: '', confirmarSenha: '' },
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: ({ login }) => {
      navigate('/login', { replace: true, state: { registeredLogin: login } })
    },
    onError: (error) => {
      if (!(error instanceof ApiError)) {
        return
      }

      for (const fieldError of error.problem?.erros ?? []) {
        if (fieldError.campo === 'login' || fieldError.campo === 'senha') {
          setError(fieldError.campo, { message: fieldError.mensagem })
        }
      }
    },
  })

  const onSubmit = handleSubmit(({ login, senha }) =>
    registerMutation.mutate({ login, senha }),
  )

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-card__heading">
          <span className="eyebrow">Comece agora</span>
          <h2>Crie sua conta</h2>
          <p>Use um login único para proteger o acesso aos seus dados.</p>
        </div>

        {registerMutation.isError && (
          <ApiErrorAlert message={getApiErrorMessage(registerMutation.error)} />
        )}

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label className="field">
            <span>Login</span>
            <input
              type="text"
              autoComplete="username"
              placeholder="alexandre.dev"
              aria-invalid={Boolean(errors.login)}
              {...register('login')}
            />
            {errors.login && <small className="field__error">{errors.login.message}</small>}
          </label>

          <label className="field">
            <span>Senha</span>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="No mínimo 8 caracteres"
              aria-invalid={Boolean(errors.senha)}
              {...register('senha')}
            />
            {errors.senha && <small className="field__error">{errors.senha.message}</small>}
          </label>

          <label className="field">
            <span>Confirmar senha</span>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Repita sua senha"
              aria-invalid={Boolean(errors.confirmarSenha)}
              {...register('confirmarSenha')}
            />
            {errors.confirmarSenha && (
              <small className="field__error">{errors.confirmarSenha.message}</small>
            )}
          </label>

          <button
            className="button button--primary button--full"
            type="submit"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-card__switch">
          Já possui uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
