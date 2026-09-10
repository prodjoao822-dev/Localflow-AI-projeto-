/**
 * CONTRATO DE DADOS — LocalFlow AI (Mock)
 * ============================================================
 * Define a estrutura que os dados terão quando o backend
 * Node.js + Express + Prisma existir de verdade.
 *
 * Nenhuma tela importa esta pasta diretamente: tudo passa pelos
 * `services`, que hoje devolvem dados falsos com delay simulado e
 * amanhã serão trocados por `fetch()`/`axios` sem redesenhar as
 * telas (camada de comunicação).
 *
 * Convenções de estado (RN08 — contrato oficial de 4 estados):
 * - Conversa.status    (RF18): 'nova' | 'em_atendimento' | 'aguardando_cliente' | 'finalizada'
 * - Conversa.resultadoFinal: só existe quando status === 'finalizada';
 *   valores 'resolvida' | 'perdida'. NÃO é um estado paralelo — é o
 *   resultado do encerramento (decisão confirmada na Etapa 0).
 * - Conversa.intencao  (RF06): 'venda_rapida' | 'venda_sob_medida' | 'duvida' | 'faq' | 'reclamacao'
 * - Conversa.prioridade(RF06): 'alta' | 'media' | 'baixa'
 * - InteracaoIA.tipo   (RF07/RN02): 'classificacao' | 'resposta_faq' | 'coleta_dado' | 'escalada' | 'mensagem_espera'
 *   (decisão confirmada: InteraçãoIA é tabela própria no backend)
 */

export const EMPRESA_MOCK = {
  id: 'emp-001',
  nome: 'Casa da Soleira',
  segmento: 'Mármores e granitos',
};

/** Administrador/Dono (único admin no MVP) */
export const usuarioMock = {
  id: 'usr-admin-001',
  nome: 'Ana Ribeiro',
  email: 'admin@casadasoleira.com',
  senha: 'admin123',
  perfil: 'admin',
};

export const atendentesMock = [
  {
    id: 'atend-001',
    nome: 'João Victor',
    email: 'joao@casadasoleira.com',
    telefone: '+55 11 99999-0001',
    perfil: 'atendente',
    ativo: true,
    criadoEm: '2026-08-10T09:00:00Z',
  },
  {
    id: 'atend-002',
    nome: 'Mariana Costa',
    email: 'mariana@casadasoleira.com',
    telefone: '+55 11 99999-0002',
    perfil: 'atendente',
    ativo: true,
    criadoEm: '2026-08-15T14:30:00Z',
  },
  {
    id: 'atend-003',
    nome: 'Rafael Lima',
    email: 'rafael@casadasoleira.com',
    telefone: '+55 11 99999-0003',
    perfil: 'atendente',
    ativo: false,
    criadoEm: '2026-07-02T10:00:00Z',
  },
  {
    id: 'atend-004',
    nome: 'Camila Duarte',
    email: 'camila@casadasoleira.com',
    telefone: '+55 11 99999-0004',
    perfil: 'atendente',
    ativo: true,
    criadoEm: '2026-08-28T11:45:00Z',
  },
];

/**
 * Interações da IA registradas por conversa (RF07 + RN02).
 * `detalhes` é a trilha de auditoria exibida ao atendente.
 */
export const interacoesMock = {
  'conv-001': [
    {
      id: 'ia-101',
      tipo: 'classificacao',
      dataHora: '2026-09-04T08:31:00Z',
      detalhes:
        'Intenção identificada: venda sob medida (cozinha em quartzo). Prioridade alta — cliente já informou medidas e pediu orçamento.',
    },
    {
      id: 'ia-102',
      tipo: 'coleta_dado',
      dataHora: '2026-09-04T08:32:00Z',
      detalhes:
        'Dado coletado do cliente: medidas 3,0m x 0,65m; cor de preferência branco (sem orçamento gerado — RN01).',
    },
    {
      id: 'ia-103',
      tipo: 'escalada',
      dataHora: '2026-09-04T08:36:00Z',
      detalhes:
        'Escalada disparada: cliente pediu orçamento, o que exige ação humana. Lógica de escalada sem atendente designado: [PENDENTE — RN03].',
    },
  ],
  'conv-002': [
    {
      id: 'ia-201',
      tipo: 'resposta_faq',
      dataHora: '2026-09-04T08:20:00Z',
      detalhes:
        'Pergunta sobre funcionamento em finais de semana respondida automaticamente com base na base de conhecimento (RF11).',
    },
    {
      id: 'ia-202',
      tipo: 'classificacao',
      dataHora: '2026-09-04T08:21:00Z',
      detalhes: 'Intenção identificada: dúvida / FAQ. Prioridade baixa.',
    },
  ],
  'conv-003': [
    {
      id: 'ia-301',
      tipo: 'classificacao',
      dataHora: '2026-09-04T07:55:00Z',
      detalhes:
        'Intenção identificada: venda rápida (soleira pronta entrega). Prioridade alta — cliente pergunta sobre estoque/disponibilidade.',
    },
  ],
  'conv-004': [
    {
      id: 'ia-401',
      tipo: 'mensagem_espera',
      dataHora: '2026-09-03T16:50:00Z',
      detalhes:
        'Mensagem de espera enviada ao cliente: "Obrigado pela paciência! Em instantes um atendente responde." (RF15)',
    },
    {
      id: 'ia-402',
      tipo: 'classificacao',
      dataHora: '2026-09-03T16:48:00Z',
      detalhes: 'Intenção identificada: reclamação. Prioridade alta — prazo combinado não cumprido.',
    },
    {
      id: 'ia-403',
      tipo: 'escalada',
      dataHora: '2026-09-03T16:49:00Z',
      detalhes: 'Escalada direcionada ao atendente da conversa (João Victor) — RN03.',
    },
  ],
  'conv-005': [
    {
      id: 'ia-501',
      tipo: 'classificacao',
      dataHora: '2026-09-03T14:20:00Z',
      detalhes: 'Intenção identificada: dúvida. Prioridade média.',
    },
    {
      id: 'ia-502',
      tipo: 'coleta_dado',
      dataHora: '2026-09-03T14:22:00Z',
      detalhes:
        'Dado coletado: bancada 2,5m x 0,60m em granito (cliente entre granito e quartzo). Orçamento depende de humano — RN01.',
    },
  ],
  'conv-006': [
    {
      id: 'ia-601',
      tipo: 'resposta_faq',
      dataHora: '2026-09-03T10:05:00Z',
      detalhes: 'Pergunta sobre entrega em Cotia respondida automaticamente (RF11).',
    },
    {
      id: 'ia-602',
      tipo: 'classificacao',
      dataHora: '2026-09-03T10:06:00Z',
      detalhes: 'Intenção identificada: venda rápida (pia pronta entrega). Prioridade alta.',
    },
  ],
  'conv-007': [
    {
      id: 'ia-701',
      tipo: 'classificacao',
      dataHora: '2026-09-02T17:32:00Z',
      detalhes: 'Intenção identificada: venda sob medida (escada em mármore). Prioridade média.',
    },
  ],
  'conv-008': [
    {
      id: 'ia-801',
      tipo: 'classificacao',
      dataHora: '2026-09-01T11:20:00Z',
      detalhes: 'Intenção identificada: reclamação. Prioridade alta — pia instalada com trinca.',
    },
    {
      id: 'ia-802',
      tipo: 'escalada',
      dataHora: '2026-09-01T11:22:00Z',
      detalhes: 'Escalada direcionada ao atendente da conversa (Mariana Costa) — RN03.',
    },
  ],
  'conv-009': [
    {
      id: 'ia-901',
      tipo: 'classificacao',
      dataHora: '2026-08-29T09:12:00Z',
      detalhes: 'Intenção identificada: dúvida (formas de pagamento). Prioridade baixa.',
    },
    {
      id: 'ia-902',
      tipo: 'resposta_faq',
      dataHora: '2026-08-29T09:13:00Z',
      detalhes: 'Formas de pagamento respondidas automaticamente (RF11).',
    },
  ],
  'conv-010': [
    {
      id: 'ia-1001',
      tipo: 'classificacao',
      dataHora: '2026-08-28T15:00:00Z',
      detalhes: 'Intenção identificada: venda rápida (mesa de granito). Prioridade alta.',
    },
  ],
  'conv-011': [
    {
      id: 'ia-1101',
      tipo: 'classificacao',
      dataHora: '2026-09-04T09:02:00Z',
      detalhes:
        'Intenção identificada: venda sob medida (pia em granito cinza andorinha). Prioridade alta — primeira mensagem já com medidas.',
    },
  ],
};

/**
 * Conversas da fila do painel do Atendente (RF05).
 * `atendenteId: null` = ainda não assumida por humano (RF08).
 */
export const conversasMock = [
  {
    id: 'conv-001',
    cliente: { id: 'cli-001', nome: 'Roberto Almeida', telefone: '+55 11 98765-4321', avatarSeed: 'Roberto Almeida' },
    status: 'nova',
    intencao: 'venda_sob_medida',
    prioridade: 'alta',
    atendenteId: null,
    ultimaMensagem: 'Quanto ficaria a bancada de quartzo branco?',
    ultimaAtualizacao: '2026-09-04T08:36:00Z',
    naoLidas: 2,
    mensagens: [
      { id: 'msg-101', remetente: 'cliente', texto: 'Olá! Vi o anúncio de vocês no Instagram, parabéns pelo trabalho.', dataHora: '2026-09-04T08:28:00Z' },
      { id: 'msg-102', remetente: 'ia', texto: 'Olá, Roberto! Bem-vindo à Casa da Soleira. Como posso te ajudar?', dataHora: '2026-09-04T08:29:00Z' },
      { id: 'msg-103', remetente: 'cliente', texto: 'Estou reformando a cozinha e queria uma bancada de quartzo branco.', dataHora: '2026-09-04T08:30:00Z' },
      { id: 'msg-104', remetente: 'ia', texto: 'Ótima escolha! Para o orçamento, quais as medidas da bancada?', dataHora: '2026-09-04T08:31:00Z' },
      { id: 'msg-105', remetente: 'cliente', texto: '3,0m x 0,65m, com cuba simples embutida.', dataHora: '2026-09-04T08:32:00Z' },
      { id: 'msg-106', remetente: 'ia', texto: 'Anotei! Um atendente vai te passar o valor em instantes.', dataHora: '2026-09-04T08:36:00Z' },
    ],
  },
  {
    id: 'conv-002',
    cliente: { id: 'cli-002', nome: 'Fernanda Lima', telefone: '+55 11 97654-3210', avatarSeed: 'Fernanda Lima' },
    status: 'nova',
    intencao: 'faq',
    prioridade: 'baixa',
    atendenteId: null,
    ultimaMensagem: 'Vocês atendem aos sábados?',
    ultimaAtualizacao: '2026-09-04T08:21:00Z',
    naoLidas: 0,
    mensagens: [
      { id: 'msg-201', remetente: 'cliente', texto: 'Bom dia! Vocês atendem aos sábados?', dataHora: '2026-09-04T08:20:00Z' },
      { id: 'msg-202', remetente: 'ia', texto: 'Bom dia, Fernanda! Atendemos de segunda a sábado, das 8h às 18h.', dataHora: '2026-09-04T08:21:00Z' },
    ],
  },
  {
    id: 'conv-003',
    cliente: { id: 'cli-003', nome: 'Marcos Vinícius', telefone: '+55 11 96543-2109', avatarSeed: 'Marcos Vinícius' },
    status: 'nova',
    intencao: 'venda_rapida',
    prioridade: 'alta',
    atendenteId: null,
    ultimaMensagem: 'Tem soleira de granito pronta para retirada hoje?',
    ultimaAtualizacao: '2026-09-04T07:55:00Z',
    naoLidas: 1,
    mensagens: [
      { id: 'msg-301', remetente: 'cliente', texto: 'Oi! Tem soleira de granito pronta para retirada hoje?', dataHora: '2026-09-04T07:54:00Z' },
      { id: 'msg-302', remetente: 'ia', texto: 'Olá, Marcos! Vou verificar a disponibilidade do nosso estoque.', dataHora: '2026-09-04T07:55:00Z' },
    ],
  },
  {
    id: 'conv-004',
    cliente: { id: 'cli-004', nome: 'Sílvia Ramos', telefone: '+55 11 95432-1098', avatarSeed: 'Sílvia Ramos' },
    status: 'aguardando_cliente',
    intencao: 'reclamacao',
    prioridade: 'alta',
    atendenteId: 'atend-001',
    ultimaMensagem: 'Ficou bom, obrigada pela atenção.',
    ultimaAtualizacao: '2026-09-03T16:50:00Z',
    naoLidas: 0,
    mensagens: [
      { id: 'msg-401', remetente: 'cliente', texto: 'Estou aguardando a entrega da bancada há mais de uma semana!', dataHora: '2026-09-03T16:45:00Z' },
      { id: 'msg-402', remetente: 'ia', texto: 'Sinto muito pelo atraso, Sílvia. Vou acionar nosso atendente imediatamente.', dataHora: '2026-09-03T16:46:00Z' },
      { id: 'msg-403', remetente: 'atendente', texto: 'Sílvia, boa tarde! Confirmando aqui: a entrega está agendada para amanhã, período da manhã. Peço desculpas pelo transtorno.', dataHora: '2026-09-03T16:49:00Z', autorId: 'atend-001', autorNome: 'João Victor' },
      { id: 'msg-404', remetente: 'cliente', texto: 'Ficou bom, obrigada pela atenção.', dataHora: '2026-09-03T16:50:00Z' },
    ],
  },
  {
    id: 'conv-005',
    cliente: { id: 'cli-005', nome: 'Pedro Henrique', telefone: '+55 11 94321-0987', avatarSeed: 'Pedro Henrique' },
    status: 'em_atendimento',
    intencao: 'venda_sob_medida',
    prioridade: 'media',
    atendenteId: 'atend-002',
    ultimaMensagem: 'Qual o prazo médio de produção?',
    ultimaAtualizacao: '2026-09-03T14:25:00Z',
    naoLidas: 1,
    mensagens: [
      { id: 'msg-501', remetente: 'cliente', texto: 'Olá! Quero fazer uma bancada de granito para a cozinha nova.', dataHora: '2026-09-03T14:20:00Z' },
      { id: 'msg-502', remetente: 'ia', texto: 'Olá, Pedro! Qual a medida aproximada e o material que você prefere?', dataHora: '2026-09-03T14:21:00Z' },
      { id: 'msg-503', remetente: 'cliente', texto: '2,5m x 0,60m, granito cinza andorinha.', dataHora: '2026-09-03T14:22:00Z' },
      { id: 'msg-504', remetente: 'atendente', texto: 'Perfeito, Pedro! Vou montar a proposta com esse material.', dataHora: '2026-09-03T14:23:00Z', autorId: 'atend-002', autorNome: 'Mariana Costa' },
      { id: 'msg-505', remetente: 'cliente', texto: 'Qual o prazo médio de produção?', dataHora: '2026-09-03T14:25:00Z' },
    ],
  },
  {
    id: 'conv-006',
    cliente: { id: 'cli-006', nome: 'Luciana Prado', telefone: '+55 11 93210-9876', avatarSeed: 'Luciana Prado' },
    status: 'em_atendimento',
    intencao: 'venda_rapida',
    prioridade: 'alta',
    atendenteId: 'atend-001',
    ultimaMensagem: 'Perfeito, fico no aguardo do valor.',
    ultimaAtualizacao: '2026-09-03T10:06:00Z',
    naoLidas: 0,
    mensagens: [
      { id: 'msg-601', remetente: 'cliente', texto: 'Bom dia! Entregam pia pronta em Cotia?', dataHora: '2026-09-03T10:04:00Z' },
      { id: 'msg-602', remetente: 'ia', texto: 'Bom dia, Luciana! Entregamos sim, inclusive em Cotia.', dataHora: '2026-09-03T10:05:00Z' },
      { id: 'msg-603', remetente: 'cliente', texto: 'Que ótimo! Quero uma pia preta absoluto das prontas.', dataHora: '2026-09-03T10:05:00Z' },
      { id: 'msg-604', remetente: 'atendente', texto: 'Luciana, temos essa pia disponível no showroom. Vou te passar o valor ainda hoje.', dataHora: '2026-09-03T10:06:00Z', autorId: 'atend-001', autorNome: 'João Victor' },
    ],
  },
  {
    id: 'conv-007',
    cliente: { id: 'cli-007', nome: 'Ricardo Nunes', telefone: '+55 11 92109-8765', avatarSeed: 'Ricardo Nunes' },
    status: 'em_atendimento',
    intencao: 'venda_sob_medida',
    prioridade: 'media',
    atendenteId: 'atend-002',
    ultimaMensagem: 'Pode me mandar as opções de acabamento?',
    ultimaAtualizacao: '2026-09-02T17:40:00Z',
    naoLidas: 0,
    mensagens: [
      { id: 'msg-701', remetente: 'cliente', texto: 'Preciso de uma escada de mármore para o hall da casa.', dataHora: '2026-09-02T17:30:00Z' },
      { id: 'msg-702', remetente: 'ia', texto: 'Que projeto bonito! Quais as medidas dos degraus?', dataHora: '2026-09-02T17:32:00Z' },
      { id: 'msg-703', remetente: 'cliente', texto: '12 degraus, 0,30m de profundidade cada.', dataHora: '2026-09-02T17:35:00Z' },
      { id: 'msg-704', remetente: 'atendente', texto: 'Ótimo, Ricardo! Com essas medidas já consigo preparar uma proposta.', dataHora: '2026-09-02T17:40:00Z', autorId: 'atend-002', autorNome: 'Mariana Costa' },
    ],
  },
  {
    id: 'conv-008',
    cliente: { id: 'cli-008', nome: 'Tatiane Moraes', telefone: '+55 11 91098-7654', avatarSeed: 'Tatiane Moraes' },
    status: 'aguardando_cliente',
    intencao: 'reclamacao',
    prioridade: 'alta',
    atendenteId: 'atend-002',
    ultimaMensagem: 'Vou tirar as fotos e te mando.',
    ultimaAtualizacao: '2026-09-01T11:30:00Z',
    naoLidas: 0,
    mensagens: [
      { id: 'msg-801', remetente: 'cliente', texto: 'A pia que vocês instalaram está com uma trinca visível.', dataHora: '2026-09-01T11:20:00Z' },
      { id: 'msg-802', remetente: 'ia', texto: 'Lamento por isso, Tatiane. Vou direcionar para nossa equipe.', dataHora: '2026-09-01T11:22:00Z' },
      { id: 'msg-803', remetente: 'atendente', texto: 'Tatiane, pode me enviar fotos da trinca? Vamos resolver.', dataHora: '2026-09-01T11:25:00Z', autorId: 'atend-002', autorNome: 'Mariana Costa' },
      { id: 'msg-804', remetente: 'cliente', texto: 'Vou tirar as fotos e te mando.', dataHora: '2026-09-01T11:30:00Z' },
    ],
  },
  {
    id: 'conv-009',
    cliente: { id: 'cli-009', nome: 'José Carlos', telefone: '+55 11 90987-6543', avatarSeed: 'José Carlos' },
    status: 'finalizada',
    resultadoFinal: 'perdida',
    intencao: 'duvida',
    prioridade: 'baixa',
    atendenteId: 'atend-001',
    ultimaMensagem: 'Sem problema, fica para a próxima.',
    ultimaAtualizacao: '2026-08-29T09:40:00Z',
    naoLidas: 0,
    mensagens: [
      { id: 'msg-901', remetente: 'cliente', texto: 'Quais as formas de pagamento?', dataHora: '2026-08-29T09:12:00Z' },
      { id: 'msg-902', remetente: 'ia', texto: 'Trabalhamos com Pix, cartão em até 12x e boleto.', dataHora: '2026-08-29T09:13:00Z' },
      { id: 'msg-903', remetente: 'cliente', texto: 'Achei o prazo de orçamento demorado, vou avaliar outras opções.', dataHora: '2026-08-29T09:30:00Z' },
      { id: 'msg-904', remetente: 'atendente', texto: 'Entendido, José Carlos. Qualquer coisa estamos à disposição.', dataHora: '2026-08-29T09:40:00Z', autorId: 'atend-001', autorNome: 'João Victor' },
    ],
  },
  {
    id: 'conv-010',
    cliente: { id: 'cli-010', nome: 'Amanda Ferreira', telefone: '+55 11 90876-5432', avatarSeed: 'Amanda Ferreira' },
    status: 'finalizada',
    resultadoFinal: 'resolvida',
    intencao: 'venda_rapida',
    prioridade: 'alta',
    atendenteId: 'atend-001',
    ultimaMensagem: 'Recebi, muito obrigada!',
    ultimaAtualizacao: '2026-08-28T15:05:00Z',
    naoLidas: 0,
    mensagens: [
      { id: 'msg-1001', remetente: 'cliente', texto: 'Quanto custa a mesa de granito preto do anúncio?', dataHora: '2026-08-28T15:00:00Z' },
      { id: 'msg-1002', remetente: 'ia', texto: 'Boa tarde! Essa mesa é 1,40m x 0,80m. Vou confirmar o valor com nosso time.', dataHora: '2026-08-28T15:01:00Z' },
      { id: 'msg-1003', remetente: 'atendente', texto: 'Amanda, a mesa preto absoluto está por R$ 2.450,00 com entrega inclusa na capital.', dataHora: '2026-08-28T15:02:00Z', autorId: 'atend-001', autorNome: 'João Victor' },
      { id: 'msg-1004', remetente: 'cliente', texto: 'Fechado! Pode me mandar os dados do Pix?', dataHora: '2026-08-28T15:03:00Z' },
      { id: 'msg-1005', remetente: 'atendente', texto: 'Claro! Enviei os dados no privado. Agendamos a entrega para sexta.', dataHora: '2026-08-28T15:04:00Z', autorId: 'atend-001', autorNome: 'João Victor' },
      { id: 'msg-1006', remetente: 'cliente', texto: 'Recebi, muito obrigada!', dataHora: '2026-08-28T15:05:00Z' },
    ],
  },
  {
    id: 'conv-011',
    cliente: { id: 'cli-011', nome: 'Beatriz Campos', telefone: '+55 11 98765-1111', avatarSeed: 'Beatriz Campos' },
    status: 'nova',
    intencao: 'venda_sob_medida',
    prioridade: 'alta',
    atendenteId: null,
    ultimaMensagem: 'Quanto fica uma pia de 1,8m em granito cinza andorinha?',
    ultimaAtualizacao: '2026-09-04T09:03:00Z',
    naoLidas: 1,
    mensagens: [
      { id: 'msg-1101', remetente: 'cliente', texto: 'Quanto fica uma pia de 1,8m em granito cinza andorinha?', dataHora: '2026-09-04T09:02:00Z' },
      { id: 'msg-1102', remetente: 'ia', texto: 'Olá, Beatriz! Vou verificar com nosso time e já te retorno.', dataHora: '2026-09-04T09:03:00Z' },
    ],
  },
];
