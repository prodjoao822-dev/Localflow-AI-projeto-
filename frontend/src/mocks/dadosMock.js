/**
 * CONTRATO DE DADOS — LocalFlow AI (Mock)
 * ============================================================
 * Os dados abaixo seguem o formato do contrato de API planejado em
 * docs/planejamento-arquitetura.md (seção 5) e os nomes de campo do
 * schema Prisma (backend/prisma/schema.prisma). Assim, trocar o mock
 * pela API real não exige reescrever componentes.
 *
 * Nenhuma tela importa esta pasta diretamente: tudo passa pelos
 * `services`, que hoje devolvem estes dados com delay simulado e
 * amanhã serão trocados por `fetch()`.
 *
 * Cada item de `conversasMock` representa o que `GET /conversas/:id`
 * devolveria. O resumo da fila (`GET /conversas`) é derivado dele no
 * conversaService (ex.: `ultimaMensagem` vem da última mensagem).
 *
 * Vocabulário (RN08 / RF06 / RF07):
 * - status:         'nova' | 'em_atendimento' | 'aguardando_cliente' | 'finalizada'
 * - resultadoFinal: 'resolvida' | 'perdida' — só quando status === 'finalizada'
 * - needsAction:    boolean — flag (NÃO é estado). true = precisa de ação humana
 * - intencao:       'venda_rapida' | 'venda_sob_medida' | 'duvida' | 'faq' | 'reclamacao'
 * - prioridade:     'alta' | 'media' | 'baixa'
 * - Mensagem.origem: 'cliente' | 'ia' | 'atendente'
 * - InteracaoIA.tipo: 'classificacao' | 'resposta_faq' | 'coleta_dado' | 'escalada' | 'mensagem_espera'
 *
 * [ASSUMIDO] O contrato de detalhe (GET /conversas/:id) ainda não está
 * escrito nos docs. O formato de `mensagens`, `interacoesIA` e de
 * `atendenteResponsavel` ({ id, nome }) foi derivado do schema Prisma.
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

/**
 * Atendentes (GET /atendentes). Campos do model Usuario no Prisma — sem
 * senhaHash: "a senha nunca aparece na resposta" (contrato de Atendentes).
 * `primeiroAcessoPendente: true` = ainda não trocou a senha inicial (RN05).
 */
export const atendentesMock = [
  {
    id: 'atend-001',
    nome: 'João Victor',
    email: 'joao@casadasoleira.com',
    telefone: '+55 11 99999-0001',
    perfil: 'atendente',
    ativo: true,
    primeiroAcessoPendente: false,
    createdAt: '2026-08-10T09:00:00Z',
  },
  {
    id: 'atend-002',
    nome: 'Mariana Costa',
    email: 'mariana@casadasoleira.com',
    telefone: '+55 11 99999-0002',
    perfil: 'atendente',
    ativo: true,
    primeiroAcessoPendente: false,
    createdAt: '2026-08-15T14:30:00Z',
  },
  {
    id: 'atend-003',
    nome: 'Rafael Lima',
    email: 'rafael@casadasoleira.com',
    telefone: '+55 11 99999-0003',
    perfil: 'atendente',
    ativo: false,
    primeiroAcessoPendente: false,
    createdAt: '2026-07-02T10:00:00Z',
  },
  {
    id: 'atend-004',
    nome: 'Camila Duarte',
    email: 'camila@casadasoleira.com',
    telefone: '+55 11 99999-0004',
    perfil: 'atendente',
    ativo: true,
    primeiroAcessoPendente: true,
    createdAt: '2026-08-28T11:45:00Z',
  },
];

const JOAO = { id: 'atend-001', nome: 'João Victor' };
const MARIANA = { id: 'atend-002', nome: 'Mariana Costa' };

/** Atalhos para montar mensagens no formato do contrato. */
const doCliente = (id, texto, createdAt) => ({
  id, origem: 'cliente', autor: null, texto, statusEnvio: 'recebida', createdAt,
});
const daIA = (id, texto, createdAt) => ({
  id, origem: 'ia', autor: null, texto, statusEnvio: 'enviada', createdAt,
});
const doAtendente = (id, autor, texto, createdAt) => ({
  id, origem: 'atendente', autor, texto, statusEnvio: 'enviada', createdAt,
});
const interacao = (id, tipo, saidaResumo, createdAt, mensagemId = null) => ({
  id, tipo, mensagemId, entradaResumo: null, saidaResumo, createdAt,
});

export const conversasMock = [
  {
    id: 'conv-001',
    canal: 'whatsapp',
    cliente: { id: 'cli-001', nome: 'Roberto Almeida', telefone: '+55 11 98765-4321' },
    status: 'nova',
    resultadoFinal: null,
    intencao: 'venda_sob_medida',
    prioridade: 'alta',
    atendenteResponsavel: null,
    needsAction: true,
    mensagens: [
      doCliente('msg-101', 'Olá! Vi o trabalho de vocês no Instagram, parabéns.', '2026-09-04T08:28:00Z'),
      daIA('msg-102', 'Olá, Roberto! Bem-vindo à Casa da Soleira. Como posso te ajudar?', '2026-09-04T08:29:00Z'),
      doCliente('msg-103', 'Estou reformando a cozinha e queria uma bancada de quartzo branco.', '2026-09-04T08:30:00Z'),
      daIA('msg-104', 'Ótima escolha! Quais as medidas da bancada?', '2026-09-04T08:31:00Z'),
      doCliente('msg-105', '3,0m x 0,65m, com cuba simples embutida. Quanto ficaria?', '2026-09-04T08:32:00Z'),
      daIA('msg-106', 'Anotei! Um atendente vai te passar o valor em instantes.', '2026-09-04T08:36:00Z'),
    ],
    interacoesIA: [
      interacao('ia-101', 'classificacao', 'Intenção: venda sob medida (bancada em quartzo). Prioridade alta — cliente já informou medidas e pediu valor.', '2026-09-04T08:31:00Z'),
      interacao('ia-102', 'coleta_dado', 'Medidas 3,0m x 0,65m, cuba simples embutida, quartzo branco. Nenhum orçamento gerado (RN01).', '2026-09-04T08:32:00Z'),
      interacao('ia-103', 'escalada', 'Pedido de orçamento exige ação humana. Sem responsável: conversa na fila geral e atendentes ativos notificados (RN03).', '2026-09-04T08:36:00Z', 'msg-106'),
    ],
  },
  {
    id: 'conv-011',
    canal: 'whatsapp',
    cliente: { id: 'cli-011', nome: 'Beatriz Campos', telefone: '+55 11 98765-1111' },
    status: 'nova',
    resultadoFinal: null,
    intencao: 'venda_sob_medida',
    prioridade: 'alta',
    atendenteResponsavel: null,
    needsAction: true,
    mensagens: [
      doCliente('msg-1101', 'Quanto fica uma pia de 1,8m em granito cinza andorinha?', '2026-09-04T09:02:00Z'),
      daIA('msg-1102', 'Olá, Beatriz! Vou verificar com nosso time e já te retorno.', '2026-09-04T09:03:00Z'),
    ],
    interacoesIA: [
      interacao('ia-1101', 'classificacao', 'Intenção: venda sob medida (pia em granito cinza andorinha). Prioridade alta — primeira mensagem já com medidas.', '2026-09-04T09:02:00Z'),
      interacao('ia-1102', 'escalada', 'Pedido de valor exige ação humana. Conversa na fila geral (RN03).', '2026-09-04T09:03:00Z', 'msg-1102'),
    ],
  },
  {
    id: 'conv-003',
    canal: 'whatsapp',
    cliente: { id: 'cli-003', nome: 'Marcos Vinícius', telefone: '+55 11 96543-2109' },
    status: 'nova',
    resultadoFinal: null,
    intencao: 'venda_rapida',
    prioridade: 'alta',
    atendenteResponsavel: null,
    needsAction: true,
    mensagens: [
      doCliente('msg-301', 'Oi! Tem soleira de granito pronta para retirada hoje?', '2026-09-04T07:54:00Z'),
      daIA('msg-302', 'Olá, Marcos! Vou confirmar a disponibilidade com a equipe.', '2026-09-04T07:55:00Z'),
    ],
    interacoesIA: [
      interacao('ia-301', 'classificacao', 'Intenção: venda rápida (soleira pronta entrega). Prioridade alta — cliente quer retirar hoje.', '2026-09-04T07:55:00Z'),
      interacao('ia-302', 'escalada', 'Disponibilidade depende de confirmação humana. Conversa na fila geral (RN03).', '2026-09-04T07:55:00Z', 'msg-302'),
    ],
  },
  {
    id: 'conv-002',
    canal: 'whatsapp',
    cliente: { id: 'cli-002', nome: 'Fernanda Lima', telefone: '+55 11 97654-3210' },
    status: 'nova',
    resultadoFinal: null,
    intencao: 'faq',
    prioridade: 'baixa',
    atendenteResponsavel: null,
    needsAction: false,
    mensagens: [
      doCliente('msg-201', 'Bom dia! Vocês atendem aos sábados?', '2026-09-04T08:20:00Z'),
      daIA('msg-202', 'Bom dia, Fernanda! Atendemos de segunda a sábado, das 8h às 18h.', '2026-09-04T08:21:00Z'),
    ],
    interacoesIA: [
      interacao('ia-201', 'resposta_faq', 'Horário de funcionamento respondido automaticamente (RF11).', '2026-09-04T08:21:00Z', 'msg-202'),
      interacao('ia-202', 'classificacao', 'Intenção: FAQ. Prioridade baixa.', '2026-09-04T08:21:00Z'),
    ],
  },
  {
    id: 'conv-005',
    canal: 'whatsapp',
    cliente: { id: 'cli-005', nome: 'Pedro Henrique', telefone: '+55 11 94321-0987' },
    status: 'em_atendimento',
    resultadoFinal: null,
    intencao: 'venda_sob_medida',
    prioridade: 'media',
    atendenteResponsavel: MARIANA,
    needsAction: true,
    mensagens: [
      doCliente('msg-501', 'Olá! Quero fazer uma bancada de granito para a cozinha nova.', '2026-09-03T14:20:00Z'),
      daIA('msg-502', 'Olá, Pedro! Qual a medida aproximada e o material que você prefere?', '2026-09-03T14:21:00Z'),
      doCliente('msg-503', '2,5m x 0,60m, granito cinza andorinha.', '2026-09-03T14:22:00Z'),
      doAtendente('msg-504', MARIANA, 'Perfeito, Pedro! Vou montar a proposta com esse material.', '2026-09-03T14:23:00Z'),
      doCliente('msg-505', 'Qual o prazo médio de produção?', '2026-09-03T14:25:00Z'),
    ],
    interacoesIA: [
      interacao('ia-501', 'classificacao', 'Intenção: venda sob medida (bancada em granito). Prioridade média.', '2026-09-03T14:21:00Z'),
      interacao('ia-502', 'coleta_dado', 'Bancada 2,5m x 0,60m em granito cinza andorinha. Orçamento depende de humano (RN01).', '2026-09-03T14:22:00Z'),
      interacao('ia-503', 'escalada', 'Prazo de produção exige confirmação humana. Escalada ao responsável (Mariana Costa) — RN03.', '2026-09-03T14:25:00Z'),
    ],
  },
  {
    id: 'conv-006',
    canal: 'whatsapp',
    cliente: { id: 'cli-006', nome: 'Luciana Prado', telefone: '+55 11 93210-9876' },
    status: 'em_atendimento',
    resultadoFinal: null,
    intencao: 'venda_rapida',
    prioridade: 'alta',
    atendenteResponsavel: JOAO,
    needsAction: false,
    mensagens: [
      doCliente('msg-601', 'Bom dia! Entregam pia pronta em Cotia?', '2026-09-03T10:04:00Z'),
      daIA('msg-602', 'Bom dia, Luciana! Entregamos sim, inclusive em Cotia.', '2026-09-03T10:05:00Z'),
      doCliente('msg-603', 'Que ótimo! Quero uma pia preto absoluto das prontas.', '2026-09-03T10:05:30Z'),
      doAtendente('msg-604', JOAO, 'Luciana, temos essa pia disponível no showroom. Vou te passar o valor ainda hoje.', '2026-09-03T10:06:00Z'),
    ],
    interacoesIA: [
      interacao('ia-601', 'resposta_faq', 'Entrega em Cotia respondida automaticamente (RF11).', '2026-09-03T10:05:00Z', 'msg-602'),
      interacao('ia-602', 'classificacao', 'Intenção: venda rápida (pia pronta entrega). Prioridade alta.', '2026-09-03T10:06:00Z'),
    ],
  },
  {
    id: 'conv-007',
    canal: 'whatsapp',
    cliente: { id: 'cli-007', nome: 'Ricardo Nunes', telefone: '+55 11 92109-8765' },
    status: 'em_atendimento',
    resultadoFinal: null,
    intencao: 'venda_sob_medida',
    prioridade: 'media',
    atendenteResponsavel: MARIANA,
    needsAction: false,
    mensagens: [
      doCliente('msg-701', 'Preciso de uma escada de mármore para o hall da casa.', '2026-09-02T17:30:00Z'),
      daIA('msg-702', 'Que projeto bonito! Quais as medidas dos degraus?', '2026-09-02T17:32:00Z'),
      doCliente('msg-703', '12 degraus, 0,30m de profundidade cada.', '2026-09-02T17:35:00Z'),
      doAtendente('msg-704', MARIANA, 'Ótimo, Ricardo! Com essas medidas já consigo preparar uma proposta.', '2026-09-02T17:40:00Z'),
    ],
    interacoesIA: [
      interacao('ia-701', 'classificacao', 'Intenção: venda sob medida (escada em mármore). Prioridade média.', '2026-09-02T17:32:00Z'),
    ],
  },
  {
    id: 'conv-004',
    canal: 'whatsapp',
    cliente: { id: 'cli-004', nome: 'Sílvia Ramos', telefone: '+55 11 95432-1098' },
    status: 'aguardando_cliente',
    resultadoFinal: null,
    intencao: 'reclamacao',
    prioridade: 'alta',
    atendenteResponsavel: JOAO,
    needsAction: false,
    mensagens: [
      doCliente('msg-401', 'Estou aguardando a entrega da bancada há mais de uma semana!', '2026-09-03T16:45:00Z'),
      daIA('msg-402', 'Sinto muito pelo atraso, Sílvia. Vou acionar nosso atendente imediatamente.', '2026-09-03T16:46:00Z'),
      doAtendente('msg-403', JOAO, 'Sílvia, boa tarde! A entrega está agendada para amanhã, período da manhã. Peço desculpas pelo transtorno.', '2026-09-03T16:49:00Z'),
      doCliente('msg-404', 'Ok, vou aguardar então.', '2026-09-03T16:50:00Z'),
    ],
    interacoesIA: [
      interacao('ia-401', 'classificacao', 'Intenção: reclamação. Prioridade alta — prazo combinado não cumprido.', '2026-09-03T16:46:00Z'),
      interacao('ia-402', 'mensagem_espera', 'Mensagem de espera enviada enquanto o atendente assumia (RF15).', '2026-09-03T16:46:00Z', 'msg-402'),
      interacao('ia-403', 'escalada', 'Escalada ao responsável da conversa (João Victor) — RN03.', '2026-09-03T16:46:00Z'),
    ],
  },
  {
    id: 'conv-008',
    canal: 'whatsapp',
    cliente: { id: 'cli-008', nome: 'Tatiane Moraes', telefone: '+55 11 91098-7654' },
    status: 'aguardando_cliente',
    resultadoFinal: null,
    intencao: 'reclamacao',
    prioridade: 'alta',
    atendenteResponsavel: MARIANA,
    needsAction: false,
    mensagens: [
      doCliente('msg-801', 'A pia que vocês instalaram está com uma trinca visível.', '2026-09-01T11:20:00Z'),
      daIA('msg-802', 'Lamento por isso, Tatiane. Vou direcionar para nossa equipe.', '2026-09-01T11:22:00Z'),
      doAtendente('msg-803', MARIANA, 'Tatiane, pode me enviar fotos da trinca? Vamos resolver.', '2026-09-01T11:25:00Z'),
      doCliente('msg-804', 'Vou tirar as fotos e te mando.', '2026-09-01T11:30:00Z'),
    ],
    interacoesIA: [
      interacao('ia-801', 'classificacao', 'Intenção: reclamação. Prioridade alta — pia instalada com trinca.', '2026-09-01T11:20:00Z'),
      interacao('ia-802', 'escalada', 'Escalada ao responsável da conversa (Mariana Costa) — RN03.', '2026-09-01T11:22:00Z'),
    ],
  },
  {
    id: 'conv-009',
    canal: 'whatsapp',
    cliente: { id: 'cli-009', nome: 'José Carlos', telefone: '+55 11 90987-6543' },
    status: 'finalizada',
    resultadoFinal: 'perdida',
    intencao: 'duvida',
    prioridade: 'baixa',
    atendenteResponsavel: JOAO,
    needsAction: false,
    mensagens: [
      doCliente('msg-901', 'Quais as formas de pagamento?', '2026-08-29T09:12:00Z'),
      daIA('msg-902', 'Trabalhamos com Pix, cartão em até 12x e boleto.', '2026-08-29T09:13:00Z'),
      doCliente('msg-903', 'Achei o prazo de orçamento demorado, vou avaliar outras opções.', '2026-08-29T09:30:00Z'),
      doAtendente('msg-904', JOAO, 'Entendido, José Carlos. Qualquer coisa estamos à disposição.', '2026-08-29T09:40:00Z'),
    ],
    interacoesIA: [
      interacao('ia-901', 'classificacao', 'Intenção: dúvida (formas de pagamento). Prioridade baixa.', '2026-08-29T09:12:00Z'),
      interacao('ia-902', 'resposta_faq', 'Formas de pagamento respondidas automaticamente (RF11).', '2026-08-29T09:13:00Z', 'msg-902'),
    ],
  },
  {
    id: 'conv-010',
    canal: 'whatsapp',
    cliente: { id: 'cli-010', nome: 'Amanda Ferreira', telefone: '+55 11 90876-5432' },
    status: 'finalizada',
    resultadoFinal: 'resolvida',
    intencao: 'venda_rapida',
    prioridade: 'alta',
    atendenteResponsavel: JOAO,
    needsAction: false,
    mensagens: [
      doCliente('msg-1001', 'Quanto custa a mesa de granito preto do anúncio?', '2026-08-28T15:00:00Z'),
      daIA('msg-1002', 'Boa tarde! Essa mesa é 1,40m x 0,80m. Vou confirmar o valor com nosso time.', '2026-08-28T15:01:00Z'),
      doAtendente('msg-1003', JOAO, 'Amanda, a mesa preto absoluto está por R$ 2.450,00 com entrega inclusa na capital.', '2026-08-28T15:02:00Z'),
      doCliente('msg-1004', 'Fechado! Pode me mandar os dados do Pix?', '2026-08-28T15:03:00Z'),
      doAtendente('msg-1005', JOAO, 'Claro! Enviei os dados. Agendamos a entrega para sexta.', '2026-08-28T15:04:00Z'),
      doCliente('msg-1006', 'Recebi, muito obrigada!', '2026-08-28T15:05:00Z'),
    ],
    interacoesIA: [
      interacao('ia-1001', 'classificacao', 'Intenção: venda rápida (mesa de granito). Prioridade alta.', '2026-08-28T15:01:00Z'),
    ],
  },
];
