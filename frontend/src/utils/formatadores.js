/**
 * UTILITÁRIOS E HELPERS DO LOCALFLOW AI
 *
 * Funções puras de formatação e mapeamento de estados.
 * A partir daqui, a camada visual consome APENAS estes rótulos
 * (não sabe nada sobre os valores internos do contrato).
 */

/**
 * Formata uma string ISO para hora local (ex.: 13:45).
 */
export function formatarHora(isoString) {
  if (!isoString) return '';
  const data = new Date(isoString);
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formata uma string ISO para data curta (ex.: 02/09/2026).
 */
export function formatarData(isoString) {
  if (!isoString) return '';
  const data = new Date(isoString);
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Formata uma string ISO para data + hora curtas (ex.: 02/09/2026 13:45).
 */
export function formatarDataHora(isoString) {
  if (!isoString) return '';
  return `${formatarData(isoString)} ${formatarHora(isoString)}`;
}

/**
 * Horário para listas: hora se for hoje (09:12), senão dia/mês (29/05).
 */
export function formatarHoraOuData(isoString) {
  if (!isoString) return '';
  const data = new Date(isoString);
  const hoje = new Date();
  if (data.toDateString() === hoje.toDateString()) return formatarHora(isoString);
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

/**
 * Momento de uma mensagem/evento: hora se for hoje (08:55), senão
 * dia/mês + hora (04/09 08:31) — no histórico a hora sempre importa.
 */
export function formatarMomento(isoString) {
  if (!isoString) return '';
  const data = new Date(isoString);
  if (data.toDateString() === new Date().toDateString()) return formatarHora(isoString);
  const dia = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  return `${dia} ${formatarHora(isoString)}`;
}

/**
 * Formata uma string ISO para um rótulo relativo curto (ex.: "agora",
 * "5 min", "2 h", "3 dias").
 */
export function formatarTempoRelativo(isoString) {
  if (!isoString) return '';
  const diffMs = Date.now() - new Date(isoString).getTime();
  if (diffMs < 0) return 'agora';
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} ${d === 1 ? 'dia' : 'dias'}`;
  return formatarData(isoString);
}

/**
 * Rótulo e tom visual do estado da conversa (RF18 / RN08).
 * Contrato oficial: 4 estados. `resolvida`/`perdida` NÃO são estados —
 * são resultados de finalização (ver RESULTADO_FINAL).
 * Tons: 'neutral' | 'info' | 'warning' | 'danger' | 'success' | 'ia'
 * (mapeados para os tokens semânticos em Badge.css).
 */
export const STATUS_CONVERSA = {
  nova: { label: 'Nova', tone: 'neutral' },
  em_atendimento: { label: 'Em atendimento', tone: 'info' },
  aguardando_cliente: { label: 'Aguardando cliente', tone: 'warning' },
  finalizada: { label: 'Finalizada', tone: 'neutral' },
};

export function rotuloStatus(status) {
  return STATUS_CONVERSA[status] || { label: status, tone: 'neutral' };
}

/** needsAction é flag, não estado — mas tem rótulo visual próprio. */
export const PRECISA_DE_ACAO = { label: 'Precisa de ação', tone: 'danger' };

/** Rótulo e tom do resultado de finalização (RN08): 'resolvida' | 'perdida'. */
export const RESULTADO_FINAL = {
  resolvida: { label: 'Resolvida', tone: 'success' },
  perdida: { label: 'Perdida', tone: 'danger' },
};

export function rotuloResultadoFinal(resultado) {
  return RESULTADO_FINAL[resultado] || { label: resultado, tone: 'neutral' };
}

/** Rótulo da classificação de intenção da IA (RF06). */
export const INTENCAO = {
  venda_rapida: 'Venda rápida',
  venda_sob_medida: 'Venda sob medida',
  duvida: 'Dúvida',
  faq: 'FAQ',
  reclamacao: 'Reclamação',
};

export function rotuloIntencao(intencao) {
  return INTENCAO[intencao] || 'Não classificada';
}

/**
 * Rótulo da prioridade (RF06). O valor técnico é sempre alta|media|baixa
 * (contrato/schema). O texto exibido fica SÓ aqui: se o produto decidir
 * usar "Quente/Morna/Fria" como label visual, troca-se apenas `label`.
 * A cor vem do token --prioridade-{valor}.
 */
export const PRIORIDADE = {
  alta: { label: 'Alta', ordem: 0 },
  media: { label: 'Média', ordem: 1 },
  baixa: { label: 'Baixa', ordem: 2 },
};

export function rotuloPrioridade(prioridade) {
  return PRIORIDADE[prioridade]?.label || 'Sem prioridade';
}

/** Rótulo do tipo de interação da IA (RF07/RN02). */
export const INTERACAO_IA = {
  classificacao: 'Classificação de intenção',
  resposta_faq: 'Resposta automática (FAQ)',
  coleta_dado: 'Coleta de dado',
  escalada: 'Escalada para atendente',
  mensagem_espera: 'Mensagem de espera',
};

export function rotuloInteracaoIA(tipo) {
  return INTERACAO_IA[tipo] || tipo;
}

/** Iniciais para avatar de texto (sem depender de serviço externo). */
export function iniciais(nome = '') {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  const primeira = partes[0][0] || '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}
