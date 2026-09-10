# LocalFlow AI — Roadmap de Desenvolvimento

Roadmap sequencial. Nenhuma etapa abaixo autoriza implementação antes das decisões marcadas como dependência serem fechadas.

## Etapa 0 — Fechamento de domínio e produto

1. Entrevistar Casa da Soleira e pelo menos uma empresa adicional.
2. Confirmar ou corrigir venda rápida e venda sob medida.
3. Investigar o caso de atendimento travado por quatro dias.
4. Definir semântica persistida de `finalizada`, `resolvida` e `perdida`.
5. Decidir tabela própria ou registro embutido para InteraçãoIA.
6. Fechar primeiro acesso, troca e recuperação de senha.
7. Confirmar escopo das telas exploratórias.

Dependências: respostas às lacunas P0 e evidência de validação. Critério: decisões registradas e aprovadas em `docs/lacunas-e-decisoes.md`.

## Etapa 1 — Contrato único e saneamento do protótipo

1. Adotar Conversa, ClienteFinal, Mensagem, InteraçãoIA e Usuário como vocabulário único.
2. Aposentar o contrato de `atendimentosMock.js`.
3. Atualizar serviços mock para um único contrato, sem alterar regras ainda não decididas.
4. Alinhar status, filtros, badges e textos às quatro situações oficiais.
5. Separar explicitamente protótipo visual, MVP confirmado e telas futuras.

Dependência: Etapa 0, especialmente status final e InteraçãoIA. Critério: nenhum serviço ou tela nova depende do contrato legado.

## Etapa 2 — Fundação do backend

1. Criar monólito modular Node/Express.
2. Configurar Prisma/PostgreSQL e migração inicial.
3. Criar configuração, validação, erros, logging e health check.
4. Implementar contexto de Empresa e testes de isolamento.
5. Adotar Redis/BullMQ com retry, backoff e dead-letter.

Dependência: modelo aprovado da Etapa 0. Critério: aplicação inicia, migra banco e processa um job controlado.

## Etapa 3 — IAM e Tenant

1. Implementar Empresa e usuários.
2. Implementar hash de senha, login, sessão/token e logout.
3. Implementar criação de Atendente pelo Administrador com senha inicial.
4. Implementar desativação e bloqueio de usuário inativo.
5. Implementar políticas de primeiro acesso conforme decisão.

Dependência: ciclo de senha aprovado. Critério: Admin e Atendente autenticam e não atravessam o tenant.

## Etapa 4 — CRM/Diretório

1. Implementar ClienteFinal por Empresa.
2. Criar cadastro, edição, busca e detalhes.
3. Normalizar telefone e decidir regra de duplicidade.
4. Relacionar ClienteFinal a Conversas.

Dependência: decisão de telefone/duplicidade, que pode ser simples se a entrevista ainda não confirmar unicidade. Critério: telas de Cliente usam API real e histórico correto.

## Etapa 5 — Inbox e histórico

1. Implementar Conversa, Mensagem, estados, resultado final e atribuição.
2. Implementar listagem paginada com busca, filtros e ordenação.
3. Implementar assumir conversa e fila geral `needsAction`.
4. Implementar envio manual e histórico.
5. Implementar transições válidas e autorização Admin/Atendente.

Dependência: semântica final de status. Critério: fluxo completo Cliente Final → Conversa → assumir → responder → finalizar.

## Etapa 6 — Provider Gateway e WhatsApp

1. Implementar normalização do webhook Evolution API.
2. Validar assinatura/chave e idempotência.
3. Criar ou localizar ClienteFinal/Conversa.
4. Persistir mensagens recebidas.
5. Implementar envio, confirmação, retry e erro.

Dependência: decisão de tipos de conteúdo e credenciais. Critério: mensagem de texto percorre entrada e saída sem payload externo vazar para o domínio.

## Etapa 7 — AI Core

1. Definir contrato interno independente de OpenRouter.
2. Implementar classificação de intenção/prioridade.
3. Implementar FAQ e coleta de dados sem orçamento automático.
4. Implementar escalada com e sem responsável.
5. Persistir InteraçãoIA segundo decisão da Etapa 0.
6. Implementar timeout de referência de 10 segundos, fallback e mensagem de espera.

Dependência: InteraçãoIA, fluxos validados e base de conhecimento mínima. Critério: cenários de teste confirmam RN01–RN03 mesmo com saída inesperada do LLM.

## Etapa 8 — Tempo real e frontend integrado

1. Autenticar Socket.io e salas por Empresa.
2. Atualizar fila e detalhe após novas Mensagens, InteraçõesIA e mudanças de estado.
3. Substituir serviços mock por API mantendo componentes desacoplados.
4. Integrar Login, painel, conversa, cliente e gestão de atendentes.
5. Testar responsividade e estados de erro/carregamento.

Dependência: APIs estáveis e eventos definidos. Critério: dois usuários da mesma Empresa veem atualizações autorizadas e nenhum tenant recebe evento alheio.

## Etapa 9 — Validação operacional

1. Rodar piloto assistido com empresa real.
2. Medir tempo de resposta, escaladas, conversas assumidas e oportunidades finalizadas.
3. Observar falsos positivos de prioridade e falhas de contexto.
4. Registrar feedback e separar correções de novas hipóteses.

Dependência: integração de ponta a ponta. Critério: evidência suficiente para revisar hipóteses e priorizar próxima etapa.

## Etapa 10 — Pós-MVP condicionado a evidência

Possíveis trilhas, sem compromisso de implementação:

- catálogo e produtos/serviços;
- orçamentos humanos e acompanhamento;
- pedidos, pagamentos e devoluções;
- follow-up automático;
- dashboard de faturamento, produtos, devoluções e conversão;
- permissões diferenciadas;
- múltiplos canais e Empresas.

Cada trilha exige requisitos próprios, entidades, regras de retenção e validação de negócio antes de entrar no roadmap executável.