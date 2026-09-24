/**
 * SERVIÇO DE ATENDENTES (Communication Layer)
 *
 * Cada função espelha uma rota do contrato planejado
 * (docs/planejamento-arquitetura.md, seção 5 — "Atendentes") e devolve
 * { data }. Somente o Admin gerencia atendentes; a senha nunca aparece na
 * resposta. Hoje opera sobre a tabela em memória `bancoUsuarios`.
 */

import { bancoUsuarios, semSenha } from '../mocks/bancoUsuarios';

const DELAY_SIMULADO_MS = 450;

function simularDelay() {
  return new Promise((resolve) => setTimeout(resolve, DELAY_SIMULADO_MS));
}

function encontrar(id) {
  const atendente = bancoUsuarios.find((u) => u.id === id && u.perfil === 'atendente');
  if (!atendente) throw new Error('Atendente não encontrado.');
  return atendente;
}

/** E-mail é único POR EMPRESA (schema Prisma). No mock há uma empresa só. */
function emailEmUso(email, ignorarId = null) {
  const alvo = email.trim().toLowerCase();
  return bancoUsuarios.some((u) => u.id !== ignorarId && u.email.toLowerCase() === alvo);
}

function validarDados({ nome, email }) {
  if (!nome?.trim()) throw new Error('Informe o nome.');
  if (!email?.trim()) throw new Error('Informe o e-mail.');
}

export const atendenteService = {
  /** GET /atendentes */
  async listar() {
    await simularDelay();
    const data = bancoUsuarios.filter((u) => u.perfil === 'atendente').map(semSenha);
    return { data };
  },

  /**
   * POST /atendentes — Admin cadastra com senha inicial (RN05).
   * O usuário nasce com primeiroAcessoPendente = true: a troca de senha é
   * obrigatória no primeiro login.
   * @param {{ nome, email, telefone, senhaInicial }} dados
   */
  async criar(dados) {
    await simularDelay();
    validarDados(dados);
    if (!dados.senhaInicial) throw new Error('Defina a senha inicial.');
    if (emailEmUso(dados.email)) throw new Error('Já existe um usuário com este e-mail.');

    const novo = {
      id: `atend-${Date.now()}`,
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      telefone: dados.telefone?.trim() || null,
      perfil: 'atendente',
      ativo: true,
      primeiroAcessoPendente: true,
      createdAt: new Date().toISOString(),
      senha: dados.senhaInicial, // só no mock — ver bancoUsuarios.js
    };
    bancoUsuarios.push(novo);
    return { data: semSenha(novo) };
  },

  /** PATCH /atendentes/:id — edita dados cadastrais (não mexe em senha). */
  async atualizar(id, dados) {
    await simularDelay();
    validarDados(dados);
    const atendente = encontrar(id);
    if (emailEmUso(dados.email, id)) throw new Error('Já existe um usuário com este e-mail.');
    atendente.nome = dados.nome.trim();
    atendente.email = dados.email.trim();
    atendente.telefone = dados.telefone?.trim() || null;
    return { data: semSenha(atendente) };
  },

  /**
   * POST /atendentes/:id/desativar — é assim que o contrato implementa o
   * "Remover" do RF02: o usuário não é apagado (mantém o histórico das
   * conversas que atendeu), só perde o acesso.
   */
  async desativar(id) {
    await simularDelay();
    const atendente = encontrar(id);
    atendente.ativo = false;
    return { data: semSenha(atendente) };
  },
};
