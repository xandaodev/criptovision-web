import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { ApiErrorAlert } from '../components/ApiErrorAlert.tsx'
import { AuthLayout } from '../components/AuthLayout.tsx'
import {
  loginSchema,
  type LoginFormData,
} from '../features/auth/auth-schemas.ts'
import { useAuth } from '../features/auth/useAuth.ts'
import { authService } from '../services/auth-service.ts'
import { getApiErrorMessage } from '../services/api-error.ts'

type LoginLocationState = {
  registeredLogin?: string
  from?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LoginLocationState | null
  const { signIn } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: '', senha: '' },
  })

  useEffect(() => {
    if (state?.registeredLogin) {
      setValue('login', state.registeredLogin)
    }
  }, [setValue, state?.registeredLogin])

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: ({ token }) => {
      signIn(token)
      navigate(state?.from ?? '/app/dashboard', { replace: true })
    },
  })

  const onSubmit = handleSubmit((data) => loginMutation.mutate(data))

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-card__heading">
          <span className="eyebrow">Bem-vindo de volta</span>
          <h2>Acesse sua conta</h2>
          <p>Entre para acompanhar suas operações e sua carteira.</p>
        </div>

        {state?.registeredLogin && (
          <div className="alert alert--success" role="status">
            <strong>Cadastro concluído</strong>
            <span>Agora entre com suas novas credenciais.</span>
          </div>
        )}

        {loginMutation.isError && (
          <ApiErrorAlert message={getApiErrorMessage(loginMutation.error)} />
        )}

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label className="field">
            <span>Login</span>
            <input
              type="text"
              autoComplete="username"
              placeholder="seu.login"
              aria-invalid={Boolean(errors.login)}
              {...register('login')}
            />
            {errors.login && <small className="field__error">{errors.login.message}</small>}
          </label>

          <label className="field">
            <span>Senha</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              aria-invalid={Boolean(errors.senha)}
              {...register('senha')}
            />
            {errors.senha && <small className="field__error">{errors.senha.message}</small>}
          </label>

          <button
            className="button button--primary button--full"
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-card__switch">
          Ainda não possui uma conta? <Link to="/cadastro">Criar conta</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
