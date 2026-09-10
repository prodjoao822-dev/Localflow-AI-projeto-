import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { conversaService } from '../../services/conversaService';
import { atendentesMock } from '../../mocks/dadosMock';
import Layout from '../../components/Layout/Layout';
import Icone from '../../components/Icone/Icone';
import Avatar from '../../components/Avatar/Avatar';
import Badge from '../../components/Badge/Badge';
import TagPendencia from '../../components/TagPendencia/TagPendencia';
import {
  EMPRESA_MOCK,
} from '../../mocks/dadosMock';
import {
  rotuloOportunidade,
  rotuloResultadoFinal,
  rotuloIntencao,
  rotuloPrioridade,
  rotuloInteracaoIA,
  formatarHora,
  formatarDataHora,
} from '../../utils/formatadores';
import './Conversa.css';

// RN08: apenas 4 estados. 'resolvida'/'perdida' são resultados de finalização,
// escolhidos no bloco "Resultado" quando o atendente finaliza a conversa.
const OPCOES_STATUS = [
  { valor: 'nova', label: 'Nova' },
  { valor: 'em_atendimento', label: 'Em atendimento' },
  { valor: 'aguardando_cliente', label: 'Aguardando cliente' },
  { valor: 'finalizada', label: 'Finalizada' },
];

const OPCOES_RESULTADO = [
  { valor: 'resolvida', label: 'Resolvida' },
  { valor: 'perdida', label: 'Perdida' },
];

/**
 * Tela 3 — Conversa individual (RF17, RF07, RN02, RF08, RF18).
 * - Histórico de mensagens completo, com autor humano ou IA.
 * - Interações da IA registradas e visíveis ao atendente (RN02), incluindo
 *   a trilha de auditoria (RF07).
 * - Ação de assumir a conversa (RF08) quando ainda não assumida.
 * - Estado básico da oportunidade (RF18) com seletor de estado.
 * - Placeholder visível para a regra pendente RN03 (escalada sem atendente).
 */
export default function Conversa() {
  const { id } = useParams();
  const { usuario, sair } = useAuth();

  const [conversa, setConversa] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [interacoes, setInteracoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [assumindo, setAssumindo] = useState(false);
  const [atualizandoStatus, setAtualizandoStatus] = useState(false);
  const [erro, setErro] = useState('');

  const fimRef = useRef(null);

  useEffect(() => {
    let ativo = true;
    conversaService.buscarConversaPorId(id).then((dados) => {
      if (!ativo) return;
      if (!dados) {
        setCarregando(false);
        setConversa(null);
        return;
      }
      setConversa(dados.conversa);
      setMensagens(dados.mensagens);
      setInteracoes(dados.interacoes);
      setCarregando(false);
    });
    return () => {
      ativo = false;
    };
  }, [id]);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens.length, carregando]);

  const nomeAtendente = (idAtendente) =>
    atendentesMock.find((a) => a.id === idAtendente)?.nome;

  const responsavel = conversa?.atendenteId
    ? nomeAtendente(conversa.atendenteId) || 'Atendente'
    : null;

  /** Nome legível do autor de uma mensagem. */
  function autorDe(msg) {
    if (msg.remetente === 'cliente') return 'Cliente';
    if (msg.remetente === 'ia') return 'IA LocalFlow';
    return msg.autorNome || nomeAtendente(msg.autorId) || 'Você';
  }

  async function assumirConversa() {
    if (!conversa || assumindo) return;
    setAssumindo(true);
    try {
      const atualizada = await conversaService.assumirConversa(conversa.id, usuario.id);
      setConversa(atualizada);
    } catch {
      setErro('Não foi possível assumir a conversa.');
    } finally {
      setAssumindo(false);
    }
  }

  async function enviar(evento) {
    evento.preventDefault();
    const conteudo = texto.trim();
    if (!conteudo || enviando || !conversa) return;
    setEnviando(true);
    setErro('');
    try {
      const dados = await conversaService.enviarMensagem(conversa.id, usuario.id, conteudo);
      setConversa(dados.conversa);
      setMensagens(dados.mensagens);
      setInteracoes(dados.interacoes);
      setTexto('');
    } catch {
      setErro('Não foi possível enviar a mensagem.');
    } finally {
      setEnviando(false);
    }
  }

  /**
   * Muda o estado (RF18/RN08). Se o novo estado for 'finalizada', o resultado
   * ('resolvida'/'perdida') é obrigatório — o serviço rejeita sem ele.
   */
  async function mudarStatus(novoStatus, resultadoFinal = null) {
    if (!conversa || atualizandoStatus) return;
    setAtualizandoStatus(true);
    try {
      const atualizada = await conversaService.atualizarStatus(
        conversa.id,
        novoStatus,
        resultadoFinal
      );
      setConversa(atualizada);
    } catch {
      setErro('Não foi possível atualizar o estado.');
    } finally {
      setAtualizandoStatus(false);
    }
  }

  if (carregando) {
    return (
      <Layout empresa={EMPRESA_MOCK} usuario={usuario} navItens={[]} onLogout={sair}>
        <div className="conversa-carregando">Carregando conversa…</div>
      </Layout>
    );
  }

  if (!conversa) {
    return (
      <Layout empresa={EMPRESA_MOCK} usuario={usuario} navItens={[]} onLogout={sair}>
        <div className="conversa-nao-encontrada">
          <p>Conversa não encontrada.</p>
          <Link to="/painel" className="btn btn-secondary">
            Voltar para a fila
          </Link>
        </div>
      </Layout>
    );
  }

  const oportunidade = rotuloOportunidade(conversa.status);
  const intencao = rotuloIntencao(conversa.intencao);
  const prioridade = rotuloPrioridade(conversa.prioridade);

  const timeline = [...mensagens, ...interacoes].sort(
    (a, b) => new Date(a.dataHora) - new Date(b.dataHora)
  );

  return (
    <Layout empresa={EMPRESA_MOCK} usuario={usuario} navItens={[]} onLogout={sair}>
      <div className="conversa">
        {/* Topo da conversa */}
        <header className="conversa-topo">
          <Link to="/painel" className="conversa-voltar">
            <Icone nome="voltar" size={16} />
            Fila
          </Link>

          <div className="conversa-cliente">
            <Avatar nome={conversa.cliente.nome} size={36} />
            <div className="conversa-cliente-info">
              <strong>{conversa.cliente.nome}</strong>
              <span className="conversa-cliente-telefone">
                <Icone nome="zap" size={12} />
                {conversa.cliente.telefone}
              </span>
            </div>
          </div>

          <div className="conversa-badges">
            <Badge tone={oportunidade.tone}>{oportunidade.label}</Badge>
            <Badge tone={intencao.tone}>{intencao.label}</Badge>
            <Badge tone={prioridade.tone}>{prioridade.label}</Badge>
            {responsavel ? (
              <Badge tone="neutral">
                <Icone nome="bot" size={12} />
                {responsavel}
              </Badge>
            ) : (
              <Badge tone="warning">Sem atendente</Badge>
            )}
          </div>
        </header>

        {/* Corpo: mensagens + interações da IA */}
        <div className="conversa-corpo">
          <div className="conversa-linha-tempo">
            {timeline.map((item) => {
              if (item.tipo) {
                // Interação da IA registrada (RF07 + RN02)
                return (
                  <div key={item.id} className="timeline-interacao">
                    <div className="timeline-interacao-icone">
                      <Icone nome="bot" size={14} />
                    </div>
                    <div className="timeline-interacao-conteudo">
                      <div className="timeline-interacao-cabecalho">
                        <strong>IA LocalFlow</strong>
                        <span className="timeline-interacao-tipo">
                          {rotuloInteracaoIA(item.tipo)}
                        </span>
                        <span className="timeline-interacao-hora">
                          {formatarDataHora(item.dataHora)}
                        </span>
                      </div>
                      <p className="timeline-interacao-detalhes">{item.detalhes}</p>
                    </div>
                  </div>
                );
              }

              // Mensagem de humanos (cliente ou atendente)
              const ehCliente = item.remetente === 'cliente';
              const ehIA = item.remetente === 'ia';
              const ehMinha = item.remetente === 'atendente' && item.autorId === usuario.id;
              const cls = ehCliente
                ? 'msg-cliente'
                : ehIA
                  ? 'msg-ia'
                  : ehMinha
                    ? 'msg-minha'
                    : 'msg-outro';

              return (
                <div key={item.id} className={`msg ${cls}`}>
                  <div className="msg-avatares">
                    <Avatar
                      nome={ehCliente ? conversa.cliente.nome : autorDe(item)}
                      size={28}
                    />
                  </div>
                  <div className="msg-bolha">
                    <p className="msg-texto">{item.texto}</p>
                    <span className="msg-hora">
                      {autorDe(item)} · {formatarHora(item.dataHora)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={fimRef} />
          </div>

          {/* Painel lateral: oportunidade + trilha da IA */}
          <aside className="conversa-lateral">
            <section className="conversa-secao">
              <h2 className="conversa-secao-titulo">Oportunidade</h2>
              <div className="conversa-secao-corpo">
                <span className="conversa-secao-rotulo">Estado atual</span>
                <Badge tone={oportunidade.tone}>{oportunidade.label}</Badge>
                {/* RN08: resultado de finalização exibido junto ao estado */}
                {conversa.status === 'finalizada' && conversa.resultadoFinal && (
                  <>
                    <span className="conversa-secao-rotulo">Resultado</span>
                    <Badge tone={rotuloResultadoFinal(conversa.resultadoFinal).tone}>
                      {rotuloResultadoFinal(conversa.resultadoFinal).label}
                    </Badge>
                  </>
                )}

                <span className="conversa-secao-rotulo">Mudar estado</span>
                <div className="conversa-opcoes-status">
                  {OPCOES_STATUS.map((opcao) => (
                    <button
                      key={opcao.valor}
                      type="button"
                      className={`conversa-opcao-status${
                        conversa.status === opcao.valor ? ' ativo' : ''
                      }`}
                      onClick={() => mudarStatus(opcao.valor)}
                      disabled={atualizandoStatus}
                    >
                      {opcao.label}
                    </button>
                  ))}
                </div>

                {/* RN08: finalizar exige escolher resultado; reabrir limpa o resultado */}
                {conversa.status === 'finalizada' ? (
                  <>
                    <span className="conversa-secao-rotulo">Reabrir (ação manual)</span>
                    <div className="conversa-opcoes-status">
                      <button
                        type="button"
                        className="conversa-opcao-status"
                        onClick={() => mudarStatus('em_atendimento')}
                        disabled={atualizandoStatus}
                      >
                        Reabrir conversa
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="conversa-secao-rotulo">Finalizar com resultado</span>
                    <div className="conversa-opcoes-status">
                      {OPCOES_RESULTADO.map((opcao) => (
                        <button
                          key={opcao.valor}
                          type="button"
                          className="conversa-opcao-status"
                          onClick={() => mudarStatus('finalizada', opcao.valor)}
                          disabled={atualizandoStatus}
                        >
                          {opcao.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {!responsavel && (
                  <div className="conversa-assumir-box">
                    <span className="conversa-secao-rotulo">Responsável</span>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={assumirConversa}
                      disabled={assumindo}
                    >
                      {assumindo ? 'Assumindo…' : 'Assumir conversa'}
                    </button>
                    <p className="conversa-aviso-rn03">
                      A IA escalou este assunto, mas a regra de escalada quando
                      nenhum atendente assumiu ainda não foi definida nos
                      requisitos.
                    </p>
                    <TagPendencia codigo="RN03" />
                  </div>
                )}
              </div>
            </section>

            <section className="conversa-secao">
              <h2 className="conversa-secao-titulo">Registro da IA</h2>
              <div className="conversa-secao-corpo">
                {interacoes.length === 0 ? (
                  <p className="conversa-secao-vazio">
                    Nenhuma interação da IA registrada nesta conversa.
                  </p>
                ) : (
                  <ul className="conversa-interacoes">
                    {interacoes.map((inter) => (
                      <li key={inter.id} className="conversa-interacao">
                        <span className="conversa-interacao-tipo">
                          {rotuloInteracaoIA(inter.tipo)}
                        </span>
                        <span className="conversa-interacao-hora">
                          {formatarDataHora(inter.dataHora)}
                        </span>
                        <p className="conversa-interacao-detalhe">{inter.detalhes}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="conversa-secao">
              <h2 className="conversa-secao-titulo">Sobre o cliente</h2>
              <div className="conversa-secao-corpo">
                <span className="conversa-secao-rotulo">Telefone</span>
                <p className="conversa-secao-valor">{conversa.cliente.telefone}</p>
                <span className="conversa-secao-rotulo">Canal</span>
                <p className="conversa-secao-valor">WhatsApp</p>
              </div>
            </section>
          </aside>
        </div>

        {/* Compositor */}
        <footer className="conversa-compositor">
          {erro && <p className="conversa-erro">{erro}</p>}
          <form onSubmit={enviar} className="conversa-form">
            <textarea
              className="conversa-textarea"
              placeholder={
                responsavel
                  ? 'Escreva sua resposta ao cliente…'
                  : 'Assuma a conversa para responder…'
              }
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  enviar(e);
                }
              }}
              rows={1}
              disabled={!responsavel || enviando}
            />
            <button
              type="submit"
              className="btn btn-primary conversa-enviar"
              disabled={!texto.trim() || enviando || !responsavel}
              title="Enviar mensagem"
            >
              <Icone nome="enviar" size={16} />
            </button>
          </form>
          <p className="conversa-compositor-nota">
            No MVP, as mensagens enviadas aparecem apenas nesta conversa (mock em
            memória). O reenvio real ao WhatsApp é responsabilidade do Provider
            Gateway + Evolution API no backend.
          </p>
        </footer>
      </div>
    </Layout>
  );
}
