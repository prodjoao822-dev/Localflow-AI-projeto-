/**
 * SERVIÇO DE CONVERSAS / INBOX (Communication Layer)
 *
 * Cada função espelha uma rota do contrato planejado
 * (docs/planejamento-arquitetura.md, seção 5 — prefixo /api/v1) e devolve
 * o mesmo formato de resposta ({ data, meta }). Hoje opera sobre uma
 * cópia em memória dos mocks; quando a API existir, troca-se só o corpo
 * destas funções por `fetch()`.
 *
 * As validações de regra de negócio aqui (ex.: só o responsável marca
 * 'perdida') simulam o que o BACKEND fará — a regra não pode viver só na
 * tela (docs/arquitetura.md, risco 3).
 */

import { conversasMock } from '../mocks/dadosMock';

const DELAY_SIMULADO_MS = 450;

const STATUS_VALIDOS = ['nova', 'em_atendimento', 'aguardando_cliente', 'finalizada'];
const RESULTADOS_VALIDOS = ['resolvida', 'perdida'];

// Cópia profunda em memória: o protótipo pode mutar sem alterar o arquivo de mocks.
const banco = structuredClone(conversasMock);

function simularDelay() {
  return new Promise((resolve) => setTimeout(resolve, DELAY_SIMULADO_MS));
}

function encontrar(id) {
  const conversa = banco.find((c) => c.id === id);
  if (!conversa) throw new Error('Conversa não encontrada.');
  return conversa;
}

/** Formato "resumo de lista" do contrato (GET /conversas). */
function paraResumo(conversa) {
  const ultima = conversa.mensagens[conversa.mensagens.length - 1];
  return {
    id: conversa.id,
    cliente: { ...conversa.cliente },
    status: conversa.status,
    // [ASSUMIDO] resultadoFinal não está no exemplo de lista do contrato,
    // mas é campo da Conversa e a fila precisa dele para "Finalizados".
    resultadoFinal: conversa.resultadoFinal,
    intencao: conversa.intencao,
    prioridade: conversa.prioridade,
    atendenteResponsavel: conversa.atendenteResponsavel && { ...conversa.atendenteResponsavel },
    needsAction: conversa.needsAction,
    ultimaMensagem: ultima ? { texto: ultima.texto, at: ultima.createdAt } : null,
  };
}

/** Formato de detalhe (GET /conversas/:id). */
function paraDetalhe(conversa) {
  return structuredClone(conversa);
}

export const conversaService = {
  /**
   * GET /conversas — fila (RF05) com classificação da IA (RF06).
   * @returns {Promise<{ data: Array, meta: { page, limit, total } }>}
   */
  async listar() {
    await simularDelay();
    const data = banco.map(paraResumo);
    return { data, meta: { page: 1, limit: data.length, total: data.length } };
  },

  /**
   * GET /conversas/:id — histórico (RF17) + interações da IA (RF07/RN02).
   * @returns {Promise<{ data: object }>}
   */
  async buscarPorId(id) {
    await simularDelay();
    return { data: paraDetalhe(encontrar(id)) };
  },

  /**
   * POST /conversas/:id/assumir — Atendente assume a conversa (RF08).
   * @param {{ id: string, nome: string }} usuario usuário autenticado
   */
  async assumir(id, usuario) {
    await simularDelay();
    const conversa = encontrar(id);
    if (conversa.atendenteResponsavel) {
      throw new Error('Esta conversa já tem um responsável.');
    }
    conversa.atendenteResponsavel = { id: usuario.id, nome: usuario.nome };
    if (conversa.status === 'nova') conversa.status = 'em_atendimento';
    return { data: paraDetalhe(conversa) };
  },

  /**
   * PATCH /conversas/:id/status — estado da oportunidade (RF18 / RN08).
   * - Só os 4 estados oficiais; 'finalizada' exige resultadoFinal.
   * - Só o atendente RESPONSÁVEL pode finalizar como 'perdida' (decisão confirmada).
   * - Conversa finalizada não reabre sozinha; reabrir = esta mesma ação, manual.
   */
  async atualizarStatus(id, { status, resultadoFinal = null }, usuario) {
    await simularDelay();
    const conversa = encontrar(id);

    if (!STATUS_VALIDOS.includes(status)) {
      throw new Error(`Estado inválido: ${status}.`);
    }
    if (status === 'finalizada' && !RESULTADOS_VALIDOS.includes(resultadoFinal)) {
      throw new Error('Finalizar exige o resultado: resolvida ou perdida.');
    }
    if (resultadoFinal === 'perdida' && conversa.atendenteResponsavel?.id !== usuario.id) {
      throw new Error('Só o atendente responsável pode marcar a conversa como perdida.');
    }

    conversa.status = status;
    conversa.resultadoFinal = status === 'finalizada' ? resultadoFinal : null;
    if (status === 'finalizada') conversa.needsAction = false;
    return { data: paraDetalhe(conversa) };
  },

  /**
   * POST /conversas/:id/mensagens — Atendente responde (RF17).
   * O envio real ao WhatsApp é do Provider Gateway (fora de escopo agora):
   * a mensagem nasce com statusEnvio 'pendente' e o mock a marca 'enviada'.
   */
  async enviarMensagem(id, texto, usuario) {
    await simularDelay();
    const conversa = encontrar(id);
    if (!conversa.atendenteResponsavel) {
      throw new Error('Assuma a conversa antes de responder.');
    }

    const mensagem = {
      id: `msg-${Date.now()}`,
      origem: 'atendente',
      autor: { id: usuario.id, nome: usuario.nome },
      texto,
      statusEnvio: 'enviada',
      createdAt: new Date().toISOString(),
    };
    conversa.mensagens.push(mensagem);
    // [ASSUMIDO] responder ao cliente conta como "ação humana tomada".
    conversa.needsAction = false;
    return { data: paraDetalhe(conversa) };
  },
};
