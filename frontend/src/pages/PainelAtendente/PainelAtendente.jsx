import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { conversaService } from '../../services/conversaService';
import Layout from '../../components/Layout/Layout';
import Icone from '../../components/Icone/Icone';
import Avatar from '../../components/Avatar/Avatar';
import Badge from '../../components/Badge/Badge';
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

// RN08: 4 estados oficiais. Finalizadas vão para o fim da fila.
const ORDEM_STATUS = {
  nova: 0,
  em_atendimento: 1,
  aguardando_cliente: 2,
  finalizada: 3,
};

const FILTROS = [
  { id: 'todas', label: 'Todas' },
  { id: 'nova', label: 'Novas' },
  { id: 'em_atendimento', label: 'Em atendimento' },
  { id: 'aguardando_cliente', label: 'Aguardando cliente' },
  { id: 'finalizada', label: 'Finalizadas' },
];

/**
 * Tela 2 — Painel do Atendente (RF05, RF06).
 * Fila de conversas com classificação de intenção e prioridade da IA,
 * busca por texto e filtros por estado da oportunidade (RF18).
 */
export default function PainelAtendente() {
  const { usuario, sair } = useAuth();

  const [conversas, setConversas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [assumindoId, setAssumindoId] = useState(null);

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
      <header className="painel-topo">
        <div>
          <h1 className="painel-titulo">Fila de conversas</h1>
          <p className="painel-subtitulo">
            Classificação automática da IA — priorize pela intenção, não pela ordem de chegada.
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

              return (
                <li key={conversa.id} className="painel-item">
                  <Link to={`/painel/conversa/${conversa.id}`} className="painel-item-link">
                    <Avatar nome={conversa.cliente.nome} size={40} />
                    <div className="painel-item-info">
                      <div className="painel-item-linha1">
                        <span className="painel-item-nome">
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
                        <Badge tone={prioridade.tone}>{prioridade.label}</Badge>
                        {nomeResponsavel && (
                          <Badge tone="neutral">
                            <Icone nome="bot" size={12} />
                            {nomeResponsavel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
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
    </Layout>
  );
}
