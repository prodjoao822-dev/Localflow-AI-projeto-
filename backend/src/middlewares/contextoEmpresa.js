// MIDDLEWARE DE CONTEXTO DE EMPRESA (RN04 — isolamento por Empresa)
//
// Este é um dos pontos mais importantes da arquitetura (Risco 2 do doc de
// arquitetura: "tenant leak").
//
// Papel dele: descobrir DE QUE EMPRESA é a requisição e INJETAR isso na
// requisição (req.empresaId). As regras de negócio (services) NUNCA devem
// aceitar empresaId vindo do corpo da requisição do cliente — senão um
// usuário mal-intencionado poderia passar o ID de outra empresa e ler dados
// alheios.
//
// Na Etapa 3, o empresaId virá do token JWT do usuário autenticado.
// Por enquanto (fundação), aceitamos um header de desenvolvimento para
// conseguir escrever os TESTES de isolamento antes do IAM existir.
// O bloco de produção abaixo deixa explícito que isso é provisório.

import { ErroAcessoNegado } from '../config/erros.js';

export function contextoEmpresa(req, _res, next) {
  // TODO (Etapa 3 — IAM): substituir por leitura do JWT:
  //   req.empresaId = req.usuario.empresaId
  if (process.env.NODE_ENV !== 'production' && req.header('x-empresa-id')) {
    req.empresaId = req.header('x-empresa-id');
    return next();
  }

  // Sem contexto de empresa, nada passa — fail closed (fecha a porta em vez
  // de abrir). É mais seguro negar tudo do que arriscar vazar dados.
  return next(new ErroAcessoNegado('Contexto de empresa ausente.'));
}
