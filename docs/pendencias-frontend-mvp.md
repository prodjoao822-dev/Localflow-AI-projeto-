# Pendências do Frontend MVP

> Consolida, num único lugar, todo `[PENDENTE]` (lacuna real dos requisitos)
> e todo `[ASSUMIDO]` (extrapolação de implementação sem referência visual
> ou documental) das 4 telas do MVP — Login, Atendimentos, Conversa
> Individual (embutida em Atendimentos) e Gestão de Atendentes.
>
> Gerado ao final da Fase 7 do `prompt.md`. Cada item aponta o arquivo onde
> está marcado no código, para não haver duas fontes de verdade divergentes.

## Como ler

- **`[PENDENTE]`** = o requisito/contrato não decide isso. Não escolhi
  sozinho — a tela mostra um placeholder visível ou o comportamento mais
  conservador, e fica claro no código.
- **`[ASSUMIDO]`** = decisão de implementação que tomei porque algo tinha
  que ser decidido para a tela funcionar, mas não há PNG nem doc que
  confirme. Reversível, documentada, não é decisão de produto.

---

## 1. Decisões de produto pendentes (precisam de você)

Nada aqui bloqueia as 4 telas funcionarem — mas cada item é uma decisão
real, não uma escolha de implementação.

| # | Pendência | Onde está no código | Impacto se ficar como está |
|---|---|---|---|
| 1 | Redefinição de senha ("Esqueci minha senha") não tem fluxo definido (`lacunas-e-decisoes.md` 1.4) | `pages/Login/Login.jsx` | Link fica visível e desabilitado — correto por ora, mas ninguém recupera senha |
| 2 | Reativação de atendente desativado não existe no contrato de API | `pages/Atendentes/Atendentes.jsx` | Uma desativação é permanente na prática |
| 3 | O que acontece com as conversas de um atendente desativado que ainda é responsável por elas | `pages/Atendentes/Atendentes.jsx` (comentário no topo) | Hoje: nada. As conversas continuam "atribuídas" a um usuário que não consegue mais logar nem respondê-las |
| 4 | O Admin pode editar o e-mail de um atendente, que é também o login dele — não há regra dizendo se isso deveria ser permitido | `pages/Atendentes/Atendentes.jsx` (comentário no topo) | Hoje: permitido, sem aviso ao atendente |
| 5 | Política de senha inicial (tamanho mínimo, complexidade) | `pages/Atendentes/FormAtendente.jsx` | Aceita qualquer valor não vazio |
| 6 | Regra de quem pode responder uma conversa já assumida por outro atendente | `pages/Atendimentos/ThreadConversa.jsx` | Hoje: qualquer atendente pode responder, não só o responsável (RN05 só restringe marcar "perdida") |
| 7 | Vocabulário quente/morna/fria vs. `alta/media/baixa` (decisão B — já resolvida nesta rodada, mas o Notion/docs ainda não foram atualizados para refletir isso) | `utils/formatadores.js` (`PRIORIDADE`) | Nenhum — código já usa o vocabulário técnico; é só a documentação externa que está desalinhada |

## 2. Extrapolações de implementação (`[ASSUMIDO]`)

Coisas que teve que ter um comportamento para a tela existir, sem PNG ou
doc que confirme. Não são pedido de decisão — só transparência.

| # | Suposição | Onde | Por quê |
|---|---|---|---|
| 1 | Cor da bolha do Atendente = azul (tint "em atendimento") | `styles/tokens.css` (`--bubble-atendente`), `components/BolhaMensagem/BolhaMensagem.jsx` | O PNG só mostra bolhas de cliente e IA |
| 2 | Grupo "Novas" na fila, para conversas `nova` com `needsAction=false` | `utils/fila.js` | Sem esse grupo, essas conversas sumiriam da fila; o PNG não tem esse grupo porque o mock de referência não tinha esse caso |
| 3 | Responder uma mensagem limpa `needsAction` | `services/conversaService.js:140` | Nenhum doc define quando a flag deveria ser limpa |
| 4 | `resultadoFinal` incluído no resumo de lista (`GET /conversas`) | `services/conversaService.js:42` | O exemplo de contrato em `planejamento-arquitetura.md` não lista esse campo, mas a fila precisa dele para separar "Finalizados/Perdidos" |
| 5 | Formato do contrato de detalhe (`GET /conversas/:id`) inteiro | `mocks/dadosMock.js:26` | Não está escrito nos docs — derivado do schema Prisma |
| 6 | Card "Resumo da IA" do PNG virou "Registro da IA" (lista das interações, não um resumo de texto corrido) | `pages/Atendimentos/PainelContexto.jsx` | O contrato/schema não tem nenhum campo de resumo consolidado — só a lista `InteracaoIA`. Inventar um campo de resumo seria inventar um campo de backend |
| 7 | Tag "✦ IA" não aparece nos cards da fila, só nas bolhas da thread | `components/CardConversa/CardConversa.jsx` | O resumo de lista do contrato não tem nenhum campo que diga se a IA atuou na conversa — só o detalhe tem `interacoesIA` |
| 8 | Ações de editar/desativar atendente como menu "⋯" por linha | `pages/Atendentes/Atendentes.jsx`, `components/MenuAcoes/` | RF02 exige a ação, mas o PNG só mostra a lista, sem nenhum controle de ação |
| 9 | Responsivo (3 colunas → abas empilhadas) em telas estreitas | `pages/Atendimentos/Atendimentos.css`, `components/Layout/Layout.css` | RNF02 exige responsivo, mas todas as telas de referência são só desktop — **tratar como suposição a validar, não como visual aprovado** |
| 10 | Cor de "Novas" (grupo assumido no item 2) | `styles/tokens.css` (`--status-nova-fg`) | Consequência do item 2 — sem grupo no PNG, sem cor definida |

## 3. Decisão técnica documentada

- **Gerenciamento de estado global:** Context API só para autenticação;
  dado de tela fica em `useState` local por página, sem lib de cache/fetch.
  Justificativa completa em [`frontend/README.md`](../frontend/README.md#decisão-técnica--gerenciamento-de-estado-global).

## 4. Fora de escopo (confirmado, não pendência)

- As 5 telas exploratórias (Dashboard, Produtos e Serviços, Orçamentos,
  Operação, Integrações) continuam fora — decisão F, menu já esconde os
  itens (`components/Layout/Layout.jsx`).
- Botão "Novo manual" (criar conversa manualmente) foi removido — decisão D.
- Tela própria de "Clientes" não foi criada — RF04 (cadastro de cliente)
  fica para quando o fluxo de conversa real existir.

---

**Não avançar para nenhuma tela fora deste escopo sem confirmação.**
