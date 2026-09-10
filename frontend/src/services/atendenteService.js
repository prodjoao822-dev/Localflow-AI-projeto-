/**
 * SERVIÇO DE ATENDENTES (Communication Layer)
 *
 * Espelha o módulo "Tenant" (cadastro de empresa e atendentes) do backend.
 * Implementa o CRUD básico de atendentes (RF02) sobre uma cópia em memória.
 * O fluxo completo de cadastro (permissões, aprovação) é [PENDENTE] nos
 * requisitos — ver placeholders nas telas.
 */

import { atendentesMock } from '../mocks/dadosMock';

const DELAY_SIMULADO_MS = 450;

let banco = atendentesMock.map((a) => ({ ...a }));

function simularDelay() {
  return new Promise((resolve) => setTimeout(resolve, DELAY_SIMULADO_MS));
}

export const atendenteService = {
  /** Lista todos os atendentes cadastrados (RF02). */
  async listar() {
    await simularDelay();
    return banco.map((a) => ({ ...a }));
  },

  /** Busca um atendente por id. */
  async buscarPorId(id) {
    await simularDelay();
    const encontrado = banco.find((a) => a.id === id);
    return encontrado ? { ...encontrado } : null;
  },

  /**
   * Cadastra um novo atendente (RF02).
   * @param {{ nome, email, telefone }} dados
   */
  async criar(dados) {
    await simularDelay();
    if (banco.some((a) => a.email.toLowerCase() === dados.email.trim().toLowerCase())) {
      throw new Error('Já existe um atendente com este e-mail.');
    }
    const novo = {
      id: `atend-${Date.now()}`,
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      telefone: dados.telefone.trim(),
      perfil: 'atendente',
      ativo: true,
      criadoEm: new Date().toISOString(),
    };
    banco.push(novo);
    return { ...novo };
  },

  /** Edita um atendente existente (RF02). */
  async atualizar(id, dados) {
    await simularDelay();
    const indice = banco.findIndex((a) => a.id === id);
    if (indice === -1) throw new Error('Atendente não encontrado.');
    const duplicado = banco.some(
      (a) =>
        a.id !== id &&
        a.email.toLowerCase() === dados.email.trim().toLowerCase()
    );
    if (duplicado) throw new Error('Já existe um atendente com este e-mail.');
    banco[indice] = { ...banco[indice], ...dados, email: dados.email.trim() };
    return { ...banco[indice] };
  },

  /** Remove (desativa) um atendente (RF02). */
  async remover(id) {
    await simularDelay();
    const indice = banco.findIndex((a) => a.id === id);
    if (indice === -1) throw new Error('Atendente não encontrado.');
    banco.splice(indice, 1);
    return { ok: true };
  },
};
