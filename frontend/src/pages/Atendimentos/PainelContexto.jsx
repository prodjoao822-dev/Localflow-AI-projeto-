import { useState } from 'react';
import Badge from '../../components/Badge/Badge';
import Icone from '../../components/Icone/Icone';
import IndicadorPrioridade from '../../components/IndicadorPrioridade/IndicadorPrioridade';
import {
  STATUS_CONVERSA,
  formatarMomento,
  rotuloInteracaoIA,
  rotuloIntencao,
  rotuloResultadoFinal,
} from '../../utils/formatadores';

/**
 * Coluna 3 — contexto da conversa aberta:
 * cliente, canal, classificação da IA (RF06), registro da IA (RF07/RN02)
 * e atualização de estado (RF18/RN08).
 */
export default function PainelContexto({ conversa, usuario, ocupado, onAtualizarStatus }) {
  // Finalizar exige escolher o resultado: guardamos que o usuário escolheu
  // "Finalizada" no select até ele escolher Resolvida/Perdida.
  const [finalizando, setFinalizando] = useState(false);

  if (!conversa) {
    return <aside className="coluna coluna-contexto" aria-label="Detalhes da conversa" />;
  }

  const ehResponsavel = conversa.atendenteResponsavel?.id === usuario.id;

  function aoEscolherStatus(evento) {
    const status = evento.target.value;
    if (status === 'finalizada') {
      setFinalizando(true);
      return;
    }
    setFinalizando(false);
    onAtualizarStatus(status, null);
  }

  async function finalizar(resultadoFinal) {
    const ok = await onAtualizarStatus('finalizada', resultadoFinal);
    if (ok) setFinalizando(false);
  }

  return (
    <aside className="coluna coluna-contexto" aria-label="Detalhes da conversa">
      <section className="contexto-secao">
        <h2 className="contexto-rotulo">Cliente</h2>
        <p className="contexto-nome">{conversa.cliente.nome}</p>
        <p className="contexto-linha">
          <Icone nome="telefone" size={14} />
          {conversa.cliente.telefone}
        </p>
      </section>

      <section className="contexto-secao">
        <h2 className="contexto-rotulo">Canal</h2>
        <p className="contexto-canal">
          <Icone nome="whatsapp" size={16} />
          WhatsApp
        </p>
      </section>

      <section className="contexto-secao contexto-grade">
        <div>
          <h2 className="contexto-rotulo">Intenção (IA)</h2>
          <p className="contexto-valor">{rotuloIntencao(conversa.intencao)}</p>
        </div>
        <div>
          <h2 className="contexto-rotulo">Prioridade (IA)</h2>
          <IndicadorPrioridade prioridade={conversa.prioridade} comTexto />
        </div>
      </section>

      <section className="contexto-secao">
        <h2 className="contexto-rotulo">Responsável</h2>
        <p className="contexto-valor">
          {conversa.atendenteResponsavel?.nome ?? 'Ninguém assumiu ainda'}
        </p>
      </section>

      <section className="contexto-ia" aria-label="Registro da IA">
        <h2 className="contexto-ia-titulo">
          <Icone nome="brilho" size={14} />
          Registro da IA
        </h2>
        {conversa.interacoesIA.length === 0 ? (
          <p className="contexto-ia-vazio">Nenhuma interação da IA nesta conversa.</p>
        ) : (
          <ol className="contexto-ia-lista">
            {conversa.interacoesIA.map((item) => (
              <li key={item.id}>
                <span className="contexto-ia-tipo">
                  {rotuloInteracaoIA(item.tipo)}
                  <time dateTime={item.createdAt}>{formatarMomento(item.createdAt)}</time>
                </span>
                <p>{item.saidaResumo}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="contexto-secao">
        <label htmlFor="contexto-status" className="contexto-rotulo">
          Atualizar status
        </label>
        <select
          id="contexto-status"
          className="select"
          value={finalizando ? 'finalizada' : conversa.status}
          onChange={aoEscolherStatus}
          disabled={ocupado}
        >
          {Object.entries(STATUS_CONVERSA).map(([valor, { label }]) => (
            <option key={valor} value={valor}>
              {label}
            </option>
          ))}
        </select>

        {conversa.status === 'finalizada' && conversa.resultadoFinal && !finalizando && (
          <p className="contexto-resultado">
            Resultado:{' '}
            <Badge tone={rotuloResultadoFinal(conversa.resultadoFinal).tone}>
              {rotuloResultadoFinal(conversa.resultadoFinal).label}
            </Badge>
            <span className="contexto-dica">Para reabrir, escolha outro status.</span>
          </p>
        )}

        {finalizando && (
          <div className="contexto-finalizar">
            <span className="contexto-dica">Como a conversa terminou?</span>
            <div className="contexto-finalizar-botoes">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => finalizar('resolvida')}
                disabled={ocupado}
              >
                Resolvida
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => finalizar('perdida')}
                disabled={ocupado || !ehResponsavel}
                title={ehResponsavel ? undefined : 'Só o atendente responsável pode marcar como perdida'}
              >
                Perdida
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setFinalizando(false)}
                disabled={ocupado}
              >
                Cancelar
              </button>
            </div>
            {!ehResponsavel && (
              <span className="contexto-dica">
                Só o atendente responsável pode marcar como perdida.
              </span>
            )}
          </div>
        )}
      </section>
    </aside>
  );
}
