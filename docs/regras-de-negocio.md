# LocalFlow AI — Regras de Negócio Consolidadas

Status: documento de planejamento. Regras com `PENDENTE` não devem ser implementadas como decisão definitiva.

## 1. Contexto e vocabulário

O LocalFlow organiza o atendimento e as oportunidades comerciais recebidas pelo WhatsApp de uma empresa usuária. O **Cliente Final** é o cliente da empresa usuária — por exemplo, o cliente de uma oficina, papelaria ou marmoraria — e não um comprador do LocalFlow.

Termos:

- **Empresa**: negócio que utiliza o LocalFlow.
- **Administrador/Dono**: usuário que administra a empresa, atendentes e integrações.
- **Atendente**: usuário que opera conversas e mantém dados operacionais de clientes.
- **Cliente Final**: pessoa ou organização que conversa com a Empresa pelo WhatsApp.
- **Conversa**: agrupamento de mensagens e contexto operacional de um Cliente Final em um canal.
- **Oportunidade**: estado operacional da Conversa, usado para organizar a ação comercial ou de atendimento.
- **Agente de IA**: componente que interpreta mensagens, classifica, responde FAQ, coleta dados e escala situações.

## 2. Regras confirmadas

### RN01 — Limite da IA sobre orçamento

A IA não gera orçamento automaticamente no MVP. Ela pode identificar a intenção, coletar e registrar informações relevantes e encaminhar a situação. A elaboração do orçamento permanece sob responsabilidade humana.

Essa limitação deve ser aplicada no backend e no AI Core, não somente no prompt.

### RN02 — Registro das ações da IA

Toda interação da IA, autônoma ou preparatória para uma escalada, deve ser registrada e ficar visível ao Atendente. O registro deve permitir identificar pelo menos o tipo da ação, horário, resultado/resumo e Conversa relacionada.

### RN03 — Escalada sem responsável

Quando a IA precisar de intervenção e a Conversa não tiver Atendente responsável, ela deve:

1. ser colocada em uma fila geral de pendências;
2. ser marcada como necessitando de ação;
3. notificar todos os Atendentes ativos da Empresa;
4. continuar disponível para ser assumida por um Atendente.

Quando já houver responsável, a escalada é direcionada a esse Atendente.

### RN04 — Isolamento por Empresa

Todo dado operacional pertence a uma Empresa. Consultas, comandos, eventos e mensagens devem ser autorizados e filtrados pelo contexto da Empresa. Nenhum usuário pode acessar dados de outra Empresa.

### RN05 — Papéis do MVP

- O Administrador gerencia a Empresa, Atendentes e integrações e também pode operar Conversas.
- O Atendente visualiza e responde Conversas, cadastra/edita Clientes Finais e altera o estado da Oportunidade.
- Não haverá permissões diferenciadas entre Atendentes no MVP.
- O cadastro de um Atendente é iniciado pelo Administrador, que informa os dados e define a senha inicial.
- A troca de senha é OBRIGATÓRIA no primeiro login do Atendente (confirmado): o usuário nasce com flag `primeiroAcessoPendente` e o painel só é liberado após a troca de senha.

### RN06 — Cliente Final não autentica

O Cliente Final não acessa o painel. Seu cadastro e histórico são mantidos como dados operacionais relacionados às Conversas.

### RN07 — Histórico

As mensagens de uma Conversa devem permanecer em histórico ordenado, preservando autor/origem, canal, data/hora e conteúdo. Mensagens da IA e do Atendente devem ser distinguíveis.

### RN08 — Estados oficiais da Oportunidade

O contrato oficial adotado para o MVP possui quatro estados:

| Estado | Significado |
|---|---|
| `nova` | Conversa ainda não tratada ou recém-criada |
| `em_atendimento` | Conversa sob atuação humana ou operacional |
| `aguardando_cliente` | A próxima ação depende de resposta/dado do Cliente Final |
| `finalizada` | Atendimento encerrado; exige um resultado `resolvida` ou `perdida` |

`nova`, `em_atendimento` e `aguardando_cliente` são estados. `finalizada` é o estado de encerramento e exige um resultado `resolvida` ou `perdida`, representado no campo separado `resultadoFinal`. A UI e a API evitam a contradição entre quatro estados e uma enumeração com cinco estados.

### RN08.1 — Finalizada não reabre automaticamente (confirmado)

Uma Conversa `finalizada` NÃO reabre automaticamente. Uma nova mensagem do mesmo Cliente Final depois de `finalizada` cria uma Conversa nova. O Atendente tem uma ação manual explícita para "reabrir/mesclar" a Conversa anterior caso identifique que é o mesmo assunto. Não há detecção automática de "mesmo assunto" no MVP — reabertura é decisão humana.

### RN09 — Classificação não substitui decisão humana

A intenção e a prioridade produzidas pela IA orientam a fila e a visualização, mas não impedem o Atendente ou Administrador de assumir, responder, atualizar estado ou corrigir a classificação conforme as permissões do MVP.

### RN10 — Resposta externa

Mensagens enviadas pelo Atendente ou pela IA ao Cliente Final devem ser registradas antes ou de forma transacionalmente segura em relação ao envio externo. Falhas de envio não podem apagar o histórico nem aparentar sucesso sem confirmação.

## 3. Regras e escopo ainda não fechados

- Fluxo completo de cadastro de funcionário: senha inicial definida pelo Admin + troca obrigatória no primeiro login confirmados. Expiração da senha inicial, convite/ativação por e-mail e redefinição: **PENDENTE**.
- Follow-up automático: **PENDENTE** e fora do núcleo do MVP até definição.
- Atores específicos de nicho: **PENDENTE**; não criar papéis de nicho no núcleo.
- Fluxos de venda rápida e sob medida: hipóteses ainda não validadas; não tratá-los como regras universais.
- Meta de resposta da IA: referência confirmada de até 10 segundos, mas a estratégia de mensagem de espera e degradação ainda depende do desenho operacional.

## 4. Fora do MVP confirmado

Catálogo de produtos, estoque, pedidos formais, orçamento gerado pela IA, follow-up automático, histórico comercial consolidado, métricas avançadas, oportunidades perdidas analíticas e operação SaaS multiempresa simultânea ficam fora da primeira entrega. A estrutura deve permanecer preparada para isolamento por Empresa.

O dashboard futuro de faturamento, produtos mais pedidos, devoluções e indicadores completos é uma extensão não validada do núcleo atual e dependerá de entidades de catálogo, orçamento, pedido e financeiro.

## 5. Rastreabilidade

- Requirements v0.2: RN01–RN03, RF01–RF18, atores, MVP e fora de escopo.
- arquitetura v0.1: limites de módulos, RN01 no backend, isolamento de tenant e fluxo de mensagem.
- telas: Cliente Final, Conversa, Atendente, integração WhatsApp e estados operacionais.
- código atual: `frontend/src/mocks/dadosMock.js` expressa parte do contrato novo; `frontend/src/mocks/atendimentosMock.js` é legado desalinhado (aposentado na Etapa 1 do roadmap).