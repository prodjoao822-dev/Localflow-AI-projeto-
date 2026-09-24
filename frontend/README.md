# LocalFlow AI — Frontend

Protótipo do painel web (React 19 + Vite 8 + React Router 7), com as 4 telas
validadas como MVP: Login, Atendimentos (fila + conversa + contexto),
Gestão de Atendentes. O backend real ainda não existe — os `services/`
simulam as respostas no formato do contrato de API planejado
(`docs/planejamento-arquitetura.md`), para trocar por `fetch()` depois sem
redesenhar telas.

## Como rodar

```
npm install
npm run dev   # http://localhost:5173
```

Login de demonstração (só em `npm run dev`, veja `pages/Login/Login.jsx`):
`admin@casadasoleira.com` / `admin123` (admin) ou
`joao@casadasoleira.com` / `123456` (atendente).

## Decisão técnica — gerenciamento de estado global

**Não há nenhuma lib de estado global (Redux, Zustand, Jotai, React Query
etc.) no projeto.** Isso não está decidido em nenhum documento de produto —
é uma escolha técnica, tomada e justificada aqui:

- **Autenticação** (quem está logado) é o único estado realmente *global*
  — várias telas não relacionadas precisam dele. Fica em `AuthContext`
  (Context API nativa do React), a opção mais simples possível: sem
  dependência nova, sem boilerplate de actions/reducers, e o React já
  resolve o re-render de quem consome o contexto.
- **Todo o resto (conversas, atendentes) não é estado global — é dado de
  servidor.** Cada tela busca o que precisa via `services/` e guarda numa
  `useState` local (`Atendimentos.jsx`, `Atendentes.jsx`). Não existe cache
  compartilhado entre telas nem sincronização automática.
- **Por que essa é a opção certa agora:** o projeto não tem backend real
  (Etapa 3 do roadmap ainda não começou). Uma lib como React Query resolve
  problemas de cache, revalidação e sincronização com um servidor de
  verdade — problemas que não existem ainda aqui, porque os `services/`
  são só um mock em memória, sem rede, sem stale data. Adicionar essa
  complexidade agora seria resolver um problema que não existe e teria que
  ser revisto de qualquer forma quando o `fetch()` real entrar.
- **Quando revisar:** quando os `services/` passarem a chamar a API real
  (troca de `authService`/`conversaService`/`atendenteService`), vale
  reavaliar — nesse ponto React Query (ou SWR) resolve cache/revalidação
  de graça. É uma decisão reversível e isolada: como o acesso a dados já
  passa só pelos `services/`, trocar a camada de estado não deve tocar as
  telas.

## Pendências e suposições

Todo placeholder `[PENDENTE]` e toda suposição `[ASSUMIDO]` feita por falta
de definição nos documentos/telas de referência estão consolidados em
[`docs/pendencias-frontend-mvp.md`](../docs/pendencias-frontend-mvp.md).
