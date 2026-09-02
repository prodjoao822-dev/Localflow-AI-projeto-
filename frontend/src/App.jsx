import { useState, useEffect } from 'react'; 
import { atendimentoService } from './services/atendimentoService';
import CardAtendimento from './components/CardAtendimento/CardAtendimento';

function App(){ 
  // 1. Memória para guardar a lista de atendimentos que vai vir do mock (começa vazia [])
  const [atendimentos, setAtendimentos] = useState([]);

  // 2. Memória para saber se está carregando ou não (começa como true)
  const [carregando, setCarregando] = useState(true);

  useEffect(() => { 
    async function carregar() { 
      const dados = await atendimentoService.buscarAtendimentos();
      setAtendimentos(dados);
      setCarregando(false); 
    }

    carregar(); 
      
  }, []);
  
  return ( 
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#121214', minHeight: '100vh', color: '#fff' }}> 
      <h1>LocalFlow AI - Caixa de Entrada</h1>

      {/* Se 'carregando' for true, mostra a mensagem de espera */}
      {carregando ? (
        <p>⏳ Carregando atendimentos do servidor...</p>
      ) : (
        /* Se 'carregando' for false, desenha a lista com nosso novo componente! */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
          {atendimentos.map((atendimento) => (
            <CardAtendimento key={atendimento.id} atendimento={atendimento} />
          ))}
        </div>
      )}
    </div>
  )
}


export default App;
