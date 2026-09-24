import { useEffect, useState } from 'react';
import { atendenteService } from '../../services/atendenteService';
import Layout from '../../components/Layout/Layout';
import CabecalhoPagina from '../../components/CabecalhoPagina/CabecalhoPagina';
import Badge from '../../components/Badge/Badge';
import Icone from '../../components/Icone/Icone';
import MenuAcoes from '../../components/MenuAcoes/MenuAcoes';
import Modal from '../../components/Modal/Modal';
import FormAtendente from './FormAtendente';
import './Atendentes.css';

/**
 * Tela Gestão de Atendentes (RF02) — Configurações > Atendentes. Só Admin.
 * - Adicionar: dados + senha inicial; nasce com primeiro acesso pendente (RN05).
 * - Editar: dados cadastrais.
 * - "Remover" do RF02 = Desativar (único verbo do contrato:
 *   POST /atendentes/:id/desativar). O histórico de conversas é preservado.
 */
export default function Atendentes() {
  const [atendentes, setAtendentes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aviso, setAviso] = useState('');

  // null = fechado; { atendente: null } = cadastro; { atendente } = edição
  const [formulario, setFormulario] = useState(null);
  const [desativando, setDesativando] = useState(null); // atendente a confirmar
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    let ativo = true;
    atendenteService.listar().then((resposta) => {
      if (!ativo) return;
      setAtendentes(resposta.data);
      setCarregando(false);
    });
    return () => {
      ativo = false;
    };
  }, []);

  /** Substitui (ou acrescenta) um atendente na lista local. */
  function aplicar(atualizado) {
    setAtendentes((lista) =>
      lista.some((a) => a.id === atualizado.id)
        ? lista.map((a) => (a.id === atualizado.id ? atualizado : a))
        : [...lista, atualizado]
    );
  }

  async function salvar(dados) {
    const editando = formulario.atendente;
    const resposta = editando
      ? await atendenteService.atualizar(editando.id, dados)
      : await atendenteService.criar(dados);
    aplicar(resposta.data);
    setFormulario(null);
    setAviso(editando ? 'Alterações salvas.' : `${resposta.data.nome} foi adicionado(a).`);
  }

  async function confirmarDesativacao() {
    setConfirmando(true);
    try {
      const resposta = await atendenteService.desativar(desativando.id);
      aplicar(resposta.data);
      setAviso(`${resposta.data.nome} foi desativado(a) e não consegue mais entrar.`);
      setDesativando(null);
    } catch (e) {
      setAviso(e.message || 'Não foi possível desativar.');
    } finally {
      setConfirmando(false);
    }
  }

  function acoesDe(atendente) {
    const itens = [
      { label: 'Editar', icone: 'editar', onClick: () => setFormulario({ atendente }) },
    ];
    if (atendente.ativo) {
      itens.push({
        label: 'Desativar',
        icone: 'bloquear',
        perigo: true,
        onClick: () => setDesativando(atendente),
      });
    } else {
      // [PENDENTE] O contrato só prevê desativar — reativação não definida.
      itens.push({
        label: 'Reativar (pendente)',
        icone: 'atualizar',
        disabled: true,
        title: '[PENDENTE] O contrato de API não prevê reativação',
        onClick: () => {},
      });
    }
    return itens;
  }

  return (
    <Layout>
      <CabecalhoPagina
        secao="Configurações"
        titulo="Atendentes"
        subtitulo="Quem tem acesso ao painel do seu negócio"
        acoes={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setFormulario({ atendente: null })}
          >
            <Icone nome="mais" size={16} />
            Adicionar atendente
          </button>
        }
      />

      <div className="atendentes-corpo">
        {aviso && (
          <p className="atendentes-aviso" role="status">
            {aviso}
          </p>
        )}

        {carregando ? (
          <p className="atendentes-vazio">Carregando atendentes…</p>
        ) : atendentes.length === 0 ? (
          <p className="atendentes-vazio">Nenhum atendente cadastrado ainda.</p>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">E-mail</th>
                <th scope="col">Status</th>
                <th scope="col">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {atendentes.map((atendente) => (
                <tr key={atendente.id} className={atendente.ativo ? '' : 'inativo'}>
                  <td className="tabela-nome">
                    {atendente.nome}
                    <span className="tabela-email-mobile">{atendente.email}</span>
                  </td>
                  <td className="tabela-email">{atendente.email}</td>
                  <td>
                    <span className="tabela-status">
                      <Badge tone={atendente.ativo ? 'success' : 'neutral'} pilula ponto>
                        {atendente.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                      {atendente.ativo && atendente.primeiroAcessoPendente && (
                        <Badge tone="warning">1º acesso pendente</Badge>
                      )}
                    </span>
                  </td>
                  <td className="tabela-acoes">
                    <MenuAcoes rotulo={`Ações de ${atendente.nome}`} itens={acoesDe(atendente)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {formulario && (
        <FormAtendente
          atendente={formulario.atendente}
          onSalvar={salvar}
          onFechar={() => setFormulario(null)}
        />
      )}

      {desativando && (
        <Modal
          titulo="Desativar atendente"
          onFechar={() => setDesativando(null)}
          bloqueado={confirmando}
        >
          <p className="modal-texto">
            <strong>{desativando.nome}</strong> perde o acesso ao painel imediatamente. O
            histórico das conversas que atendeu continua salvo.
          </p>
          <div className="modal-acoes">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setDesativando(null)}
              disabled={confirmando}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-perigo"
              onClick={confirmarDesativacao}
              disabled={confirmando}
            >
              {confirmando ? 'Desativando…' : 'Desativar'}
            </button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
