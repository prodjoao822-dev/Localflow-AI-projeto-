// CONFIGURAÇÃO CENTRAL
//
// Por que centralizar? Para que nenhum módulo leia process.env direto.
// Assim temos um único lugar que (a) carrega o .env, (b) valida o que é
// obrigatório e (c) falha RÁPIDO com mensagem clara se faltar algo —
// em vez de descobrir o erro no meio de uma requisição.

import 'dotenv/config';

function obrigatorio(nome) {
  const valor = process.env[nome];
  if (!valor) {
    // Falha cedo e com mensagem didática: é melhor o servidor nem subir
    // do que subir "meio quebrado" e o erro aparecer longe da causa.
    throw new Error(
      `Variável de ambiente obrigatória ausente: ${nome}. ` +
        `Copie backend/.env.example para backend/.env e preencha.`
    );
  }
  return valor;
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  porta: Number(process.env.PORT || 3333),

  databaseUrl: obrigatorio('DATABASE_URL'),
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT só será usado na Etapa 3; já reservamos o lugar aqui.
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
};
