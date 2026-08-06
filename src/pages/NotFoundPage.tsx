import { Link } from 'react-router'
import { Brand } from '../components/Brand.tsx'

export function NotFoundPage() {
  return (
    <main className="not-found">
      <Brand />
      <span className="eyebrow">Erro 404</span>
      <h1>Página não encontrada</h1>
      <p>O endereço informado não existe ou foi alterado.</p>
      <Link className="button button--primary" to="/">
        Voltar ao início
      </Link>
    </main>
  )
}
