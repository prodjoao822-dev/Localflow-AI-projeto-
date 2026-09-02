/**
 * CONTRATO DE DADOS: Atendimentos (Mock)
 * 
 * Este arquivo define a estrutura exata (o "contrato") que os dados de atendimentos
 * terão quando o backend Node.js + Prisma estiver rodando.
 * 
 * Estrutura de cada Atendimento:
 * - id: string (UUID único)
 * - cliente: { nome, telefone, email, avatar }
 * - status: 'aguardando' | 'em_andamento' | 'concluido'
 * - prioridade: 'baixa' | 'media' | 'alta'
 * - canal: 'whatsapp' | 'web'
 * - atendente: string (Nome do atendente humanizado ou 'IA LocalFlow')
 * - ultimaMensagem: string (Preview da última mensagem trocada)
 * - dataAtualizacao: string (ISO Timestamp)
 * - mensagens: Array de objetos de mensagens trocadas no chat
 */

export const atendimentosMock = [
  {
    id: "atend-001",
    cliente: {
      nome: "Carlos Eduardo",
      telefone: "+55 11 98765-4321",
      email: "carlos.eduardo@email.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos"
    },
    status: "em_andamento",
    prioridade: "alta",
    canal: "whatsapp",
    atendente: "IA LocalFlow",
    ultimaMensagem: "Gostaria de agendar uma reunião para tirar dúvidas sobre a automação.",
    dataAtualizacao: "2026-09-02T13:40:00Z",
    mensagens: [
      {
        id: "msg-101",
        remetente: "cliente",
        texto: "Olá! Vi o anúncio da LocalFlow AI e me interessei.",
        dataHora: "2026-09-02T13:35:00Z"
      },
      {
        id: "msg-102",
        remetente: "ia",
        texto: "Olá Carlos! Seja bem-vindo à LocalFlow AI. Como posso te ajudar hoje?",
        dataHora: "2026-09-02T13:36:00Z"
      },
      {
        id: "msg-103",
        remetente: "cliente",
        texto: "Gostaria de agendar uma reunião para tirar dúvidas sobre a automação.",
        dataHora: "2026-09-02T13:40:00Z"
      }
    ]
  },
  {
    id: "atend-002",
    cliente: {
      nome: "Mariana Souza",
      telefone: "+55 21 99887-6655",
      email: "mariana.souza@email.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana"
    },
    status: "aguardando",
    prioridade: "media",
    canal: "whatsapp",
    atendente: "João Victor",
    ultimaMensagem: "Qual é o valor do plano mensal para 3 atendentes?",
    dataAtualizacao: "2026-09-02T12:15:00Z",
    mensagens: [
      {
        id: "msg-201",
        remetente: "cliente",
        texto: "Qual é o valor do plano mensal para 3 atendentes?",
        dataHora: "2026-09-02T12:15:00Z"
      }
    ]
  },
  {
    id: "atend-003",
    cliente: {
      nome: "Empresa Tech Solutions",
      telefone: "+55 31 97654-3210",
      email: "contato@techsolutions.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech"
    },
    status: "concluido",
    prioridade: "baixa",
    canal: "whatsapp",
    atendente: "IA LocalFlow",
    ultimaMensagem: "Obrigado! O suporte resolveu o meu problema rapidamente.",
    dataAtualizacao: "2026-09-01T18:30:00Z",
    mensagens: [
      {
        id: "msg-301",
        remetente: "cliente",
        texto: "Não estou conseguindo integrar o webhook.",
        dataHora: "2026-09-01T18:00:00Z"
      },
      {
        id: "msg-302",
        remetente: "ia",
        texto: "Enviei o link da documentação do webhook no seu e-mail.",
        dataHora: "2026-09-01T18:10:00Z"
      },
      {
        id: "msg-303",
        remetente: "cliente",
        texto: "Obrigado! O suporte resolveu o meu problema rapidamente.",
        dataHora: "2026-09-01T18:30:00Z"
      }

      
    ]
  }
];
