// ERROS PADRÃO DA APLICAÇÃO
//
// Por que classes de erro próprias? Para que a camada de rota HTTP não precise
// "adivinhar" o que aconteceu no service. O service lança um erro de negócio
// (ex: AppError com código 'CONVERSA_NAO_ENCONTRADA') e o middleware de erro
// traduz isso para a resposta JSON padronizada do planejamento:
//   { error: { code, message, details? } }

export class AppError extends Error {
  /**
   * @param {string} code - código estável (o frontend pode usar para decidir UX)
   * @param {string} message - mensagem legível em português
   * @param {number} status - status HTTP correspondente
   * @param {object} [details] - dados extras opcionais (ex: erros de campo)
   */
  constructor(code, message, status = 400, details) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class ErroNaoEncontrado extends AppError {
  constructor(recurso = 'Recurso') {
    super('NAO_ENCONTRADO', `${recurso} não encontrado.`, 404);
  }
}

export class ErroValidacao extends AppError {
  constructor(details) {
    super('VALIDACAO_FALHOU', 'Dados inválidos.', 400, details);
  }
}

export class ErroAcessoNegado extends AppError {
  constructor(message = 'Acesso negado.') {
    super('ACESSO_NEGADO', message, 403);
  }
}
