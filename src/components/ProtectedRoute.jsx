import { Navigate } from 'react-router-dom';

// Este componente envolve as páginas que precisam de autenticação
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // Se não houver token no cofre do navegador, barra o acesso
  if (!token) {
    // Redireciona para o login (/) e limpa o histórico de navegação (replace)
    return <Navigate to="/" replace />;
  }

  // Se o token existir, renderiza a página protegida normalmente
  return children;
}

export default ProtectedRoute;