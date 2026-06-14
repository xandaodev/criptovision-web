// Ele recebe os dados e as funções do "Pai" (Dashboard) como parâmetros (props)
function Extrato({ historico, formatarData, onEliminar }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden mb-10">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-gray-200">Extrato de Transações</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-gray-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Data</th>
              <th className="p-4 font-medium">Operação</th>
              <th className="p-4 font-medium">Ativo</th>
              <th className="p-4 font-medium">Quantidade</th>
              <th className="p-4 font-medium">Preço (Unid.)</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {historico.length > 0 ? (
              historico.map((transacao) => (
                <tr key={transacao.id} className="hover:bg-gray-750">
                  <td className="p-4 text-gray-400 text-sm">{formatarData(transacao.data)}</td>
                  <td className="p-4 font-bold">
                    <span className={transacao.tipo === 'COMPRA' ? 'text-green-500' : 'text-red-500'}>
                      {transacao.tipo}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-white">{transacao.ticker}</td>
                  <td className="p-4 text-gray-300">{transacao.quantidade}</td>
                  <td className="p-4 text-gray-300">
                    $ {transacao.precoUnitario.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 font-bold text-blue-400">
                    $ {(transacao.quantidade * transacao.precoUnitario).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-center">
                    {/* Quando clicado, avisa o Pai qual ID deve ser apagado */}
                    <button 
                      onClick={() => onEliminar(transacao.id)}
                      className="text-red-500 hover:text-red-400 hover:underline text-sm font-bold transition duration-150"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  Nenhuma transação registada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Extrato;