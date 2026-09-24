/**
 * SERVIÇO DE AUTENTICAÇÃO (Communication Layer)
 *
 * Simula o módulo IAM do backend (JWT real virá depois). As telas chamam
 * estas funções; quando o backend existir, troca-se a implementação interna
 * por `fetch('/api/v1/auth/login')` sem tocar nas telas.
 */

import { bancoUsuarios, semSenha } from '../mocks/bancoUsuarios';

const DELAY_SIMULADO_MS = 450;

function simularDelay() {
  return new Promise((resolve) => setTimeout(resolve, DELAY_SIMULADO_MS));
}

/** O que as telas recebem de um usuário autenticado. */
function paraSessao(usuario) {
  const { id, nome, email, perfil } = semSenha(usuario);
  return { id, nome, email, perfil };
}

export const authService = {
  /**
   * POST /auth/login
   * @param {{ email: string, senha: string }} credenciais
   * @returns {Promise<{ id, nome, email, perfil }>}
   */
  async login({ email, senha }) {
    await simularDelay();
    const usuario = bancoUsuarios.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.senha === senha
    );
    if (!usuario) {
      throw new Error('E-mail ou senha inválidos.');
    }
    if (!usuario.ativo) {
      throw new Error('Usuário desativado. Procure o administrador.');
    }
    if (usuario.primeiroAcessoPendente) {
      // RN05: o painel só é liberado depois da troca obrigatória de senha.
      // A tela de troca é da etapa IAM — até lá, o acesso fica bloqueado.
      throw new Error(
        'Primeiro acesso: é preciso trocar a senha inicial, mas essa tela ainda não existe (etapa IAM).'
      );
    }
    return paraSessao(usuario);
  },

  /**
   * GET /auth/me — restaura a sessão. Usuário desativado perde a sessão.
   * @returns {Promise<{ id, nome, email, perfil } | null>}
   */
  async buscarPorId(id) {
    await simularDelay();
    const usuario = bancoUsuarios.find((u) => u.id === id);
    if (!usuario || !usuario.ativo) return null;
    return paraSessao(usuario);
  },
};
