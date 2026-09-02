/**
 * UTILITÁRIOS E HELPERS DO LOCALFLOW AI
 * 
 * Funções puras em JavaScript para formatação de dados visuais.
 */

/**
 * Formata uma string ISO de data para exibição amigável (ex: 13:45 ou 02/09/2026)
 * @param {string} isoString 
 * @returns {string} Data formatada
 */
export function formatarDataHora(isoString) {
  if (!isoString) return '';
  const data = new Date(isoString);
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formata o status do atendimento para um rótulo legível em português
 * @param {string} status 
 * @returns {string} Status formatado
 */
export function formatarStatus(status) {
  const mapaStatus = {
    em_andamento: 'Em Andamento',
    aguardando: 'Aguardando Atendimento',
    concluido: 'Concluído'
  };
  return mapaStatus[status] || status;
}
