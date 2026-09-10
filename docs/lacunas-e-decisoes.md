# LocalFlow AI — Lacunas, Perguntas e Desalinhamentos

Prioridade:

- **P0**: precisa ser resolvido antes de modelar/implementar a parte afetada.
- **P1**: precisa ser resolvido antes do MVP integrado.
- **P2**: pode permanecer no roadmap posterior.

## 1. P0 — decisões ainda bloqueadoras

### 1.1 Representação de finalização da oportunidade

Foi escolhido o conjunto funcional de quatro estados: `nova`, `em_atendimento`, `aguardando_cliente` e `finalizada`, com resultado `resolvida` ou `perdida`.

**CONFIRMADO (Etapa 0 fechada):**

- `resultadoFinal` separado: uma Conversa `finalizada` carrega um campo `resultadoFinal` com valor `resolvida` ou `perdida`. `resolvida` e `perdida` são resultados de finalização, não estados paralelos (RN08).
- Reabertura: uma Conversa `finalizada` NÃO reabre automaticamente. Uma nova mensagem do mesmo Cliente Final depois de `finalizada` cria uma Conversa nova. O Atendente tem uma ação manual explícita para "reabrir/mesclar" a Conversa anterior caso identifique que é o mesmo assunto. NÃO implementar detecção automática de "mesmo assunto" — isso é decisão humana no MVP.

**AINDA PENDENTE:**

- quem pode marcar `perdida` e com qual motivo.

Impacta Prisma, filtros, contagens, frontend e API.

### 1.2 Interação de IA

**CONFIRMADO (Etapa 0 fechada):** tabela própria `InteracaoIA`, relacionada à Conversa e opcionalmente à Mensagem (a alternativa preferida no planejamento). Confirmado pelo dono do projeto.

### 1.3 Fluxos de venda rápida e sob medida

Continuam hipóteses. É necessário entrevistar a Casa da Soleira e outras empresas para confirmar, corrigir ou descartar os fluxos. Até lá, não criar campos específicos de marmoraria nem tornar essas intenções regras universais.

### 1.4 Cadastro de atendente e primeiro acesso

**CONFIRMADO (Etapa 0 fechada):** o Administrador informa os dados e define a senha inicial, e a troca de senha é OBRIGATÓRIA no primeiro login do Atendente. O modelo de usuário recebe um campo/flag (ex.: `primeiroAcessoPendente`) que força o fluxo de troca de senha antes de liberar o uso normal do painel.

**AINDA PENDENTE:**

- existe expiração da senha inicial?
- há convite/ativação por e-mail?
- como ocorre redefinição?

Impacta IAM e contrato de criação.

## 2. P1 — decisões para o MVP integrado

### 2.1 Conteúdo e política da notificação

Está decidido que a escalada sem responsável notifica todos os Atendentes ativos. Falta escolher o mecanismo e o comportamento de indisponibilidade: Socket.io, notificação no painel, e-mail, WhatsApp interno ou combinação. Também falta definir se a notificação é repetida e quando é considerada atendida.

### 2.2 Tempo de resposta da IA

Referência confirmada: até 10 segundos. Falta definir medição (p95 ou média), início/fim, mensagem de espera e comportamento em timeout do LLM.

### 2.3 Tipos de conteúdo WhatsApp

O material atual modela texto. Falta confirmar se o MVP aceita imagem, áudio, documento, localização e respostas interativas, ou se texto é suficiente.

### 2.4 Atores específicos de nicho

A resposta atual é não criar papéis de nicho no núcleo. A pergunta continua aberta para uma extensão configurável futura: que capacidades seriam necessárias e seriam atributos, equipes ou roles?

### 2.5 Caso Casa da Soleira

Ainda falta entrevista para descobrir o cenário do atendimento que travou por quatro dias: volume, tipo de pedido, vendedor, horário, dependência de orçamento ou outro fator.

### 2.6 Follow-up automático

O fluxo e gatilhos ainda não foram definidos. Permanece fora do MVP e deve ser especificado antes de qualquer job de follow-up.

## 3. P2 — pós-MVP

- Dashboard analítico completo do Administrador: faturamento, produtos pedidos, devoluções, conversão e indicadores.
- Catálogo, estoque, orçamento, pedido e financeiro.
- Histórico comercial consolidado.
- Múltiplas Empresas em operação comercial.
- Permissões diferenciadas entre Atendentes.
- Integrações e notificações adicionais.

## 4. Desalinhamentos identificados no código

### 4.1 Mock legado de atendimentos

`frontend/src/mocks/atendimentosMock.js` trata os Clientes Finais como se fossem compradores do próprio LocalFlow: mensagens mencionam anúncio, plano mensal e integração do LocalFlow. Isso contradiz o domínio definido em Requirements e nas telas, onde o Cliente Final compra/solicita algo da Empresa usuária.

O mock também usa apenas `aguardando`, `em_andamento` e `concluido`, divergindo do contrato de oportunidade usado em `frontend/src/mocks/dadosMock.js` e do RF18.

Decisão desta rodada: aposentar/remover o mock antigo e padronizar o domínio em Conversa + Cliente Final. Não corrigir código nesta etapa.

### 4.2 Dois contratos e serviços sobrepostos

`atendimentoService.js` consome o mock legado, enquanto `conversaService.js` consome `dadosMock.js` e já contempla intenção, prioridade, interações IA, atribuição e estados mais ricos. Isso cria risco de telas consumirem vocabulários diferentes.

### 4.3 Diferença entre telas e escopo

O protótipo visual apresenta Dashboard, Produtos e Serviços, Orçamentos, Operação e Integrações. Requirements coloca boa parte desses itens fora do MVP. É necessário classificar cada tela como validada, exploratória ou futura antes de conectá-la a APIs.

### 4.4 Autenticação simulada

O frontend usa credenciais e sessão em `localStorage`. Isso é adequado apenas ao protótipo e não satisfaz RNF01. O backend IAM deve substituir o contrato sem manter senhas em mocks de produção.

### 4.5 Integração do layout

O frontend já possui componentes e serviços de protótipo, mas rotas/nav e telas ainda não representam toda a navegação visual. Isso não deve ser ampliado antes da decisão de escopo das telas exploratórias.

## 5. Perguntas originais e estado

| Pergunta | Estado |
|---|---|
| Cadastro de funcionário | Resolvido: Admin define senha inicial + troca obrigatória no primeiro login (flag `primeiroAcessoPendente`); expiração/convite/redefinição seguem pendentes |
| Follow-up automático | Pendente, fora do MVP |
| Escalada sem atendente | Resolvida: fila geral + notificação a Atendentes ativos |
| Atores de nicho | Pendente para extensão; nenhum no núcleo |
| Fluxos de venda | Pendente de entrevista/validação |
| Cenário dos quatro dias | Pendente de entrevista |
| Meta de resposta IA | Resolvida como referência de até 10 segundos |
| Tecnologia de fila | Resolvida: Redis + BullMQ |
| Interação IA | Resolvida: tabela própria `InteracaoIA` |
| Reuso do Agente IA | Pendente: contrato/distribuição para WhatsApp e uso interno |

## 6. Sugestões novas, não validadas

- Usar tabela de histórico de atribuições para auditoria de transferências.
- Usar outbox para sincronizar banco e Evolution API.
- Medir p95 de latência da IA e taxa de escalada por intenção.
- Registrar versão do prompt/modelo e sinais de confiança na auditoria IA.
- Planejar minimização, retenção e anonimização de dados de Clientes Finais conforme necessidade legal e operacional.