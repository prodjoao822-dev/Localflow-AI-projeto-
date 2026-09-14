# 📋 Roadmap de Tasks — LocalFlow AI (Plano de Estudo + Implementação)

> Documento mantido pelo tech lead. Siga as tasks **em ordem**.
> Cada task diz: onde mexer (frontend/backend), o que fazer, e o que pesquisar antes.
> Regra de ouro: **não pule para a próxima task sem a atual funcionando.**

---

## 🔰 Nível 0 — Básico (você está aqui)

Você sabe: variáveis, tipos de dados, loops, arrays, objetos — o básico.
As tasks abaixo foram desenhadas para **aplicar isso na prática**, sem introduzir
conceitos complicados de uma vez.

---

## ✅ Task 1 — Entender o que já existe (leitura, sem código)

**Onde:** frontend
**O que fazer:**
1. Abra `frontend/src/pages/PainelAtendente/PainelAtendente.jsx` e leia de cima a baixo.
2. Num papel (ou comentário), responda:
   - O que é `conversas`? (dica: é um array de objetos)
   - O que faz `filaOrdenada`? (dica: é um array que passou por `.sort()` e `.filter()`)
   - Onde está o loop? (dica: `.map()` dentro do JSX)
3. Abra `frontend/src/mocks/dadosMock.js` e ache **uma** conversa. Identifique:
   - As propriedades do objeto (`id`, `status`, `prioridade`, `cliente`...).
   - Que `cliente` é **outro objeto dentro do objeto** (objeto aninhado).

**O que pesquisar antes (15 min):**
- "JavaScript array map método" — como `.map()` transforma um array em outro.
- "JavaScript sort comparador" — por que `(a, b) => a.x - b.x` ordena.
- "JSX React o que é" — entender que o "HTML" dentro do JS vira objetos.

**Critério de pronto:** você consegue explicar para si mesmo, em 3 frases, como a
fila de conversas é montada (dados → filtro → ordenação → loop → tela).

---

## ✅ Task 2 — Primeira função própria (algoritmo puro)

**Onde:** frontend
**O que fazer:**
1. Crie `frontend/src/utils/meusExercicios.js`.
2. Escreva uma função que recebe o array de conversas e retorna **quantas têm prioridade alta**:
   ```js
   export function contarPrioridadeAlta(conversas) {
     // dica: use um loop for...of OU .filter().length
   }
   ```
3. Teste chamando ela no console (temporariamente, dentro de `PainelAtendente.jsx`):
   ```js
   console.log(contarPrioridadeAlta(conversas));
   ```

**O que pesquisar:** "JavaScript for of loop", "JavaScript filter length".

**Conceitos praticados:** arrays, objetos, loops, funções, retorno.

**Critério de pronto:** o número correto aparece no console (conte à mão nos mocks
para conferir).

---

## ✅ Task 3 — Contador de prioridade na tela (UI simples)

**Onde:** frontend
**O que fazer:**
1. Usando a função da Task 2, mostre no topo da fila, junto do título, algo como:
   `🔥 5 conversas de prioridade alta`.
2. Depois generalize: crie `contarPorPrioridade(conversas)` que retorna um **objeto**:
   ```js
   { alta: 5, media: 3, baixa: 2 }
   ```
   (dica: comece com `{ alta: 0, media: 0, baixa: 0 }` e some com um loop).
3. Mostre os 3 números na tela.

**O que pesquisar:** "JavaScript objeto adicionar propriedade", "React renderizar variável JSX {chaves}".

**Conceitos praticados:** objetos como acumulador, loops, renderização condicional.

---

## ✅ Task 4 — Filtro por prioridade na fila

**Onde:** frontend
**O que fazer:**
1. Hoje existem os filtros por **estado** (FILTROS). Adicione um segundo grupo de
   filtros por **prioridade**: `Todas / Alta / Média / Baixa`.
2. Use o mesmo padrão do `filtroStatus`: um `useState` novo (`filtroPrioridade`)
   e um `.filter()` a mais dentro do `filaOrdenada`.
3. Os dois filtros devem funcionar **juntos** (estado + prioridade).

**O que pesquisar:** "React useState múltiplos", "JavaScript encadear filter".

**Conceitos praticados:** estado (state), condicionais, encadeamento de filtros.

**Critério de pronto:** clicar em "Alta" mostra só conversas de prioridade alta —
e se combinar com "Novas", mostra a interseção.

---

## ✅ Task 5 — Destacar conversa selecionada (revisão de props)

**Onde:** frontend
**O que fazer:**
1. Já existe `conversaSelecionadaId` no `PainelAtendente`. Rastreie o caminho dele:
   - Onde nasce (useState)?
   - Quem muda (onClick)?
   - Quem consome (`<Conversa conversaId={...}>`)?
2. Desenhe num papel: `PainelAtendente (pai) → Conversa (filho)` e a seta de
   `aoAtualizar` voltando do filho pro pai (callback).

**O que pesquisar:** "React props passando dados pai para filho", "React callback filho para pai".

**Critério de pronto:** você explica o fluxo de dados bidirecional da tela sem olhar o código.

---

## 🔜 Task 6 — Migração para o backend real (primeira API)

**Onde:** backend + frontend
**O que fazer:**
1. O backend (`backend/src/server.js`) já é um monólito modular. Abra e leia as rotas existentes.
2. Escolha **uma** função do `conversaService` (comece por `listarConversas`).
3. No backend: crie a rota `GET /api/conversas` que retorna o array de conversas.
4. No frontend: troque o corpo de `listarConversas()` de "ler mock em memória"
   por `fetch('http://localhost:XXXX/api/conversas')`.

**O que pesquisar (essencial):**
- "HTTP métodos GET POST PUT" — o vocabulário da web.
- "Express rotas GET tutorial" (ou o framework que o server.js usa — confira antes).
- "JavaScript fetch await async" — como o frontend chama APIs.
- "CORS o que é" — o erro mais comum quando front e back rodam em portas diferentes.

**Conceitos praticados:** async/await, Promises, JSON, integração front↔back.

**Critério de pronto:** a fila carrega os dados vindos do backend (confira na aba
Network do navegador — apareceu a requisição? status 200?).

---

## 🔜 Task 7 — Enviar mensagem pela API

**Onde:** backend + frontend
**O que fazer:**
1. Rota `POST /api/conversas/:id/mensagens` no backend (recebe `{ texto }` no body).
2. Troque o corpo de `enviarMensagem()` no `conversaService` por um `fetch` com `method: 'POST'`.
3. Trate o erro: se a API falhar, a mensagem "Não foi possível enviar" já existe —
   garanta que ela aparece de verdade.

**O que pesquisar:** "fetch POST JSON body headers", "Express req.body json".

**Critério de pronto:** enviar uma mensagem no front recarrega a thread com a
mensagem nova vinda do backend.

---

## 🔜 Task 8 — Salvar estado no banco (dados persistentes)

**Onde:** backend
**O que fazer:**
1. Hoje o backend guarda conversas **em memória** (morre se reiniciar).
2. Substitua por persistência real (SQLite ou JSON file — comece simples).
3. Migre o formato do `dadosMock.js` para o banco.

**O que pesquisar:**
- "SQLite Node.js melhor ORM iniciante" (compare Prisma vs Sequelize vs raw — leia, escolha 1).
- "modelagem de dados conversa mensagens relacionamento" — 1 conversa tem N mensagens (1:N).

**Conceitos praticados:** modelagem, chaves primárias/estrangeiras, relações 1:N.

**Critério de pronto:** reinicie o servidor e os dados continuam lá.

---

## 🔜 Task 9 — Regra de negócio no backend (RN08/RN03)

**Onde:** backend
**O que fazer:**
1. Leve as validações que hoje vivem no `conversaService` para o backend:
   - Finalizar exige `resultadoFinal` ('resolvida' ou 'perdida').
   - Estado fora dos 4 oficiais deve retornar **erro 400**.
2. No frontend, trate o erro da API e mostre a mensagem que o backend devolve.

**O que pesquisar:** "HTTP status codes 400 404", "Express tratamento de erros middleware".

**Critério de pronto:** tentar finalizar sem resultado via API retorna 400 com mensagem clara.

---

## 🔜 Task 10 — Limpar e documentar (dia a dia real)

**Onde:** geral
**O que fazer:**
1. Apague código morto (procure por funções que ninguém chama).
2. Atualize o `README` com: como rodar front, como rodar back, ordem de inicialização.
3. Faça um commit por task (commits pequenos = histórico limpo).

**O que pesquisar:** "conventional commits" — padrão `feat:`, `fix:`, `docs:` que o projeto já usa.

---

## 📚 Anexo — Onde consultar quando travar

| Dúvida | Onde |
|---|---|
| Sintaxe JS básica | MDN (developer.mozilla.org) — sempre primeiro |
| React (hooks, props, state) | react.dev (documentação oficial, tem em PT) |
| Como o projeto decidiu as coisas | `docs/` do repositório (regras de negócio, RN01–RN08) |
| Erro de build | leia a **primeira** linha do erro; ela diz arquivo e linha |
| Testar API sem frontend | use o Thunder Client (VS Code) ou `curl` no terminal |

## 🧭 Regras de trabalho (como num time real)

1. **Uma task por commit.** Commit pequeno e descritivo.
2. **Console.log é seu amigo** durante o desenvolvimento, mas remova antes de "finalizar" a task.
3. **Não copie código que você não consegue explicar.** Se copiou, comente linha por linha até entender.
4. **Quebrou? Leia o erro.** 90% das respostas estão na mensagem de erro.
5. Dúvida de negócio? Consulte os RNs em `docs/` antes de inventar comportamento.
