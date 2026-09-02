import { atendimentosMock } from '../mocks/atendimentosMock';

/**
 * SERVIÇO DE ATENDIMENTOS (Communication Layer)
 * 
 * Atualmente este serviço consome os dados falsos da pasta `mocks`.
 * Quando o backend Node.js + Express estiver pronto, alteraremos APENAS as
 * implementações internas destas funções para usar `fetch()` ou `axios`,
 * sem precisar alterar NENHUMA linha de código nas telas (components/pages).
 */

// Simulamos um delay de rede (500ms) para treinar o React com estados de "Carregando..." (Loading)
const DELAY_SIMULADO_MS = 500;

export const atendimentoService = {
  /**
   * Busca a lista completa de atendimentos
   * @returns {Promise<Array>} Lista de atendimentos
   */
  async buscarAtendimentos() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...atendimentosMock]);
      }, DELAY_SIMULADO_MS);
    });
  },

  /**
   * Busca um atendimento específico pelo seu ID
   * @param {string} id ID do atendimento
   * @returns {Promise<Object|null>} Objeto do atendimento encontrado
   */
  async buscarAtendimentoPorId(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const atendimento = atendimentosMock.find((item) => item.id === id);
        resolve(atendimento || null);
      }, DELAY_SIMULADO_MS);
    });
  },

  /**
   * Simula a adição de uma nova mensagem em um atendimento existente
   * @param {string} atendimentoId ID do atendimento
   * @param {string} textoConteudo Texto da mensagem enviada
   * @returns {Promise<Object>} Atendimento atualizado
   */
  async enviarMensagem(atendimentoId, textoConteudo) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const atendimento = atendimentosMock.find((item) => item.id === atendimentoId);
        
        if (!atendimento) {
          reject(new Error("Atendimento não encontrado"));
          return;
        }

        const novaMensagem = {
          id: `msg-${Date.now()}`,
          remetente: "atendente",
          texto: textoConteudo,
          dataHora: new Date().toISOString()
        };

        atendimento.mensagens.push(novaMensagem);
        atendimento.ultimaMensagem = textoConteudo;
        atendimento.dataAtualizacao = novaMensagem.dataHora;

        resolve({ ...atendimento });
      }, DELAY_SIMULADO_MS);
    });
  }
};
