import { AvatarCanal } from '../Avatar/Avatar';
import Badge from '../Badge/Badge';
import IndicadorPrioridade from '../IndicadorPrioridade/IndicadorPrioridade';
import {
  PRECISA_DE_ACAO,
  formatarHoraOuData,
  rotuloResultadoFinal,
  rotuloStatus,
} from '../../utils/formatadores';
import './CardConversa.css';

/**
 * Qual badge o card mostra. Um só, o mais útil para decidir o que fazer:
 * needsAction > resultado de finalização > estado.
 */
function badgeDoCard(conversa) {
  if (conversa.needsAction && conversa.status !== 'finalizada') return PRECISA_DE_ACAO;
  if (conversa.status === 'finalizada' && conversa.resultadoFinal) {
    return rotuloResultadoFinal(conversa.resultadoFinal);
  }
  return rotuloStatus(conversa.status);
}

/**
 * Card de uma conversa na fila (RF05 / RF06).
 * Recebe o item no formato "resumo de lista" do contrato (GET /conversas).
 * A borda esquerda e a bolinha têm a cor da prioridade da IA.
 *
 * [ASSUMIDO] O PNG mostra a tag "✦ IA" nos cards da fila. O resumo de
 * lista do contrato não tem nenhum campo que diga se a IA atuou na
 * conversa (isso só existe em `interacoesIA`, que vem no detalhe). Por
 * isso a tag não aparece aqui — ela aparece nas bolhas da thread, onde
 * o dado existe de verdade.
 *
 * @param {{ conversa: object, selecionada: boolean, onSelecionar: (id) => void }} props
 */
export default function CardConversa({ conversa, selecionada, onSelecionar }) {
  const badge = badgeDoCard(conversa);

  return (
    <button
      type="button"
      className={`card-conversa lf-prioridade-${conversa.prioridade ?? 'nenhuma'}${
        selecionada ? ' selecionada' : ''
      }`}
      onClick={() => onSelecionar(conversa.id)}
      aria-pressed={selecionada}
    >
      <AvatarCanal />
      <span className="card-conversa-info">
        <span className="card-conversa-linha1">
          <IndicadorPrioridade prioridade={conversa.prioridade} />
          <span className="card-conversa-nome">{conversa.cliente.nome}</span>
          <span className="card-conversa-hora">
            {formatarHoraOuData(conversa.ultimaMensagem?.at)}
          </span>
        </span>
        <span className="card-conversa-previa">{conversa.ultimaMensagem?.texto}</span>
        <span className="card-conversa-badges">
          <Badge tone={badge.tone}>{badge.label}</Badge>
        </span>
      </span>
    </button>
  );
}
