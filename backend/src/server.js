// SERVIDOR HTTP — Express (monólito modular)
//
// "Monólito modular" = um único processo/deploy, mas o código é dividido em
// módulos com fronteiras claras (IAM, Tenant, CRM, Inbox, AI Core, Gateway).
// Este arquivo só MONTA a aplicação: middlewares globais, health check e
// rotas. As regras de negócio ficam em src/modules/*.

import express from 'express';
import { config } from './config/index.js';
import { logger } from './config/logger.js';
import { contextoEmpresa } from './middlewares/contextoEmpresa.js';
import { middlewareErros } from './middlewares/middlewareErros.js';
import { criarFila } from './jobs/fila.js';
import { NOME_FILA_DEMO, processadorDemo } from './jobs/jobDemo.js';

export function criarApp() {
  const app = express();

  // Parsers: o Express não entende JSON do corpo por padrão; isso habilita.
  app.use(express.json({ limit: '1mb' }));

  // Health check — usado por monitoramento/deploy para saber se está vivo.
  // Não exige autenticação nem contexto de empresa de propósito.
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', ambiente: config.env });
  });

  // Daqui para baixo, toda rota precisa de contexto de Empresa (RN04).
  app.use(contextoEmpresa);

  // Rotas dos módulos entram aqui nas próximas etapas:
  //   app.use('/api/v1/auth', rotasAuth);          (Etapa 3)
  //   app.use('/api/v1/clientes', rotasClientes);  (Etapa 4)
  //   app.use('/api/v1/conversas', rotasConversas);(Etapa 5)

  // Rota de exemplo para provar o contexto de empresa funcionando.
  app.get('/api/v1/eco', (req, res) => {
    res.json({ data: { empresaId: req.empresaId } });
  });

  // Middleware de erros SEMPRE por último na cadeia.
  app.use(middlewareErros);

  return app;
}

// Só inicia servidor e workers quando executado direto (node src/server.js).
// Assim os testes podem importar criarApp() sem abrir porta nem conectar no
// Redis — um padrão comum para testar Express de forma isolada.
if (process.env.NODE_ENV !== 'test') {
  const app = criarApp();

  // Critério da Etapa 2: "processa um job controlado" — worker demo no ar.
  const { fila } = criarFila(NOME_FILA_DEMO, processadorDemo);

  app.listen(config.porta, () => {
    logger.info(`LocalFlow AI backend escutando na porta ${config.porta}`);
    logger.info(`Fila "${NOME_FILA_DEMO}" pronta (Redis: ${config.redisUrl})`);
  });

  // Exporta para o job demo poder ser publicado manualmente em desenvolvimento.
  globalThis.__filaDemo = fila;
}
