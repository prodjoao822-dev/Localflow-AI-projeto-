/**
 * SERVIÇO DE AUTENTICAÇÃO (Communication Layer)
 *
 * Simula o módulo IAM do backend (JWT real virá depois). As telas de Login
 * chamam estas funções; quando o backend existir, basta trocar a
 * implementação interna por `fetch('/api/auth/login')` sem tocar nas telas.
 */

import { usuarioMock, atendentesMock } from '../mocks/dadosMock';

const DELAY_SIMULADO_MS = 450;

/** Contrato de um usuário autenticado (o que as telas consomem) */
export const usuarios = [
  {
    id: usuarioMock.id,
    nome: usuarioMock.nome,
    email: usuarioMock.email,
    senha: usuarioMock.senha,
    perfil: 'admin',
    ativo: true,
  },
  ...atendentesMock.map((a) => ({
    id: a.id,
    nome: a.nome,
    email: a.email,
    senha: '123456',
    perfil: 'atendente',
    ativo: a.ativo,
  })),
];

function simularDelay() {
  return new Promise((resolve) => setTimeout(resolve, DELAY_SIMULADO_MS));
}

export const authService = {
  /**
   * Autentica com email + senha.
   * @param {{ email: string, senha: string }} credenciais
   * @returns {Promise<{ id, nome, email, perfil }>}
   */
  async login({ email, senha }) {
    await simularDelay();
    const usuario = usuarios.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.senha === senha
    );
    if (!usuario) {
      throw new Error('E-mail ou senha inválidos.');
    }
    if (!usuario.ativo) {
      throw new Error('Usuário inativo. Procure o administrador.');
    }
    return { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil };
  },

  /**
   * Busca um usuário por id (ex.: restaurar sessão).
   * @returns {Promise<{ id, nome, email, perfil } | null>}
   */
  async buscarPorId(id) {
    await simularDelay();
    const usuario = usuarios.find((u) => u.id === id);
    if (!usuario) return null;
    return { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil };
  },
};
