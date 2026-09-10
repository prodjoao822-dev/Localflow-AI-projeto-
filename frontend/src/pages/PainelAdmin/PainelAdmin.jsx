import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { atendenteService } from '../../services/atendenteService';
import { EMPRESA_MOCK } from '../../mocks/dadosMock';
import Layout from '../../components/Layout/Layout';
import Icone from '../../components/Icone/Icone';
import Avatar from '../../components/Avatar/Avatar';
import Badge from '../../components/Badge/Badge';
import TagPendencia from '../../components/TagPendencia/TagPendencia';
import { formatarData } from '../../utils/formatadores';
import './PainelAdmin.css';

const FORM_VAZIO = { nome: '', email: '', telefone: '' };

/**
 * Tela 4 — Painel do Administrador (RF02).
 * Cadastro, edição e remoção de atendentes, sobre dados mockados.
 *
 * Pendências reais exibidas com placeholder visível:
 * - Fluxo completo de cadastro de funcionário (permissões, aprovação) [RF02]
 * - Autenticação segura / IAM real [RNF01]
 */
export default function PainelAdmin() {
  const { usuario, sair } = useAuth();

  const [atendentes, setAtendentes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null); // id ou null (cadastro)
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  const [removendo, setRemovendo] = useState(null);
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    let ativo = true;
    atendenteService.listar().then((dados) => {
      if (!ativo) return;
      setAtendentes(dados);
      setCarregando(false);
    });
    return () => {
      ativo = false;
    };
  }, []);

  function abrirCadastro() {
    setEditando(null);
    setForm(FORM_VAZIO);
    setErroForm('');
    setModalAberto(true);
  }

  function abrirEdicao(atendente) {
    setEditando(atendente.id);
    setForm({
      nome: atendente.nome,
      email: atendente.email,
      telefone: atendente.telefone,
    });
    setErroForm('');
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;
    setModalAberto(false);
  }

  async function salvar(evento) {
    evento.preventDefault();
    if (!form.nome.trim() || !form.email.trim()) {
      setErroForm('Preencha nome e e-mail.');
      return;
    }
    setSalvando(true);
    setErroForm('');
    try {
      if (editando) {
        const atualizado = await atendenteService.atualizar(editando, form);
        setAtendentes((prev) =>
          prev.map((a) => (a.id === atualizado.id ? atualizado : a))
        );
      } else {
        const criado = await atendenteService.criar(form);
        setAtendentes((prev) => [criado, ...prev]);
      }
      setModalAberto(false);
    } catch (e) {
      setErroForm(e.message || 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  async function remover(atendente) {
    const confirmar = window.confirm(
      `Remover ${atendente.nome}? (a operação simula a exclusão no mock — em produção seria a desativação do usuário)`
    );
    if (!confirmar) return;
    setRemovendo(atendente.id);
    setAviso('');
    try {
      await atendenteService.remover(atendente.id);
      setAtendentes((prev) => prev.filter((a) => a.id !== atendente.id));
      setAviso(`Atendente ${atendente.nome} removido (mock).`);
    } catch {
      setAviso('Não foi possível remover o atendente.');
    } finally {
      setRemovendo(null);
    }
  }

  const filtrados = atendentes.filter((a) => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return true;
    return `${a.nome} ${a.email} ${a.telefone}`.toLowerCase().includes(termo);
  });

  return (
    <Layout
      empresa={EMPRESA_MOCK}
      usuario={usuario}
      navItens={[]}
      onLogout={sair}
    >
      <header className="admin-topo">
        <div>
          <h1 className="admin-titulo">Atendentes</h1>
          <p className="admin-subtitulo">
            Equipe que usa o painel de atendimento. Cadastro, edição e remoção
            (RF02).
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={abrirCadastro}>
          <Icone nome="mais" size={16} />
          Novo atendente
        </button>
      </header>

      <div className="admin-pendencia">
        <TagPendencia
          codigo="RF02"
          descricao="Fluxo completo de cadastro de funcionário (permissões, aprovação) é [PENDENTE] nos requisitos."
        />
        <span className="admin-pendencia-texto">
          O fluxo completo de cadastro de funcionário (permissões e aprovação)
          ainda é uma lacuna dos requisitos — aqui o cadastro é direto, sem
          fluxo de aprovação.
        </span>
      </div>

      <div className="admin-controles">
        <div className="pesquisa-input">
          <Icone nome="lupa" size={16} />
          <input
            placeholder="Buscar por nome, e-mail ou telefone…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-corpo">
        {aviso && <p className="admin-aviso">{aviso}</p>}

        {carregando ? (
          <p className="admin-vazio">Carregando atendentes…</p>
        ) : filtrados.length === 0 ? (
          <p className="admin-vazio">Nenhum atendente encontrado.</p>
        ) : (
          <div className="admin-tabela">
            <div className="admin-tabela-cabecalho">
              <span>Atendente</span>
              <span>Telefone</span>
              <span>Status</span>
              <span>Desde</span>
              <span className="admin-tabela-acoes">Ações</span>
            </div>
            {filtrados.map((atendente) => (
              <div key={atendente.id} className="admin-linha">
                <div className="admin-linha-atendente">
                  <Avatar nome={atendente.nome} size={32} />
                  <div className="admin-linha-info">
                    <strong>{atendente.nome}</strong>
                    <span>{atendente.email}</span>
                  </div>
                </div>
                <span className="admin-linha-celula">{atendente.telefone}</span>
                <span className="admin-linha-celula">
                  <Badge tone={atendente.ativo ? 'success' : 'neutral'}>
                    {atendente.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </span>
                <span className="admin-linha-celula">
                  {formatarData(atendente.criadoEm)}
                </span>
                <div className="admin-linha-acoes">
                  <button
                    type="button"
                    className="btn btn-ghost admin-acao"
                    onClick={() => abrirEdicao(atendente)}
                    title="Editar"
                  >
                    <Icone nome="editar" size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger admin-acao"
                    onClick={() => remover(atendente)}
                    disabled={removendo === atendente.id}
                    title="Remover"
                  >
                    <Icone nome="lixeira" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalAberto && (
        <div
          className="admin-modal-fundo"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) fecharModal();
          }}
        >
          <div className="admin-modal">
            <div className="admin-modal-cabecalho">
              <h2 className="admin-modal-titulo">
                {editando ? 'Editar atendente' : 'Novo atendente'}
              </h2>
              <button
                type="button"
                className="btn btn-ghost admin-modal-fechar"
                onClick={fecharModal}
                title="Fechar"
              >
                <Icone nome="fechar" size={16} />
              </button>
            </div>

            <form className="admin-form" onSubmit={salvar}>
              <label className="admin-campo">
                <span>Nome completo</span>
                <input
                  className="input"
                  placeholder="Ex.: Carla Menezes"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                />
              </label>

              <label className="admin-campo">
                <span>E-mail</span>
                <input
                  type="email"
                  className="input"
                  placeholder="ex.: carla@casadasoleira.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </label>

              <label className="admin-campo">
                <span>Telefone</span>
                <input
                  className="input"
                  placeholder="+55 11 99999-0000"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                />
              </label>

              {erroForm && <p className="admin-erro">{erroForm}</p>}

              <div className="admin-form-rodape">
                <TagPendencia codigo="RF02" descricao="Permissões e aprovação são [PENDENTE] nos requisitos." />
                <div className="admin-form-acoes">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={fecharModal}
                    disabled={salvando}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={salvando}>
                    {salvando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Cadastrar'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
