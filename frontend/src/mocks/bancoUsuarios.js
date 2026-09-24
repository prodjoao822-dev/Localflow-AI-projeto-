/**
 * "Tabela de usuários" em memória, compartilhada por authService e
 * atendenteService — como seria uma única tabela Usuario no banco.
 * Assim, desativar um atendente bloqueia o login dele de verdade no protótipo.
 *
 * A `senha` em texto só existe neste mock. No backend real ela vira
 * `senhaHash` e NUNCA sai do servidor (RNF01 / contrato de Atendentes).
 */

import { usuarioMock, atendentesMock } from './dadosMock';

const SENHA_MOCK_ATENDENTES = '123456';

export const bancoUsuarios = [
  { ...usuarioMock, ativo: true, primeiroAcessoPendente: false },
  ...atendentesMock.map((a) => ({ ...a, senha: SENHA_MOCK_ATENDENTES })),
];

/** Remove campos sensíveis antes de devolver para qualquer tela. */
export function semSenha(usuario) {
  const publico = { ...usuario };
  delete publico.senha;
  return publico;
}
