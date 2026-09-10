// MIDDLEWARE DE ERROS (último da cadeia de middlewares do Express)
//
// Toda rota que jogar um erro (ex: service lançou ErroNaoEncontrado) cai aqui.
// Centralizamos a "tradução" para o formato de resposta acordado:
//   sucesso → { data, meta }   |   erro → { error: { code, message, details? } }
//
// Se o erro NÃO for um AppError nosso, é um bug inesperado: logamos completo
// (para depurar) e devolvemos 500 genérico SEM detalhes internos — detalhes de
// stack trace nunca devem vazar para o cliente.

import { AppError } from '../config/erros.js';
import { logger } from '../config/logger.js';

export function middlewareErros(erro, req, res, _next) {
  if (erro instanceof AppError) {
    // Erro de negócio: esperado, não precisa de stack trace no log.
    return res.status(erro.status).json({
      error: { code: erro.code, message: erro.message, details: erro.details },
    });
  }

  // Erro inesperado: registramos tudo no log do servidor...
  logger.error({ err: erro, rota: req.originalUrl }, 'Erro não tratado');
  // ...mas respondemos com o mínimo para o cliente.
  return res.status(500).json({
    error: { code: 'ERRO_INTERNO', message: 'Erro interno do servidor.' },
  });
}
