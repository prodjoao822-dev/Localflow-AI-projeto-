// JOB CONTROLADO DE DEMONSTRAÇÃO (critério da Etapa 2: "processa um job controlado")
//
// Job de exemplo que valida o caminho completo: publicar → worker processar
// → retry se falhar → dead-letter se esgotar. As etapas seguintes do roadmap
// (Etapa 5/6/7) trocarão a lógica do processador por regras reais
// (processar mensagem com IA, enviar ao WhatsApp etc).

import { logger } from '../config/logger.js';

export const NOME_FILA_DEMO = 'demo.processar';

export function processadorDemo(job) {
  logger.info({ jobId: job.id, dados: job.data }, 'Job demo processado');
  return { ok: true, recebido: job.data };
}
