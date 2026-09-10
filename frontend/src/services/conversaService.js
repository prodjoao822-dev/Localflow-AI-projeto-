/**
 * SERVIÇO DE CONVERSAS / INBOX (Communication Layer)
 *
 * Espelha o módulo "Inbox / Atendimento" do backend. Hoje opera sobre uma
 * cópia em memória dos mocks (com delay simulado); quando a API real
 * existir, troca-se apenas o corpo destas funções por `fetch()`.
 */

import { conversasMock, interacoesMock } from '../mocks/dadosMock';

const DELAY_SIMULADO_MS = 450;

// Cópia profunda em memória: o protótipo pode mutar (assumir, enviar, mudar
// estado) sem contaminar o arquivo de mocks.
const estadoInicial = () =>
  JSON.parse(JSON.stringify({ conversas: conversasMock, interacoes: interacoesMock }));

let banco = estadoInicial();

function simularDelay() {
  return new Promise((resolve) => setTimeout(resolve, DELAY_SIMULADO_MS));
}

/** Traduz uma interação para a "linha do tempo" visível ao atendente. */
function montarTimelineInteracoes(conversa) {
  const interacoes = banco.interacoes[conversa.id] || [];
  return interacoes.map((inter) => ({
    id: inter.id,
    dataHora: inter.dataHora,
    tipo: inter.tipo,
    detalhes: inter.detalhes,
  }));
}

export const conversaService = {
  /**
   * Lista as conversas da fila (RF05) com a classificação da IA (RF06).
   * @returns {Promise<Array>} conversas (sem histórico, para a fila)
   */
  async listarConversas() {
    await simularDelay();
    return banco.conversas.map((conversa) => ({
      id: conversa.id,
      cliente: conversa.cliente,
      status: conversa.status,
      resultadoFinal: conversa.resultadoFinal ?? null,
      intencao: conversa.intencao,
      prioridade: conversa.prioridade,
      atendenteId: conversa.atendenteId,
      ultimaMensagem: conversa.ultimaMensagem,
      ultimaAtualizacao: conversa.ultimaAtualizacao,
      naoLidas: conversa.naoLidas,
    }));
  },

  /**
   * Busca uma conversa com histórico de mensagens (RF17) e interações da IA
   * registradas (RF07/RN02).
   * @param {string} id
   * @returns {Promise<{ conversa, mensagens, interacoes } | null>}
   */
  async buscarConversaPorId(id) {
    await simularDelay();
    const conversa = banco.conversas.find((c) => c.id === id);
    if (!conversa) return null;
    return {
      conversa: { ...conversa, mensagens: undefined },
      mensagens: conversa.mensagens,
      interacoes: montarTimelineInteracoes(conversa),
    };
  },

  /**
   * Atendente assume a conversa (RF08).
   * @param {string} conversaId
   * @param {string} atendenteId
   */
  async assumirConversa(conversaId, atendenteId) {
    await simularDelay();
    const conversa = banco.conversas.find((c) => c.id === conversaId);
    if (!conversa) throw new Error('Conversa não encontrada.');
    conversa.atendenteId = atendenteId;
    if (conversa.status === 'nova') conversa.status = 'em_atendimento';
    return { ...conversa, mensagens: undefined };
  },

  /**
   * Envia uma mensagem como atendente (RF17) e devolve o estado atualizado.
   * @param {string} conversaId
   * @param {string} atendenteId
   * @param {string} texto
   */
  async enviarMensagem(conversaId, atendenteId, texto) {
    await simularDelay();
    const conversa = banco.conversas.find((c) => c.id === conversaId);
    if (!conversa) throw new Error('Conversa não encontrada.');

    const novaMensagem = {
      id: `msg-${Date.now()}`,
      remetente: 'atendente',
      texto,
      dataHora: new Date().toISOString(),
      autorId: atendenteId,
      autorNome: null,
    };
    conversa.mensagens.push(novaMensagem);
    conversa.ultimaMensagem = texto;
    conversa.ultimaAtualizacao = novaMensagem.dataHora;
    conversa.naoLidas = 0;

    return {
      conversa: { ...conversa, mensagens: undefined },
      mensagens: conversa.mensagens,
      interacoes: montarTimelineInteracoes(conversa),
    };
  },

  /**
   * Atualiza o estado da oportunidade (RF18 / RN08).
   * Contrato oficial: 4 estados ('nova', 'em_atendimento', 'aguardando_cliente',
   * 'finalizada'). 'resolvida'/'perdida' não são estados — são resultados de
   * finalização e chegam como `resultadoFinal` quando o estado é 'finalizada'.
   * Uma conversa finalizada NÃO reabre automaticamente (decisão confirmada);
   * reabrir é ação manual explícita do atendente (fora deste serviço por ora).
   *
   * @param {string} conversaId
   * @param {'nova'|'em_atendimento'|'aguardando_cliente'|'finalizada'} status
   * @param {'resolvida'|'perdida'|null} [resultadoFinal] obrigatório se status = 'finalizada'
   */
  async atualizarStatus(conversaId, status, resultadoFinal = null) {
    await simularDelay();
    const conversa = banco.conversas.find((c) => c.id === conversaId);
    if (!conversa) throw new Error('Conversa não encontrada.');

    const STATUS_VALIDOS = ['nova', 'em_atendimento', 'aguardando_cliente', 'finalizada'];
    if (!STATUS_VALIDOS.includes(status)) {
      // Rejeita estados fora do contrato RN08 (ex.: alguém passando 'resolvida').
      throw new Error(`Estado inválido: ${status}. Use o contrato RN08 (4 estados).`);
    }
    if (status === 'finalizada' && !['resolvida', 'perdida'].includes(resultadoFinal)) {
      throw new Error('Finalizar exige resultadoFinal: "resolvida" ou "perdida".');
    }

    conversa.status = status;
    // Ao sair de 'finalizada' (reabertura manual), o resultado antigo é limpo.
    conversa.resultadoFinal = status === 'finalizada' ? resultadoFinal : null;
    return { ...conversa, mensagens: undefined };
  },
};
