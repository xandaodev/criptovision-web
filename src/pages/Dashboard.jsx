import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Importando seus componentes
import Extrato from '../components/Extrato';
import Simulador from '../components/Simulador';
import SimuladorLucro from '../components/SimuladorLucro';

function Dashboard() {
  const navigate = useNavigate();
  const [dadosCarteira, setDadosCarteira] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const [abaAtiva, setAbaAtiva] = useState('resumo'); // Opções: 'resumo', 'extrato', 'dca', 'lucro'

  const [historico, setHistorico] = useState([]);
  
  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [novoTicker, setNovoTicker] = useState('');
  const [novaQuantidade, setNovaQuantidade] = useState('');
  const [novoPreco, setNovoPreco] = useState('');
  const [salvandoAporte, setSalvandoAporte] = useState(false);
  const [tipoOperacao, setTipoOperacao] = useState('COMPRA');

  useEffect(() => {
    carregarTudo();
  }, []);

  const carregarTudo = async () => {
    setCarregando(true);
    await buscarResumoCarteira();
    await buscarHistorico();
    setCarregando(false);
  };

  const buscarResumoCarteira = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    try {
      const resposta = await fetch('http://localhost:8080/carteira/resumo', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (resposta.ok) {
        const dados = await resposta.json();
        setDadosCarteira(dados);
      } else {
        fazerLogout();
      }
    } catch (erro) { console.error("Erro de conexão:", erro); }
  };

  const buscarHistorico = async () => {
    const token = localStorage.getItem('token');
    try {
      const resposta = await fetch('http://localhost:8080/transacoes', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resposta.ok) {
        const dados = await resposta.json();
        setHistorico(dados.reverse());
      }
    } catch (erro) { console.error("Erro no histórico:", erro); }
  };

  const handleEliminarTransacao = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir esta transação?");
    if (!confirmacao) return;

    const token = localStorage.getItem('token');
    try {
      setCarregando(true);
      const resposta = await fetch(`http://localhost:8080/transacoes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resposta.ok || resposta.status === 204) await carregarTudo();
      else { alert("Erro ao tentar excluir."); setCarregando(false); }
    } catch (erro) { alert("Servidor indisponível."); setCarregando(false); }
  };

  const fazerLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const CORES = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

  const handleNovoAporte = async (e) => {
    e.preventDefault();
    setSalvandoAporte(true);
    const token = localStorage.getItem('token');
    try {
      const resposta = await fetch('http://localhost:8080/transacoes', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ticker: novoTicker, 
          quantidade: parseFloat(novaQuantidade.toString().replace(',', '.')), 
          precoUnitario: parseFloat(novoPreco.toString().replace(',', '.')), 
          tipo: tipoOperacao 
        })
      });
      if (resposta.ok) {
        setModalAberto(false); setNovoTicker(''); setNovaQuantidade(''); setNovoPreco(''); setTipoOperacao('COMPRA');
        await carregarTudo(); 
      } else {
        const erroData = await resposta.json(); alert("Atenção: " + erroData.mensagem);
      }
    } catch (erro) { alert("Servidor indisponível."); } 
    finally { setSalvandoAporte(false); }
  };

  const ativos = (dadosCarteira?.ativos || []).filter(ativo => ativo.saldo > 0);
  const formatarData = (dataString) => {
    if (!dataString) return '-';
    return new Date(dataString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans relative">
      <div className="max-w-6xl mx-auto">
        
        {/* CABEÇALHO PRINCIPAL */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-500 tracking-wide">CriptoVision</h1>
            <p className="text-gray-400 text-sm mt-1">Painel de Controle de Ativos</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={() => setModalAberto(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded transition duration-200">
              + Nova Transação
            </button>
            <button onClick={fazerLogout} className="bg-gray-800 border border-gray-700 hover:bg-red-600 hover:border-red-600 px-6 py-2 rounded-md font-semibold transition duration-300">
              Sair
            </button>
          </div>
        </div>

        {/* --- MENU DE NAVEGAÇÃO (ABAS) --- */}
        <div className="flex space-x-2 border-b border-gray-700 mb-8 pb-1 overflow-x-auto">
          <button 
            onClick={() => setAbaAtiva('resumo')}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${abaAtiva === 'resumo' ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            📊 Resumo da Carteira
          </button>
          <button 
            onClick={() => setAbaAtiva('extrato')}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${abaAtiva === 'extrato' ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            📜 Histórico de Transações
          </button>
          <button 
            onClick={() => setAbaAtiva('dca')}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${abaAtiva === 'dca' ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            🔮 Simulador DCA
          </button>
          <button 
            onClick={() => setAbaAtiva('lucro')}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${abaAtiva === 'lucro' ? 'bg-gray-800 text-green-400 border-b-2 border-green-500' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            🚀 Simulador de Lucro
          </button>
        </div>
        
        {carregando ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* ABA 1: RESUMO DA CARTEIRA                 */}
            {abaAtiva === 'resumo' && (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Patrimônio Total Estimado</h3>
                    <p className="text-3xl font-bold text-white">
                      $ {dadosCarteira?.valorTotalCarteira ? dadosCarteira.valorTotalCarteira.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </p>
                    <p className={`text-sm mt-2 flex items-center ${dadosCarteira?.pnlGeral >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      PNL Total: $ {dadosCarteira?.pnlGeral ? dadosCarteira.pnlGeral.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Preço Médio Alvo (BTC)</h3>
                    <p className="text-3xl font-bold text-yellow-400">$ 80.000,00</p>
                    <p className="text-gray-400 text-sm mt-2">Monitoramento contínuo</p>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Ativos na Carteira</h3>
                    <p className="text-3xl font-bold text-white">{ativos.length}</p>
                    <p className="text-gray-400 text-sm mt-2">Criptomoedas diversificadas</p>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden mb-10">
                  <div className="p-6 border-b border-gray-700"><h2 className="text-xl font-bold text-gray-200">Meus Ativos</h2></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-900 text-gray-400 text-sm uppercase tracking-wider">
                          <th className="p-4 font-medium">Ativo (Ticker)</th><th className="p-4 font-medium">Saldo (Qtd)</th><th className="p-4 font-medium">Cotação Atual</th><th className="p-4 font-medium">Total Estimado</th><th className="p-4 font-medium">PNL (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {ativos.length > 0 ? ativos.map((ativo, index) => (
                          <tr key={index} className="hover:bg-gray-750">
                            <td className="p-4 font-bold text-white">{ativo.ticker}</td><td className="p-4 text-gray-300">{ativo.saldo}</td><td className="p-4 text-gray-300">$ {ativo.precoAtual.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td className="p-4 font-bold text-blue-400">$ {ativo.valorTotalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td className={`p-4 font-bold ${ativo.porcentagemPNL >= 0 ? 'text-green-400' : 'text-red-400'}`}>{ativo.porcentagemPNL >= 0 ? '+' : ''}{ativo.porcentagemPNL.toFixed(2)}%</td>
                          </tr>
                        )) : <tr><td colSpan="5" className="p-8 text-center text-gray-500">Sua carteira está vazia.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>

                {ativos.length > 0 && (
                  <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-10">
                    <h2 className="text-xl font-bold text-gray-200 mb-6">Distribuição do Patrimônio</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart><Pie data={ativos} dataKey="valorTotalUSD" nameKey="ticker" cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}>{ativos.map((entry, index) => <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />)}</Pie><Tooltip formatter={(value) => `$ ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} /><Legend /></PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ABA 2: HISTÓRICO                          */}
            {abaAtiva === 'extrato' && (
              <div className="animate-fadeIn">
                <Extrato historico={historico} formatarData={formatarData} onEliminar={handleEliminarTransacao} />
              </div>
            )}

            {/* ABA 3: SIMULADOR DCA                      */}
            {abaAtiva === 'dca' && (
              <div className="animate-fadeIn">
                <Simulador ativos={ativos} />
              </div>
            )}

            {/* ABA 4: SIMULADOR DE LUCROS                */}
            {abaAtiva === 'lucro' && (
              <div className="animate-fadeIn">
                <SimuladorLucro ativos={ativos} />
              </div>
            )}

          </>
        )}
      </div>

      {/* MODAL MANTIDO  */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Registrar Transação</h2>
            <form onSubmit={handleNovoAporte} className="space-y-4">
              <div><label className="block text-gray-400 text-sm mb-1">Moeda (Ticker)</label><input type="text" required className="w-full bg-gray-900 border border-gray-700 text-white rounded p-3 uppercase focus:outline-none focus:border-blue-500" value={novoTicker} onChange={(e) => setNovoTicker(e.target.value)} /></div>
              <div><label className="block text-gray-400 text-sm mb-1">Tipo de Operação</label><select className="w-full bg-gray-900 border border-gray-700 text-white rounded p-3 focus:outline-none focus:border-blue-500" value={tipoOperacao} onChange={(e) => setTipoOperacao(e.target.value)}><option value="COMPRA">COMPRA</option><option value="VENDA">VENDA</option></select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-gray-400 text-sm mb-1">Quantidade</label><input type="number" step="any" required className="w-full bg-gray-900 border border-gray-700 text-white rounded p-3 focus:outline-none focus:border-blue-500" value={novaQuantidade} onChange={(e) => setNovaQuantidade(e.target.value)} /></div>
                <div><label className="block text-gray-400 text-sm mb-1">Preço Unitário ($)</label><input type="number" step="any" required className="w-full bg-gray-900 border border-gray-700 text-white rounded p-3 focus:outline-none focus:border-blue-500" value={novoPreco} onChange={(e) => setNovoPreco(e.target.value)} /></div>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 text-gray-400 hover:text-white transition duration-200">Cancelar</button>
                <button type="submit" disabled={salvandoAporte} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold transition duration-200">{salvandoAporte ? 'Salvando...' : 'Confirmar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;