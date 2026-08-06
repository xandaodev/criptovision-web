import type { PropsWithChildren } from 'react'
import { Brand } from './Brand.tsx'

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="auth-shell">
      <section className="auth-intro" aria-label="Apresentação do CriptoVision">
        <Brand />
        <div className="auth-intro__content">
          <span className="eyebrow">Seu patrimônio, com contexto</span>
          <h1>Transforme operações em decisões mais claras.</h1>
          <p>
            Registre compras e vendas, acompanhe sua posição e entenda a evolução
            da sua carteira em uma experiência simples e segura.
          </p>
          <div className="feature-list" aria-label="Recursos da plataforma">
            <span>Histórico centralizado</span>
            <span>Preço médio e PNL</span>
            <span>Dados isolados por usuário</span>
          </div>
        </div>
        <p className="auth-intro__footer">CriptoVision · Projeto de portfólio</p>
      </section>

      <section className="auth-panel">
        <div className="auth-panel__mobile-brand">
          <Brand />
        </div>
        {children}
      </section>
    </main>
  )
}
