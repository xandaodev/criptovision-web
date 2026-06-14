import { useState } from 'react';

function SimuladorLucro({ ativos }) {
  const [ticker, setTicker] = useState('');
  const [precoFicticio, setPrecoFicticio] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const handleSimular = async (e) => {
    e.preventDefault();
    if (!ticker) return alert("Seleciona um ativo para simular!");
    
    setCarregando(true);
    const token = localStorage.getItem('token');
    
    try {
      const resposta = await fetch(`http://localhost:8080/carteira/simulador/venda?ticker=${ticker}&precoAlvo=${precoFicticio}`, {
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
    setPrecoFicticio('');
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden mb-10">
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-green-900/40">
        <h2 className="text-xl font-bold text-green-400">🚀 Simulador de Lucro (Alvo de Venda)</h2>
        <p className="text-sm text-gray-400 mt-1">Descobre quanto vais ganhar se o teu ativo atingir um preço específico.</p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário de Simulação */}
        <div>
          <form onSubmit={handleSimular} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Moeda da tua Carteira</label>
              <select 
                className="w-full bg-gray-900 border border-gray-700 text-white rounded p-3 focus:outline-none focus:border-green-500"
                value={ticker} onChange={(e) => setTicker(e.target.value)} required
              >
                <option value="">Selecione um ativo...</option>
                {ativos.map(a => <option key={a.ticker} value={a.ticker}>{a.ticker}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-1">Preço Alvo Desejado ($)</label>
              <input 
                type="number" step="any" required placeholder="Ex: 100000"
                className="w-full bg-gray-900 border border-gray-700 text-white rounded p-3 focus:outline-none focus:border-green-500"
                value={precoFicticio} onChange={(e) => setPrecoFicticio(e.target.value)}
              />
            </div>

            <button 
              type="submit" disabled={carregando}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition duration-200 mt-2"
            >
              {carregando ? 'A calcular fortuna...' : 'Projetar Lucros'}
            </button>
          </form>
        </div>

        {/* Ecrã de Resultados */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 flex flex-col justify-center">
          {resultado ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-gray-700 pb-2">Se venderes tudo a ${Number(precoFicticio).toLocaleString('en-US')}:</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-xs uppercase">Valor Total (Hoje)</p>
                  <p className="text-lg text-white font-bold">$ {resultado.valorTotalAtual.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase text-green-400">Valor Total (Alvo)</p>
                  <p className="text-xl text-green-400 font-bold">$ {resultado.valorTotalFicticio.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Lucro Líquido</p>
                  <p className={`text-md font-bold ${resultado.lucroEstimado >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {resultado.lucroEstimado >= 0 ? '+' : ''}$ {resultado.lucroEstimado.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Percentagem de PNL</p>
                  <p className={`text-md font-bold ${resultado.porcentagemLucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {resultado.porcentagemLucro >= 0 ? '↑' : '↓'} {resultado.porcentagemLucro.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <button onClick={limparSimulacao} className="text-gray-500 hover:text-white text-sm underline mt-4">
                Limpar Projeção
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <span className="text-4xl block mb-3">💸</span>
              Escolhe o ativo e diz-nos por quanto queres vendê-lo. Nós calculamos o resto.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SimuladorLucro;