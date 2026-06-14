import { useState } from 'react';

function Simulador({ ativos }) {
  const [ticker, setTicker] = useState('');
  const [aporte, setAporte] = useState('');
  const [preco, setPreco] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const handleSimular = async (e) => {
    e.preventDefault();
    if (!ticker) return alert("Seleciona um ativo para simular!");
    
    setCarregando(true);
    const token = localStorage.getItem('token');
    
    try {
      const resposta = await fetch(`http://localhost:8080/carteira/simulador/dca?ticker=${ticker}&aporte=${aporte}&preco=${preco}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (resposta.ok) {
        const dados = await resposta.json();
        setResultado(dados);
      } else {
        alert("Erro ao realizar a simulação.");
      }
    } catch (erro) {
      console.error("Erro:", erro);
      alert("Servidor indisponível.");
    } finally {
      setCarregando(false);
    }
  };

  const limparSimulacao = () => {
    setResultado(null);
    setAporte('');
    setPreco('');
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden mb-10">
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
        <h2 className="text-xl font-bold text-blue-400">🔮 Simulador de Aportes (DCA)</h2>
        <p className="text-sm text-gray-400 mt-1">Descobre o impacto de uma nova compra no teu Preço Médio (PM).</p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário de Simulação */}
        <div>
          <form onSubmit={handleSimular} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Moeda da tua Carteira</label>
              <select 
                className="w-full bg-gray-900 border border-gray-700 text-white rounded p-3 focus:outline-none focus:border-blue-500"
                value={ticker} onChange={(e) => setTicker(e.target.value)} required
              >
                <option value="">Selecione um ativo...</option>
                {ativos.map(a => <option key={a.ticker} value={a.ticker}>{a.ticker}</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Valor do Aporte ($)</label>
                <input 
                  type="number" step="any" required placeholder="Ex: 500"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded p-3 focus:outline-none focus:border-blue-500"
                  value={aporte} onChange={(e) => setAporte(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Preço Alvo do Mercado ($)</label>
                <input 
                  type="number" step="any" required placeholder="Ex: 80000"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded p-3 focus:outline-none focus:border-blue-500"
                  value={preco} onChange={(e) => setPreco(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" disabled={carregando}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-200"
            >
              {carregando ? 'A processar...' : 'Simular Agora'}
            </button>
          </form>
        </div>

        {/* Ecrã de Resultados */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 flex flex-col justify-center">
          {resultado ? (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-bold text-white border-b border-gray-700 pb-2">Projeção da Operação</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-xs uppercase">O teu PM Atual</p>
                  <p className="text-lg text-white font-bold">$ {resultado.pmAtual.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase text-blue-400">Novo PM Projetado</p>
                  <p className="text-xl text-blue-400 font-bold">$ {resultado.novoPM.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Quantidade Simulada</p>
                  <p className="text-md text-white">+{resultado.qtdComprada.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Variação do PM</p>
                  <p className={`text-md font-bold ${resultado.diferencaPM < 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {resultado.diferencaPM < 0 ? '↓' : '↑'} {Math.abs(resultado.diferencaPM).toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <button onClick={limparSimulacao} className="text-gray-500 hover:text-white text-sm underline mt-4">
                Limpar Resultados
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <span className="text-4xl block mb-3">🧮</span>
              Preenche os dados e clica em Simular para veres como esta compra vai afetar a tua carteira.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Simulador;