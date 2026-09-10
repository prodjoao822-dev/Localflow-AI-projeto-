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
 * Rótulo e tom visual do estado da oportunidade (RF18 / RN08).
 * Contrato oficial: 4 estados. `resolvida`/`perdida` NÃO são estados —
 * são resultados de finalização (ver rotuloResultadoFinal).
 */
export const OPORTUNIDADE = {
  nova: { label: 'Nova', tone: 'accent' },
  em_atendimento: { label: 'Em atendimento', tone: 'neutral' },
  aguardando_cliente: { label: 'Aguardando cliente', tone: 'warning' },
  finalizada: { label: 'Finalizada', tone: 'neutral' },
};

export function rotuloOportunidade(status) {
  return OPORTUNIDADE[status] || { label: status, tone: 'neutral' };
}

/** Rótulo e tom do resultado de finalização (RN08): 'resolvida' | 'perdida'. */
export const RESULTADO_FINAL = {
  resolvida: { label: 'Resolvida', tone: 'success' },
  perdida: { label: 'Perdida', tone: 'danger' },
};

export function rotuloResultadoFinal(resultado) {
  return RESULTADO_FINAL[resultado] || { label: resultado, tone: 'neutral' };
}

/** Rótulo e tom da classificação de intenção da IA (RF06). */
export const INTENCAO = {
  venda_rapida: { label: 'Venda rápida', tone: 'accent' },
  venda_sob_medida: { label: 'Venda sob medida', tone: 'accent' },
  duvida: { label: 'Dúvida', tone: 'neutral' },
  faq: { label: 'FAQ', tone: 'neutral' },
  reclamacao: { label: 'Reclamação', tone: 'danger' },
};

export function rotuloIntencao(intencao) {
  return INTENCAO[intencao] || { label: intencao, tone: 'neutral' };
}

/** Rótulo e tom da prioridade (RF06). */
export const PRIORIDADE = {
  alta: { label: 'Prioridade alta', tone: 'danger' },
  media: { label: 'Prioridade média', tone: 'warning' },
  baixa: { label: 'Prioridade baixa', tone: 'neutral' },
};

export function rotuloPrioridade(prioridade) {
  return PRIORIDADE[prioridade] || { label: prioridade, tone: 'neutral' };
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
