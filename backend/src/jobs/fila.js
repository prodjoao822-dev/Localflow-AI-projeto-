// FILAS ASSÍNCRONAS — Redis + BullMQ (decisão confirmada do MVP)
//
// Por que fila? A Evolution API (WhatsApp) espera um 200 OK rápido no webhook.
// Se processarmos a IA dentro da requisição do webhook, pode estourar o
// timeout (Risco 1 da arquitetura). Com fila: o webhook só grava a mensagem
// e publica um job; um WORKER processa depois, sem pressa e com retry.
//
// Esta fundação já entrega o desenho pedido no roadmap:
// - retry com backoff exponencial (tentar de novo, esperando cada vez mais)
// - dead-letter (job que falha muitas vezes vai para uma fila de "defuntos"
//   para análise, em vez de sumir ou travar a fila principal)

import { Queue, Worker } from 'bullmq';
import { config } from '../config/index.js';
import { logger } from '../config/logger.js';

// BullMQ pede uma conexão separada para "events" — por isso maxRetries etc.
const opcoesConexao = {
  url: config.redisUrl,
  maxRetriesPerRequest: null, // necessário para o BullMQ funcionar bem
};

/**
 * Cria uma fila com política de retry/backoff e dead-letter.
 * @param {string} nome - ex: 'conversation.process-message'
 * @param {(job) => Promise<any>} processador - função que executa o job
 */
export function criarFila(nome, processador) {
  const fila = new Queue(nome, { connection: opcoesConexao });

  const worker = new Worker(
    nome,
    async (job) => processador(job),
    {
      connection: opcoesConexao,
      // Retry limitado com backoff exponencial: 1s → 2s → 4s → 8s...
      // Evita martelar um serviço que está fora do ar.
      attempts: 5,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: { count: 1000 }, // mantém histórico enxuto
      removeOnFail: false, // falhas ficam para virar dead-letter/inspeção
    }
  );

  worker.on('failed', (job, err) => {
    // Se esgotou TODAS as tentativas, registramos como dead-letter.
    if (job && job.attemptsMade >= (job.opts?.attempts ?? 1)) {
      logger.error(
        { fila: nome, jobId: job.id, erro: err.message },
        'Job em dead-letter após esgotar retries'
      );
    } else {
      logger.warn(
        { fila: nome, jobId: job?.id, tentativa: job?.attemptsMade, erro: err.message },
        'Job falhou; retry agendado'
      );
    }
  });

  return { fila, worker };
}

export { opcoesConexao };
