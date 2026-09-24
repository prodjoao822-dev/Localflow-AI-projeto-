import { useEffect, useRef, useState } from 'react';
import { AvatarCanal } from '../../components/Avatar/Avatar';
import Badge from '../../components/Badge/Badge';
import BolhaMensagem from '../../components/BolhaMensagem/BolhaMensagem';
import Icone from '../../components/Icone/Icone';
import { PRECISA_DE_ACAO, rotuloStatus } from '../../utils/formatadores';

/** Por que o campo de resposta está bloqueado (ou null se liberado). */
function motivoBloqueio(conversa) {
  if (!conversa.atendenteResponsavel) return 'Assuma a conversa para responder…';
  if (conversa.status === 'finalizada') return 'Conversa finalizada — reabra para responder…';
  return null;
}

/**
 * Coluna 2 — cabeçalho do cliente, histórico (RF17) e campo de resposta.
 * Assumir conversa (RF08) aparece enquanto ninguém é responsável.
 *
 * [ASSUMIDO] Uma vez assumida, qualquer atendente pode responder — não só
 * o responsável. RN05 não restringe isso (só a finalização como "perdida"
 * é restrita ao responsável). Sem essa regra documentada, mantive o
 * comportamento mais permissivo (cobertura de ausências).
 */
export default function ThreadConversa({
  conversa,
  carregando,
  nenhumaSelecionada,
  ocupado,
  erro,
  onAssumir,
  onEnviar,
}) {
  const [texto, setTexto] = useState('');
  const fimRef = useRef(null);

  const totalMensagens = conversa?.mensagens.length ?? 0;
  useEffect(() => {
    fimRef.current?.scrollIntoView({ block: 'end' });
  }, [conversa?.id, totalMensagens]);

  if (nenhumaSelecionada) {
    return (
      <section className="coluna coluna-thread" aria-label="Conversa">
        <div className="coluna-vazia coluna-vazia-centro">
          <Icone nome="conversas" size={28} />
          <p>Selecione uma conversa na fila</p>
        </div>
      </section>
    );
  }

  if (carregando || !conversa) {
    return (
      <section className="coluna coluna-thread" aria-label="Conversa">
        <p className="coluna-vazia">{erro || 'Carregando conversa…'}</p>
      </section>
    );
  }

  const badge =
    conversa.needsAction && conversa.status !== 'finalizada'
      ? PRECISA_DE_ACAO
      : rotuloStatus(conversa.status);
  const bloqueio = motivoBloqueio(conversa);

  async function enviar(evento) {
    evento.preventDefault();
    const conteudo = texto.trim();
    if (!conteudo || ocupado || bloqueio) return;
    const ok = await onEnviar(conteudo);
    if (ok) setTexto('');
  }

  return (
    <section className="coluna coluna-thread" aria-label={`Conversa com ${conversa.cliente.nome}`}>
      <header className="thread-topo">
        <AvatarCanal canal={conversa.canal} />
        <div className="thread-cliente">
          <strong>{conversa.cliente.nome}</strong>
          <span>WhatsApp · {conversa.cliente.telefone}</span>
        </div>
        <Badge tone={badge.tone}>{badge.label}</Badge>
        <div className="thread-topo-acao">
          {conversa.atendenteResponsavel ? (
            <span className="thread-responsavel">
              Responsável: <strong>{conversa.atendenteResponsavel.nome}</strong>
            </span>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onAssumir}
              disabled={ocupado}
            >
              <Icone nome="check" size={16} />
              Assumir conversa
            </button>
          )}
        </div>
      </header>

      {erro && (
        <p className="thread-erro" role="alert">
          {erro}
        </p>
      )}

      <div className="thread-mensagens">
        {conversa.mensagens.map((mensagem) => (
          <BolhaMensagem key={mensagem.id} mensagem={mensagem} />
        ))}
        <div ref={fimRef} />
      </div>

      <form className="thread-compositor" onSubmit={enviar}>
        <label htmlFor="thread-texto" className="sr-only">
          Mensagem para o cliente
        </label>
        <input
          id="thread-texto"
          className="input"
          placeholder={bloqueio || 'Escreva uma mensagem…'}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          disabled={Boolean(bloqueio) || ocupado}
          autoComplete="off"
        />
        <button
          type="submit"
          className="btn btn-primary thread-enviar"
          disabled={Boolean(bloqueio) || ocupado || !texto.trim()}
          title="Enviar"
          aria-label="Enviar mensagem"
        >
          <Icone nome="enviar" size={18} />
        </button>
      </form>
    </section>
  );
}
