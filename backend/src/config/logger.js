// LOGGING
//
// Usamos pino porque é rápido e estruturado (JSON). Em desenvolvimento o
// pino-pretty formata bonitinho no console. Em produção, logs JSON são mais
// fáceis de consultar/filtrar.
//
// Regra de segurança: NUNCA logar segredos (senhas, tokens, credenciais).
// Nos módulos futuros, passe apenas identificadores, nunca objetos com senha.

import pino from 'pino';
import { config } from './index.js';

export const logger = pino({
  level: config.env === 'test' ? 'silent' : 'info',
  transport:
    config.env === 'development' ? { target: 'pino-pretty' } : undefined,
});
