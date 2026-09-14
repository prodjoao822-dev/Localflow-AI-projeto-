import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { conversaService } from '../../services/conversaService';
import Layout from '../../components/Layout/Layout';
import Icone from '../../components/Icone/Icone';
import Avatar from '../../components/Avatar/Avatar';
import Badge from '../../components/Badge/Badge';
import Conversa from '../Conversa/Conversa';
import {
  EMPRESA_MOCK,
  atendentesMock,
} from '../../mocks/dadosMock';
import {
  rotuloOportunidade,
  rotuloResultadoFinal,
  rotuloIntencao,
  rotuloPrioridade,
  formatarTempoRelativo,
  formatarDataHora,
} from '../../utils/formatadores';
import './PainelAtendente.css';
import { filtrarPrioridade } from '../../utils/exerciciosPrioridade alta';
// RN08: 4 estados oficiais. Finalizadas vão para o fim da fila.
const ORDEM_STATUS = {
  nova: 0,
  em_atendimento: 1,
  aguardando_cliente: 2,
  finalizada: 3,
};

// Dentro de cada estado, a prioridade influencia a ordem visual (RF06).
const ORDEM_PRIORIDADE = {
  alta: 0,
  media: 1,
  baixa: 2,
};

const FILTROS = [
  { id: 'todas', label: 'Todas' },
  { id: 'nova', label: 'Novas' },
  { id: 'em_atendimento', label: 'Em atendimento' },
  { id: 'aguardando_cliente', label: 'Aguardando cliente' },
  { id: 'finalizada', label: 'Finalizadas' },
];

/**
 * Tela 2 — Atendimento (RF05, RF06, RF17, RF07, RN02, RF08, RF18).
 * Estrutura unificada em 3 colunas persistentes, sempre visíveis:
 * 1. Fila (esquerda): busca, filtros por estado, lista ordenada por estado
 *    e depois prioridade, com indicador visual de prioridade.
 * 2. Thread (centro): histórico + compositor (componente Conversa).
 * 3. Contexto (direita): oportunidade, registro da IA, cliente (dentro de Conversa).
 * Seleção por estado local (conversaSelecionadaId) — sem navegação de rota.
 */
export default function PainelAtendente() {
  const { usuario, sair } = useAuth();

  const [conversas, setConversas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [assumindoId, setAssumindoId] = useState(null);
  const [conversaSelecionadaId, setConversaSelecionadaId] = useState(null);

  useEffect(() => {
    let ativo = true;
    conversaService.listarConversas().then((dados) => {
      if (!ativo) return;
      setConversas(dados);
      setCarregando(false);
    });
    return () => {
      ativo = false;
    };
  }, []);

  const nomeAtendente = (id) => atendentesMock.find((a) => a.id === id)?.nome;

  const filaOrdenada = useMemo(() => {
    const ordenadas = [...conversas].sort((a, b) => {
      const statusDiff = ORDEM_STATUS[a.status] - ORDEM_STATUS[b.status];
      if (statusDiff !== 0) return statusDiff;
      const prioDiff =
        (ORDEM_PRIORIDADE[a.prioridade] ?? 3) - (ORDEM_PRIORIDADE[b.prioridade] ?? 3);
      if (prioDiff !== 0) return prioDiff;
      return new Date(b.ultimaAtualizacao) - new Date(a.ultimaAtualizacao);
    });

    const termo = busca.trim().toLowerCase();
    const filtradas = filtroStatus === 'todas'
      ? ordenadas
      : ordenadas.filter((c) => c.status === filtroStatus);

    if (!termo) return filtradas;
    return filtradas.filter((c) => {
      const alvo = [c.cliente.nome, c.ultimaMensagem, c.cliente.telefone]
        .join(' ')
        .toLowerCase();
      return alvo.includes(termo);
    });
  }, [conversas, busca, filtroStatus]);

  const contadorStatus = (id) =>
    id === 'todas' ? conversas.length : conversas.filter((c) => c.status === id).length;

  /** Reflete mutações feitas na thread (assumir/enviar/status) na fila. */
  function aoAtualizarConversa(atualizada) {
    if (!atualizada?.id) return;
    setConversas((prev) =>
      prev.map((c) => (c.id === atualizada.id ? { ...c, ...atualizada } : c))
    );
  }

  async function assumir(conversaId) {
    setAssumindoId(conversaId);
    try {
      const atualizada = await conversaService.assumirConversa(conversaId, usuario.id);
      setConversas((prev) =>
        prev.map((c) => (c.id === atualizada.id ? atualizada : c))
      );
    } catch {
      // mock não falha na prática; se falhar, mantém a fila como está
    } finally {
      setAssumindoId(null);
    }
  }

  return (
    <Layout
      empresa={EMPRESA_MOCK}
      usuario={usuario}
      navItens={[]}
      onLogout={sair}
    >
      <div className="atendimento">
        {/* ===== Coluna 1 — Fila ===== */}
        <section className="fila" aria-label="Fila de conversas">
          <header className="painel-topo">
            <div>
              <h1 className="painel-titulo">Fila de conversas</h1>
              <p className="painel-subtitulo">
                Priorize pela intenção e prioridade, não pela ordem de chegada.
              </p>
            </div>
            <span className="painel-whatsapp">
              <Icone nome="zap" size={15} />
              WhatsApp conectado
            </span>
          </header>

          <div className="painel-controles">
            <div className="pesquisa-input">
              <Icone nome="lupa" size={16} />
              <input
                placeholder="Buscar por cliente, mensagem ou telefone…"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="painel-filtros" role="tablist" aria-label="Filtros por estado">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filtroStatus === f.id}
                className={`painel-filtro${filtroStatus === f.id ? ' ativo' : ''}`}
                onClick={() => setFiltroStatus(f.id)}
              >
                {f.label}
                <span className="painel-filtro-contagem">{contadorStatus(f.id)}</span>
              </button>
            ))}
          </div>

          <div className="painel-corpo">
            {carregando ? (
              <p className="painel-vazio">Carregando conversas…</p>
            ) : filaOrdenada.length === 0 ? (
              <p className="painel-vazio">Nenhuma conversa encontrada para este filtro.</p>
            ) : (
              <ul className="painel-lista">
                {filaOrdenada.map((conversa) => {
                  const oportunidade = rotuloOportunidade(conversa.status);
                  const intencao = rotuloIntencao(conversa.intencao);
                  const prioridade = rotuloPrioridade(conversa.prioridade);
                  const nomeResponsavel = nomeAtendente(conversa.atendenteId);
                  const selecionada = conversa.id === conversaSelecionadaId;

                  return (
                    <li
                      key={conversa.id}
                      className={`painel-item prio-${conversa.prioridade}${
                        selecionada ? ' selecionada' : ''
                      }`}
                    >
                      <button
                        type="button"
                        className="painel-item-link"
                        onClick={() => setConversaSelecionadaId(conversa.id)}
                        aria-pressed={selecionada}
                      >
                        <Avatar nome={conversa.cliente.nome} size={40} />
                        <div className="painel-item-info">
                          <div className="painel-item-linha1">
                            <span className="painel-item-nome">
                              <span
                                className={`prio-ponto prio-${conversa.prioridade}`}
                                title={prioridade.label}
                              />
                              {conversa.cliente.nome}
                              {conversa.naoLidas > 0 && (
                                <span className="painel-naoLidas">{conversa.naoLidas}</span>
                              )}
                            </span>
                            <span className="painel-item-tempo">
                              {formatarTempoRelativo(conversa.ultimaAtualizacao)}
                            </span>
                          </div>
                          <span className="painel-item-preview">{conversa.ultimaMensagem}</span>
                          <div className="painel-item-badges">
                            <Badge tone={oportunidade.tone}>{oportunidade.label}</Badge>
                            {/* RN08: resultado só existe quando o estado é 'finalizada' */}
                            {conversa.status === 'finalizada' && conversa.resultadoFinal && (
                              <Badge tone={rotuloResultadoFinal(conversa.resultadoFinal).tone}>
                                {rotuloResultadoFinal(conversa.resultadoFinal).label}
                              </Badge>
                            )}
                            <Badge tone={intencao.tone}>{intencao.label}</Badge>
                            {nomeResponsavel && (
                              <Badge tone="neutral">
                                <Icone nome="bot" size={12} />
                                {nomeResponsavel}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>

                      {conversa.atendenteId === null && (
                        <button
                          type="button"
                          className="btn btn-primary painel-assumir"
                          onClick={() => assumir(conversa.id)}
                          disabled={assumindoId === conversa.id}
                        >
                          {assumindoId === conversa.id ? 'Assumindo…' : 'Assumir'}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <p className="painel-rodape-data">
            Última atualização dos mocks: {formatarDataHora(new Date().toISOString())}
          </p>
        </section>

        {/* ===== Colunas 2 e 3 — Thread + Contexto ===== */}
        <section className="thread-coluna" aria-label="Conversa selecionada">
          {conversaSelecionadaId ? (
            <Conversa
              conversaId={conversaSelecionadaId}
              aoAtualizar={aoAtualizarConversa}
            />
          ) : (
            <div className="thread-vazia">
              <Icone nome="bot" size={28} />
              <p>Selecione uma conversa na fila</p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
