# LocalFlow AI

SaaS em desenvolvimento para pequenos negócios gerenciarem atendimento e vendas pelo WhatsApp com auxílio de um agente de IA.

## O problema

Pequenos comércios que vendem pelo WhatsApp perdem oportunidades porque conversas, orçamentos e informações de clientes não são organizados — especialmente quando há leads de baixa e alta intenção misturados na mesma fila.

## A solução

LocalFlow AI centraliza o atendimento do WhatsApp em um painel web:

- Fila de conversas com classificação de intenção e prioridade.
- Agente de IA que responde FAQs, coleta informações e escala dúvidas para um atendente humano.
- Histórico completo de mensagens e interações da IA.
- Isolamento de dados por empresa, preparado para multi-tenancy.

## Tecnologias

- **Frontend:** React (SPA)
- **Backend:** Node.js + Express (monólito modular)
- **Banco de dados:** PostgreSQL + Prisma ORM
- **Fila de processamento:** Redis + BullMQ
- **WhatsApp:** Evolution API
- **LLM:** OpenRouter
- **Tempo real:** Socket.io

## Status

Em desenvolvimento ativo. A arquitetura e as regras de negócio estão documentadas em `docs/` e o backend/frontend estão em construção.

## Documentação

- [Requisitos](docs/Requirements.md)
- [Arquitetura](docs/arquitetura.md)
- [Roadmap](docs/roadmap-desenvolvimento.md)

## Demo

Frontend em deploy contínuo na Vercel: [localflow-ai-projeto.vercel.app](https://localflow-ai-projeto.vercel.app/)

---

Desenvolvido por João Victor Monteiro de Souza.
