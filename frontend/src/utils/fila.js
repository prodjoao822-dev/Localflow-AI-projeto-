import { PRIORIDADE } from './formatadores';

/**
 * Organização da fila de conversas (RF05 / RF06).
 *
 * Regra travada: ordenar pelo ESTADO primeiro e pela PRIORIDADE da IA depois.
 * "Precisam de ação" não é estado (RN08) — é a flag needsAction, e vem no topo
 * porque é onde o atendente precisa agir. Cada conversa aparece em UM grupo só.
 */
export const GRUPOS_FILA = [
  { id: 'acao', titulo: 'Precisam de ação', tone: 'danger' },
  { id: 'nova', titulo: 'Novas', tone: 'neutral' }, // [ASSUMIDO] não aparece no PNG
  { id: 'em_atendimento', titulo: 'Em atendimento', tone: 'info' },
  { id: 'aguardando_cliente', titulo: 'Aguardando cliente', tone: 'warning' },
  { id: 'finalizada', titulo: 'Finalizados / Perdidos', tone: 'neutral' },
];

/** Em qual grupo a conversa entra. Finalizada nunca "precisa de ação". */
export function grupoDaConversa(conversa) {
  if (conversa.needsAction && conversa.status !== 'finalizada') return 'acao';
  return conversa.status;
}

/** Dentro do grupo: prioridade (alta → baixa), depois a mais recente primeiro. */
function compararNoGrupo(a, b) {
  const ordemA = PRIORIDADE[a.prioridade]?.ordem ?? 99;
  const ordemB = PRIORIDADE[b.prioridade]?.ordem ?? 99;
  if (ordemA !== ordemB) return ordemA - ordemB;
  return new Date(b.ultimaMensagem?.at ?? 0) - new Date(a.ultimaMensagem?.at ?? 0);
}

/**
 * Agrupa e ordena a lista vinda de GET /conversas.
 * @returns {Array<{ id, titulo, tone, conversas: Array }>} grupos na ordem da fila
 */
export function agruparFila(conversas) {
  return GRUPOS_FILA.map((grupo) => ({
    ...grupo,
    conversas: conversas
      .filter((c) => grupoDaConversa(c) === grupo.id)
      .sort(compararNoGrupo),
  }));
}
