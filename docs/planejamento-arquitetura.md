# LocalFlow AI — Planejamento de Arquitetura

Status: planejamento; não representa implementação concluída.

## 1. Objetivo arquitetural

O sistema deve transformar mensagens recebidas pelo WhatsApp em uma fila operacional organizada por intenção, prioridade e estado da oportunidade, permitindo ação humana e assistência de IA sem perder histórico.

Arquitetura-base já decidida:

- Frontend: React SPA.
- Backend: Node.js + Express em monólito modular.
- Banco: PostgreSQL com Prisma.
- WhatsApp: Evolution API.
- LLM: OpenRouter.
- Tempo real: Socket.io.
- Processamento assíncrono do MVP: Redis + BullMQ.
- AI Core: dentro do backend, isolado dos módulos HTTP e do provedor externo.

## 2. Módulos e responsabilidades

### IAM

Login, hash de senha, sessão/token, recuperação e ciclo de vida do usuário. Deve distinguir `admin` e `atendente`, mas não criar permissões granulares de Atendente no MVP.

### Tenant

Empresa, usuários vinculados, status da conta e contexto de isolamento. O middleware autentica e injeta `empresaId`; services não devem aceitar esse valor somente de dados enviados pelo cliente.

### CRM/Diretório

Cliente Final, dados de contato, observações e histórico resumido. O telefone deve ser normalizado por Empresa e servir para identificar o contato sem expor dados entre tenants.

### Inbox/Atendimento

Conversas, Mensagens, estado, prioridade, intenção, atribuição, fila geral, leitura, transições e comandos de envio.

### AI Core

Recebe um contexto interno da Conversa e produz uma decisão estruturada: classificar, responder FAQ, coletar dados, enviar espera ou escalar. Não deve conhecer payload da Evolution API nem persistir diretamente.

### Provider Gateway

Traduz payloads da Evolution API para eventos internos e comandos internos para o provedor. O payload externo não atravessa essa fronteira.

### Integrações

Credenciais, instância WhatsApp, estado de conexão, webhook e operações de teste. Segredos não devem ser devolvidos ao frontend.

## 3. Fluxo de mensagem

1. Evolution API envia webhook.
2. Provider Gateway valida autenticidade, normaliza o evento e aplica idempotência.
3. Inbox localiza ou cria Empresa/Cliente Final/Conversa e persiste a Mensagem recebida.
4. Inbox publica job `conversation.process-message` no BullMQ e responde rapidamente ao webhook.
5. Worker recupera o contexto e chama o AI Core.
6. AI Core chama OpenRouter usando contrato estruturado e regras do sistema.
7. Inbox persiste classificação, interação IA e eventual Mensagem de saída.
8. Provider Gateway envia a resposta ao WhatsApp; falha fica registrada para retry/dead-letter.
9. Socket.io publica atualização autorizada aos usuários da Empresa.

Jobs mínimos:

- `conversation.process-message`
- `message.send-provider`
- `conversation.notify-escalation`

Redis/BullMQ é decisão do MVP. O desenho deve incluir retry limitado, backoff, idempotency key, dead-letter e observabilidade de duração/erro.

## 4. Modelo de dados proposto

Todos os registros de negócio devem carregar `empresaId` diretamente ou ser alcançáveis por relação segura a uma Empresa. IDs podem ser UUIDs; timestamps devem ser UTC.

### Empresa

`id`, `nome`, `segmento` opcional, `status`, `createdAt`, `updatedAt`.

Relacionamentos: possui Usuários, Clientes Finais, Conversas e Integrações.

### Usuário

`id`, `empresaId`, `nome`, `email`, `telefone` opcional, `senhaHash`, `perfil`, `ativo`, `primeiroAcessoPendente` a confirmar, timestamps.

`perfil`: `admin` ou `atendente`.

### ClienteFinal

`id`, `empresaId`, `nome`, `telefone`, `email` opcional, `observacoes` opcional, timestamps e eventual `lastContactAt`.

Índice/constraint recomendada: telefone normalizado por Empresa, se a entrevista confirmar unicidade suficiente.

### Conversa

`id`, `empresaId`, `clienteFinalId`, `canal`, `externalConversationKey`, `status`, `resultadoFinal` opcional, `intencao`, `prioridade`, `atendenteResponsavelId` opcional, `needsAction`, `lastMessageAt`, timestamps.

`canal` começa com `whatsapp`. `externalConversationKey` deve ser único por Empresa e integração.

### Mensagem

`id`, `empresaId`, `conversaId`, `origem` (`cliente`, `ia`, `atendente`, possivelmente `sistema`), `autorUsuarioId` opcional, `externalMessageId` opcional, `texto`/payload normalizado, `statusEnvio`, `sentAt`, timestamps.

Mensagens de mídia podem exigir um payload de conteúdo extensível; isso deve ser decidido quando o canal for validado.

### InteraçãoIA — decisão pendente

Alternativa A: tabela própria `InteracaoIA` com `conversaId`, `mensagemId` opcional, `tipo`, `entradaResumo`, `saidaResumo`, `modelo`, `confidence`, `metadata`, `createdAt`. É a alternativa preferida para auditoria, classificação sem mensagem e evolução do AI Core.

Alternativa B: eventos/campos em Mensagem e Conversa, reduzindo tabelas, mas misturando mensagem externa com decisão interna.

A escolha deve ocorrer antes da migração Prisma definitiva.

### Atribuição e fila

No MVP, `atendenteResponsavelId` nulo representa não assumida. `needsAction` e uma consulta por Conversas sem responsável representam a fila geral. Uma tabela de eventos de atribuição pode ser adicionada se auditoria de transferências for necessária; **sugestão nova, não validada**.

### IntegraçãoWhatsApp

`id`, `empresaId`, `provider`, `instanceName`, `phoneNumber` opcional, `status`, `lastSyncAt`, referências seguras a credenciais armazenadas fora do retorno da API, timestamps.

### Entidades futuras

`ProdutoServico`, `Orcamento`, `Pedido`, `Pagamento`, `Devolucao` e agregações analíticas só devem ser criadas quando catálogo/orçamento/financeiro forem validados.

## 5. Contratos de API prováveis

Prefixo sugerido: `/api/v1`. Respostas de sucesso podem usar `{ data, meta }`; erros `{ error: { code, message, details? } }`.

### IAM

`POST /auth/login`

Request:

```json
{ "email": "atendente@empresa.com", "senha": "senha-inicial" }
```

Response:

```json
{ "data": { "accessToken": "...", "usuario": { "id": "...", "nome": "...", "perfil": "atendente", "empresaId": "..." } } }
```

`GET /auth/me`, `POST /auth/logout` e recuperação de senha dependem do ciclo de senha pendente.

### Atendentes

- `GET /atendentes`
- `POST /atendentes` com `nome`, `email`, `telefone`, `senhaInicial`
- `GET /atendentes/:id`
- `PATCH /atendentes/:id`
- `POST /atendentes/:id/desativar`

Somente Admin gerencia atendentes. A senha nunca aparece na resposta.

### Clientes Finais

- `GET /clientes?search=&page=&limit=`
- `POST /clientes` com `nome`, `telefone`, `email?`, `observacoes?`
- `GET /clientes/:id`
- `PATCH /clientes/:id`

Admin e Atendente têm acesso operacional conforme RN05.

### Conversas

- `GET /conversas?status=&prioridade=&intencao=&needsAction=&assignedTo=&search=&page=&limit=`
- `GET /conversas/:id`
- `POST /conversas/:id/assumir`
- `PATCH /conversas/:id/status` com `status` e, quando aplicável, `resultadoFinal`
- `POST /conversas/:id/mensagens` com `texto`

Resumo de lista:

```json
{
  "data": [{
    "id": "conv-001",
    "cliente": { "id": "cli-001", "nome": "Cliente", "telefone": "+55..." },
    "status": "nova",
    "intencao": "venda_sob_medida",
    "prioridade": "alta",
    "atendenteResponsavel": null,
    "needsAction": true,
    "ultimaMensagem": { "texto": "...", "at": "2026-09-04T08:36:00Z" }
  }],
  "meta": { "page": 1, "limit": 20, "total": 1 }
}
```

### Webhook e integração

- `POST /webhooks/evolution/:integrationKey`
- `GET /integracoes/whatsapp`
- `POST /integracoes/whatsapp/testar`
- `POST /integracoes/whatsapp/desconectar`

O webhook deve responder rapidamente e não executar o LLM inline.

### Tempo real

Socket.io autentica o usuário e ingressa na sala `tenant:{empresaId}`. Eventos mínimos: `conversation.created`, `conversation.updated`, `message.created`, `ai.interaction.created`, `integration.status.changed`. O servidor deve autorizar a Empresa antes de emitir ou aceitar comandos.

## 6. Segurança, confiabilidade e operação

- Hash de senha com algoritmo apropriado; nunca armazenar senha em texto.
- JWT ou sessão segura com expiração e revogação compatíveis com a decisão de IAM.
- Validação de entrada, rate limiting de login e webhook, logs sem segredos.
- Unique/idempotency constraints para eventos e mensagens externas.
- Filtros tenant-aware em repositories; testes de isolamento entre Empresas.
- Outbox/transação para garantir consistência entre persistência e envio externo — **sugestão nova, não validada**.
- Backup periódico PostgreSQL, restauração testada e retenção a definir.
- Métricas de webhook, fila, LLM, tempo de resposta, envio e escaladas.

## 7. Relação com as telas

As telas observadas confirmam visualmente: navegação por Dashboard, Clientes, Produtos/Serviços, Orçamentos, Atendimentos, Operação, Integrações e Configurações; lista de conversas com filtros e badges; detalhe com Cliente, telefone, canal, resumo da IA, responsável e estado; cadastro de cliente; CRUD de atendentes; conexão WhatsApp.

Somente Login, Clientes, Atendimentos/Conversa e Atendentes estão alinhados ao núcleo documentado. As demais telas devem ser tratadas como exploratórias ou futuras até validação de escopo.

## 8. Riscos e decisões relacionadas

| Risco/decisão | Impacto |
|---|---|
| InteraçãoIA própria ou embutida | Schema Prisma, auditoria, UI e AI Core |
| Semântica de `finalizada` + resultado | API, filtros, contagens e migração do mock |
| Fluxos de venda | Campos de intenção e futuras extensões de coleta |
| Primeiro acesso/senha | IAM, convite e contrato de atendentes |
| Atores de nicho | Generalização do modelo de usuário e regras |
| Resposta até 10s | Fila, espera, retry e UX |