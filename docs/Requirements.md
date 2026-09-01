# LocalFlow AI — Levantamento de Requisitos (v0.2)

> ⚠️ Este é um documento vivo. Várias seções ainda têm lacunas marcadas como
> `[PENDENTE]` — não foram inventadas, foram deixadas em aberto porque ainda
> não foram discutidas ou decididas. Não trate isso como versão final.
>
> **Mudou da v0.1 para v0.2:** entrou a estratégia de produto+serviço (seção 0),
> a hipótese foi refinada, entrou a Casa da Soleira como caso de validação
> (não como nicho definitivo), e os dois fluxos de venda (rápida vs. sob
> medida) foram formalizados como hipóteses a validar, não como requisito
> fechado.

---

## 0. Estratégia — Produto + Serviço (novo)

O LocalFlow AI não vai nascer como SaaS completo com vários assinantes.
A estratégia inicial é híbrida:

1. Encontrar empresas reais e entender seus processos de atendimento/venda no WhatsApp.
2. Oferecer, inicialmente, um **agente de IA como serviço** — implementável mais rápido, gera valor pro cliente antes do sistema completo existir, e funciona como porta de entrada comercial.
3. Observar problemas, processos e necessidades reais durante essas implementações.
4. Usar essas evidências para evoluir o LocalFlow AI como produto próprio.

Ou seja: **o agente de IA não é só uma funcionalidade futura do sistema — é também o mecanismo de validação e aprendizado do produto.**

**Fluxo de evolução esperado:**

```
Hipótese → Entrevista com empresa real → Mapeamento do processo →
Identificação das dores → Validação → Requisitos → MVP →
Implementação → Teste com empresa real → Aprendizado → Evolução do produto
```

---

## 1. Hipótese do Produto (atualizada)

> Pequenos negócios que utilizam o WhatsApp como canal importante de vendas
> podem perder oportunidades porque conversas, pedidos, orçamentos e
> informações de clientes não são organizados de forma adequada —
> principalmente quando existem diferentes tipos de venda e diferentes
> níveis de intenção de compra.

Essa hipótese ainda **precisa ser validada com empresas reais**. A validação
inicial (papelaria Venâncio) confirmou uma variação dela: perda de venda por
tratar leads de baixa e alta intenção com a mesma prioridade (ordem de
chegada).

### Importante — produto horizontal

O LocalFlow AI continua sendo pensado como produto **horizontal**. Não se
deve assumir que ele será exclusivo para marmorarias, marcenarias,
floriculturas, distribuidoras ou qualquer nicho específico. Esses segmentos
são **ambientes de descoberta e validação**, não o mercado final definido.

---

## 2. Caso de Validação — Casa da Soleira

A Casa da Soleira (loja de mármore/granito) é um caso real usado para
validar a hipótese — não é o nicho definitivo do produto. Foi escolhida por
concentrar dois padrões de venda ao mesmo tempo:

- **Produtos de pronta entrega** (venda rápida/transacional)
- **Produtos sob medida** (venda consultiva, com coleta de informações e orçamento)

Dado observado via avaliações públicas: a maioria dos comentários elogia o
atendimento, mas há relato de um cliente que tentou comprar por mais de 4
dias sem sucesso e foi para a concorrência — indício de falha
**intermitente** (não crônica) no atendimento, possivelmente ligada a um
cenário específico (pico de demanda, tipo de pedido, ou sobrecarga pontual).

`[PENDENTE]` Entrevista ainda não realizada — aguardando retorno da empresa.

---

## 3. Direção do MVP

Processo central que o MVP deve organizar:

```
WhatsApp → Atendimento → Identificação da intenção →
Organização da oportunidade → Ação humana/IA → Resultado
```

**Critério de corte para qualquer funcionalidade nova:**
> "Isso ajuda diretamente a organizar ou melhorar o processo de atendimento
> e vendas pelo WhatsApp?"

Se a resposta não for um "sim" direto, a funcionalidade não entra no MVP —
vira possibilidade futura (ver seção 7).

---

## 4. Atores

| Ator | Descrição |
|---|---|
| **Administrador/Dono** | Gerencia o negócio no sistema. Cadastra funcionários, configura o sistema. |
| **Atendente** | Usa o painel no dia a dia. Responde clientes, assume conversas, recebe escaladas da IA. |
| **Agente de IA** | Ator não-humano. Interpreta mensagens, responde FAQ, classifica intenção, coleta dados, escala dúvidas. |
| **Cliente final** | Não faz login, mas é modelado como dado (nome, telefone, histórico). |

`[PENDENTE]` Atores adicionais específicos de nicho — ficam como extensão
configurável futura, não fazem parte do núcleo.

---

## 5. Requisitos Funcionais — Sistema (núcleo)

- **RF01** — Cadastrar Administrador/Dono
- **RF02** — Cadastrar / Editar / Remover Atendente
- **RF03** — Autenticar (login) — Administrador e Atendente
- **RF04** — Cadastrar Cliente
- **RF05** — Visualizar Painel de Fila de Conversas
- **RF06** — Visualizar Classificação de Intenção/Prioridade da Conversa
- **RF07** — Registrar Interações da IA (visível ao Atendente)
- **RF08** — Assumir Conversa (Atendente)
- **RF09** — Isolar Dados por Empresa (estrutura pronta para SaaS futuro, mesmo operando com um único negócio no início)
- **RF17** — Manter Histórico de Mensagens por Conversa
- **RF18** — Acompanhar Estado Básico da Oportunidade (ex: nova, em atendimento, aguardando cliente, resolvida/perdida)

`[PENDENTE]` Fluxo completo de cadastro de funcionário (permissões, aprovação).
`[PENDENTE]` Fluxo de follow-up automático.

---

## 6. Requisitos Funcionais — Agente de IA

- **RF10** — Interpretar mensagem recebida e identificar a intenção do cliente
- **RF11** — Responder automaticamente perguntas de FAQ
- **RF12** — Classificar a conversa (prioridade/oportunidade)
- **RF13** — Coletar e registrar o que o cliente deseja, **sem** gerar orçamento (ver RN01)
- **RF14** — Escalar dúvida ao Atendente responsável pela conversa (se já assumida)
- **RF15** — Enviar mensagem de espera ao cliente enquanto aguarda o Atendente
- **RF16** — Repassar resposta do Atendente ao cliente e salvar no histórico/memória da conversa

`[PENDENTE]` O que acontece quando **nenhum** atendente está na conversa no
momento da escalada.

### Hipóteses de fluxo (ainda não validadas — não viram requisito fechado)

**Venda rápida:**
```
Produto → Disponibilidade → Preço → Retirada/Entrega → Venda
```

**Venda sob medida:**
```
Necessidade → Medidas → Material → Especificações → Análise →
Orçamento → Negociação → Venda
```

Esses dois fluxos precisam ser confirmados (ou corrigidos) com entrevistas
reais — inclusive na Casa da Soleira — antes de virarem RF definitivos.

---

## 7. Requisitos Não Funcionais

- **RNF01** — Autenticação segura
- **RNF02** — Responsivo / funcional em dispositivos móveis
- **RNF03** — Tempo de resposta da IA rápido o suficiente para não gerar percepção de demora (valor de referência: `[PENDENTE]`)
- **RNF04** — Dados logicamente isolados por empresa (multi-tenant ready)
- **RNF05** — Backup periódico dos dados

---

## 8. Regras de Negócio

- **RN01** — Geração automática de orçamento pela IA está fora do escopo do MVP até ser validada como necessidade real. O agente apenas coleta e registra; o orçamento é feito por humano.
- **RN02** — Toda interação da IA (mesmo autônoma) deve ficar registrada e visível ao Atendente.
- **RN03** — A escalada de dúvida da IA é direcionada ao Atendente que já assumiu a conversa, quando houver. `[PENDENTE: regra para quando não houver]`

---

## 9. Fora do Escopo do MVP (possibilidades futuras, não descartadas)

Estes itens continuam sendo relevantes para o produto, mas só entram
depois de evidência real de que participam do problema central:

- Catálogo de produtos
- Disponibilidade/estoque
- Criação e acompanhamento formal de pedidos
- Criação de orçamentos (pela IA)
- Follow-up automatizado
- Histórico comercial consolidado
- Métricas de vendas / dashboard
- Análise de produtos mais procurados/vendidos
- Identificação de oportunidades perdidas
- Múltiplos negócios/assinantes ativos simultaneamente (a estrutura de dados já nasce pronta — RF09/RNF04 — mas a operação inicial é para um único negócio)

---

## 10. Perguntas em Aberto

1. Como funciona o cadastro de funcionário (permissões, quem aprova)?
2. Como funciona o follow-up automático?
3. Quando nenhum atendente está na conversa, para onde vai a escalada da IA?
4. Existem atores específicos de nicho a prever na modelagem, mesmo sem implementar no MVP?
5. Os dois fluxos de venda (rápida vs. sob medida) descritos na seção 6 se confirmam na prática da Casa da Soleira, ou o processo real é diferente?
6. Qual é o cenário específico em que a Casa da Soleira "trava" (o caso do cliente que esperou 4+ dias) — volume, tipo de produto, vendedor específico?