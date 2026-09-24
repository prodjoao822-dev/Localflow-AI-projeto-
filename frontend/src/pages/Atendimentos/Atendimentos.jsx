import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { conversaService } from '../../services/conversaService';
import { agruparFila } from '../../utils/fila';
import Layout from '../../components/Layout/Layout';
import CabecalhoPagina from '../../components/CabecalhoPagina/CabecalhoPagina';
import Icone from '../../components/Icone/Icone';
import ContadorStatus from '../../components/ContadorStatus/ContadorStatus';
import FilaConversas from './FilaConversas';
import ThreadConversa from './ThreadConversa';
import PainelContexto from './PainelContexto';
import './Atendimentos.css';

/** Contadores do topo = tamanho dos grupos da fila (mesma regra, sem duplicar). */
const CONTADORES = [
  { grupo: 'acao', rotulo: 'Precisam de ação', tone: 'danger', destaque: true },
  { grupo: 'em_atendimento', rotulo: 'Em atendimento', tone: 'info' },
  { grupo: 'aguardando_cliente', rotulo: 'Aguardando cliente', tone: 'warning' },
  { grupo: 'finalizada', rotulo: 'Finalizados / Perdidos', tone: 'neutral' },
];

/** Abas usadas só em telas estreitas (RNF02). [PENDENTE de validação visual] */
const ABAS = [
  { id: 'fila', label: 'Fila' },
  { id: 'conversa', label: 'Conversa' },
  { id: 'contexto', label: 'Detalhes' },
];

/**
 * Tela de Atendimentos — RF05, RF06, RF07, RF08, RF17, RF18, RN02, RN08.
 * Três colunas persistentes (decisão travada):
 *   1. Fila de conversas   2. Thread da conversa   3. Painel de contexto
 * Esta página só orquestra dados e ações; cada coluna é um componente.
 */
export default function Atendimentos() {
  const { usuario } = useAuth();

  const [conversas, setConversas] = useState([]);
  const [carregandoFila, setCarregandoFila] = useState(true);
  const [selecionadaId, setSelecionadaId] = useState(null);
  const [detalhe, setDetalhe] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  const [aba, setAba] = useState('fila');

  /** Recarrega a fila (botão "Atualizar" e depois de cada ação). */
  const carregarFila = useCallback(async () => {
    const resposta = await conversaService.listar();
    setConversas(resposta.data);
  }, []);

  // Carga inicial da fila.
  useEffect(() => {
    let ativo = true;
    conversaService.listar().then((resposta) => {
      if (!ativo) return;
      setConversas(resposta.data);
      setCarregandoFila(false);
    });
    return () => {
      ativo = false;
    };
  }, []);

  // Busca o detalhe sempre que a seleção muda.
  useEffect(() => {
    if (!selecionadaId) return;
    let ativo = true;
    conversaService
      .buscarPorId(selecionadaId)
      .then((resposta) => ativo && setDetalhe(resposta.data))
      .catch((e) => ativo && setErro(e.message));
    return () => {
      ativo = false;
    };
  }, [selecionadaId]);

  const grupos = useMemo(() => agruparFila(conversas), [conversas]);
  const tamanhoDoGrupo = (id) => grupos.find((g) => g.id === id)?.conversas.length ?? 0;

  function selecionar(id) {
    setErro('');
    setSelecionadaId(id);
    setAba('conversa');
  }

  /**
   * Executa uma ação sobre a conversa aberta, atualiza o detalhe com a
   * resposta e recarrega a fila (no futuro, o Socket.io fará essa parte).
   */
  async function executar(acao) {
    setOcupado(true);
    setErro('');
    try {
      const resposta = await acao();
      setDetalhe(resposta.data);
      await carregarFila();
      return true;
    } catch (e) {
      setErro(e.message || 'Não foi possível concluir a ação.');
      return false;
    } finally {
      setOcupado(false);
    }
  }

  const acoes = {
    assumir: () => executar(() => conversaService.assumir(detalhe.id, usuario)),
    enviar: (texto) => executar(() => conversaService.enviarMensagem(detalhe.id, texto, usuario)),
    atualizarStatus: (status, resultadoFinal) =>
      executar(() =>
        conversaService.atualizarStatus(detalhe.id, { status, resultadoFinal }, usuario)
      ),
  };

  // Enquanto o detalhe carregado não for o da conversa selecionada, está
  // carregando (derivado — não precisa de um estado a mais).
  const conversaAberta = detalhe?.id === selecionadaId ? detalhe : null;
  const carregandoDetalhe = Boolean(selecionadaId) && !conversaAberta && !erro;

  return (
    <Layout>
      <div className="atendimentos">
        <CabecalhoPagina
          titulo="Atendimentos"
          subtitulo="Conversas e interações com clientes via WhatsApp, já triadas pela IA"
          acoes={
            <button
              type="button"
              className="btn btn-secondary"
              onClick={carregarFila}
              disabled={carregandoFila}
            >
              <Icone nome="atualizar" size={16} />
              Atualizar
            </button>
          }
        />

        <div className="atendimentos-contadores">
          {CONTADORES.map((c) => (
            <ContadorStatus
              key={c.grupo}
              valor={carregandoFila ? '–' : tamanhoDoGrupo(c.grupo)}
              rotulo={c.rotulo}
              tone={c.tone}
              destaque={c.destaque}
            />
          ))}
        </div>

        <div className="atendimentos-abas" role="tablist" aria-label="Seções do atendimento">
          {ABAS.map((a) => (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={aba === a.id}
              className={`atendimentos-aba${aba === a.id ? ' ativa' : ''}`}
              onClick={() => setAba(a.id)}
              disabled={a.id !== 'fila' && !selecionadaId}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="atendimentos-colunas" data-aba={aba}>
          <FilaConversas
            grupos={grupos}
            carregando={carregandoFila}
            selecionadaId={selecionadaId}
            onSelecionar={selecionar}
          />
          {/* key = conversa: troca de conversa zera rascunho e estado local */}
          <ThreadConversa
            key={`thread-${selecionadaId}`}
            conversa={conversaAberta}
            carregando={carregandoDetalhe}
            nenhumaSelecionada={!selecionadaId}
            ocupado={ocupado}
            erro={erro}
            onAssumir={acoes.assumir}
            onEnviar={acoes.enviar}
          />
          <PainelContexto
            key={`contexto-${selecionadaId}`}
            conversa={conversaAberta}
            usuario={usuario}
            ocupado={ocupado}
            onAtualizarStatus={acoes.atualizarStatus}
          />
        </div>
      </div>
    </Layout>
  );
}
