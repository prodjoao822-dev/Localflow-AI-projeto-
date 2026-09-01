# LocalFlow AI — Arquitetura do Sistema (v0.1)

> ⚠️ Documento vivo. Decisões marcadas como **Decidido** já podem virar código.
> Decisões marcadas como `[PENDENTE]` ainda não foram fechadas — não trate
> como resposta definitiva, é lacuna real.

---

## 0. Stack Tecnológica

| Camada | Escolha | Status |
|---|---|---|
| Frontend | React (SPA) | Assumido (linha de aprendizado do projeto) |
| Backend | Node.js + Express — Monólito Modular | **Decidido** |
| Banco de Dados | PostgreSQL via Prisma ORM | **Decidido** |
| Comunicação com WhatsApp | Evolution API (ponte/bridge) | **Decidido** |
| Provedor de LLM | OpenRouter (fase inicial/testes) | **Decidido** — permite trocar de modelo sem reescrever a integração |
| Tempo real no painel | WebSocket (Socket.io) | **Decidido** (assumido a partir da resposta do usuário — confirmar se a interpretação estiver errada) |
| Fila assíncrona para processar a IA | Candidato: Redis + BullMQ | `[PENDENTE]` — tecnologia e desenho ainda não definidos |
| Onde roda a lógica da IA | Dentro do próprio backend (não em n8n) | **Decidido** |

---

## 1. Decisão — IA roda no backend, com visão de reuso

A lógica de IA (interpretação, classificação, decisão de resposta) roda **dentro
do backend do LocalFlow**, não em uma ferramenta de automação externa como n8n.

Motivo: o agente de IA que atende o cliente pelo WhatsApp deve ser, no fundo,
**o mesmo "cérebro"** que futuramente poderá ser usado para outras interações
de IA dentro do próprio sistema (ex: um assistente interno para o Atendente).
Se a lógica ficasse presa a uma ferramenta de automação externa, esse reuso
ficaria mais difícil.

`[PENDENTE]` Como esse reuso será desenhado tecnicamente (mesmo serviço
chamado por dois "consumidores" diferentes — WhatsApp e uso interno — de
forma distribuída) ainda não foi definido. Fica para a etapa de modelagem
detalhada do AI Core, quando o projeto estiver mais avançado.

---

## 2. Módulos do Backend

| Módulo | Responsabilidade | Depende de |
|---|---|---|
| **IAM** | Autenticação, hashes de senha, emissão de tokens (JWT) | Ninguém |
| **Tenant** | Isolamento lógico por empresa; cadastro de empresa e atendentes | IAM |
| **CRM / Diretório** | Cadastro e histórico de Clientes finais | IAM |
| **Inbox / Atendimento** | Núcleo operacional: Conversas, Mensagens, fila, atribuição | Tenant, CRM, Provider Gateway |
| **AI Core** | Interpreta intenção, decide ação (responder/coletar/escalar). Não persiste diretamente | Inbox |
| **Provider Gateway** | Traduz entre o formato da Evolution API e o formato interno do sistema | Ninguém (fronteira externa) |

---

## 3. Fluxo de uma Mensagem (passo a passo)

1. Cliente manda mensagem no WhatsApp
2. Evolution API dispara um Webhook → Provider Gateway
3. Provider Gateway traduz o payload bruto para o formato interno do sistema
4. Inbox cria/atualiza a Conversa e registra a Mensagem
5. Inbox aciona o AI Core (síncrono no MVP até a fila assíncrona ser definida — ver seção 6, Risco 1)
6. AI Core chama o provedor de LLM (OpenRouter)
7. AI Core decide: responder FAQ automaticamente, coletar dado do cliente, ou escalar para o Atendente
8. Inbox registra a decisão e, se for resposta automática, aciona o Provider Gateway para enviar de volta ao WhatsApp
9. O painel do Atendente atualiza em tempo real via WebSocket

---

## 4. Fluxo de Requisição HTTP (painel web)

```
Rota (recebe HTTP)
  → Middleware (valida autenticação + injeta o ID da empresa/tenant)
    → Controller (extrai dados da requisição HTTP)
      → Service (executa a regra de negócio)
        → Repository / Prisma (fala com o banco)
```

---

## 5. Fronteiras Arquiteturais (Boundaries)

- **Fronteira de API de terceiros**: o payload bruto da Evolution API nunca
  deve vazar para o resto do sistema. Ele é traduzido logo na entrada
  (Provider Gateway) para um formato próprio do LocalFlow.
- **Fronteira de multi-tenancy**: a responsabilidade de saber "qual é a
  empresa do usuário atual" não fica espalhada pelo código. Um Middleware
  injeta o ID da empresa na requisição antes dela chegar na regra de negócio.

---

## 6. Riscos Arquiteturais

1. **Timeout do Webhook**: a Evolution API espera um `200 OK` rápido. Se a
   IA rodar de forma síncrona (esperando o LLM responder) dentro do mesmo
   ciclo do webhook, a requisição pode estourar o tempo limite. Solução
   candidata: fila assíncrona (`[PENDENTE]`, ver seção 0).
2. **Vazamento entre empresas (tenant leak)**: o maior risco no banco —
   esquecer um filtro `WHERE empresa_id = X` pode expor dados de uma
   empresa para outra.
3. **Acoplamento invertido**: regras de negócio (ex: "IA não gera
   orçamento sozinha" — RN01) não podem existir *apenas* dentro do prompt
   da IA. O backend precisa validar e impedir isso também, mesmo que a IA
   "erre" ou seja manipulada.

---

## 7. Decisões Pendentes

1. **Modelagem de "Interação de IA"**: fica fundida dentro de Conversa/Mensagem
   (como no nosso primeiro ER) ou vira uma tabela própria, separada da
   Mensagem em si (como sugerido na revisão arquitetural)? Isso afeta
   diretamente o schema do Prisma — precisa ser fechado antes de modelar
   o banco de verdade.
2. **Fila assíncrona**: tecnologia e desenho ainda não definidos (Redis +
   BullMQ é só um candidato, não uma decisão).
3. **RN03**: para onde vai a escalada da IA quando nenhum Atendente está
   na conversa no momento.
4. **Reuso do Agente de IA**: como o mesmo agente será compartilhado entre
   o atendimento externo (WhatsApp) e um eventual uso interno no sistema —
   arquitetura de distribuição ainda não desenhada.