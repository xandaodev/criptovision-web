import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos o motorista

function Login() {
  // O React usa "Estados" para guardar o que o usuário digita em tempo real
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate();

  // Função que será chamada quando o usuário clicar no botão "Entrar"
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const resposta = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: login, senha: senha })
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        localStorage.setItem('token', dados.token);
        
        // A MÁGICA ACONTECE AQUI: Redireciona para o Dashboard!
        navigate('/dashboard'); 
      } else {
        alert("Acesso Negado: Usuário ou senha incorretos!");
      }
    } catch (erro) {
      console.error("O servidor não respondeu:", erro);
      alert("Erro ao tentar conectar com a API.");
    }
  }

  return (
    // Fundo da tela toda escura e centralizando o conteúdo
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500 mb-2">CriptoVision</h1>
          <p className="text-gray-400">Acesse sua carteira de investimentos</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Campo de Usuário */}
          <div>
            <label className="block text-gray-300 mb-2">Usuário</label>
            <input
              type="text"
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu usuário"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          {/* Campo de Senha */}
          <div>
            <label className="block text-gray-300 mb-2">Senha</label>
            <input
              type="password"
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-200"
          >
            Entrar
          </button>

        </form>
      </div>
    </div>
  )
}

export default Login;