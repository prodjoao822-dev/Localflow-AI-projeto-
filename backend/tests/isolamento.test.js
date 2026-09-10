// TESTES DE ISOLAMENTO POR EMPRESA (RN04) — critério da Etapa 2
//
// O que está sendo testado aqui é a PORTA DE ENTRADA do isolamento:
// nenhuma requisição deve chegar às regras de negócio sem um contexto de
// empresa válido. Quando a Etapa 5 criar as rotas de conversas, estes testes
// ganharão companheiros que verificam o filtro no banco (ex: usuário da
// empresa A não lê conversa da empresa B).

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { criarApp } from '../src/server.js';
import { contextoEmpresa } from '../src/middlewares/contextoEmpresa.js';
import { ErroAcessoNegado } from '../src/config/erros.js';

describe('Contexto de empresa (RN04)', () => {
  test('rejeita requisição sem x-empresa-id (fail closed)', () => {
    process.env.NODE_ENV = 'development';

    const req = { header: () => undefined };
    let capturado = null;
    contextoEmpresa(req, {}, (erro) => {
      capturado = erro;
    });

    assert.ok(capturado instanceof ErroAcessoNegado, 'deve negar acesso sem contexto');
  });

  test('injeta empresaId quando o header de desenvolvimento está presente', () => {
    process.env.NODE_ENV = 'development';

    const req = { header: (n) => (n === 'x-empresa-id' ? 'emp-001' : undefined) };
    let chamouNext = false;
    contextoEmpresa(req, {}, () => {
      chamouNext = true;
    });

    assert.equal(chamouNext, true);
    assert.equal(req.empresaId, 'emp-001');
  });

  test('criarApp registra health check antes do contexto de empresa', () => {
    const app = criarApp();

    // Percorremos a pilha de middlewares do Express na ordem em que foram
    // registrados. O health check precisa vir ANTES do contextoEmpresa,
    // senão o monitoramento não conseguiria alcançá-lo.
    const pilha = app._router?.stack ?? [];
    const indiceHealth = pilha.findIndex(
      (camada) => camada.route?.path === '/health'
    );
    const indiceContexto = pilha.findIndex(
      (camada) => camada.name === 'contextoEmpresa'
    );

    assert.ok(indiceHealth !== -1, 'health check deve existir');
    assert.ok(indiceContexto !== -1, 'middleware de contexto deve existir');
    assert.ok(
      indiceHealth < indiceContexto,
      'health check deve vir antes do contexto de empresa'
    );
  });
});
