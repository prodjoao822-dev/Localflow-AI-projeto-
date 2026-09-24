import { useState } from 'react';
import Modal from '../../components/Modal/Modal';
import TagPendencia from '../../components/TagPendencia/TagPendencia';

/**
 * Formulário de cadastro/edição de atendente (RF02), dentro de um Modal.
 * - Cadastro: nome, e-mail, telefone (opcional) e senha inicial (RN05).
 * - Edição: só dados cadastrais — senha não se edita aqui.
 *
 * @param {{
 *   atendente: object | null,           // null = cadastro
 *   onSalvar: (dados) => Promise<void>, // lança Error com mensagem legível
 *   onFechar: () => void,
 * }} props
 */
export default function FormAtendente({ atendente, onSalvar, onFechar }) {
  const editando = Boolean(atendente);
  const [dados, setDados] = useState({
    nome: atendente?.nome ?? '',
    email: atendente?.email ?? '',
    telefone: atendente?.telefone ?? '',
    senhaInicial: '',
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const campo = (nome) => ({
    value: dados[nome],
    onChange: (e) => setDados({ ...dados, [nome]: e.target.value }),
  });

  async function salvar(evento) {
    evento.preventDefault();
    setSalvando(true);
    setErro('');
    try {
      await onSalvar(dados);
    } catch (e) {
      setErro(e.message || 'Não foi possível salvar.');
      setSalvando(false);
    }
  }

  return (
    <Modal
      titulo={editando ? 'Editar atendente' : 'Adicionar atendente'}
      onFechar={onFechar}
      bloqueado={salvando}
    >
      <form className="modal-form" onSubmit={salvar} noValidate>
        <label className="campo">
          <span className="campo-rotulo">Nome</span>
          <input className="input" placeholder="Nome completo" {...campo('nome')} required />
        </label>

        <label className="campo">
          <span className="campo-rotulo">E-mail</span>
          <input
            type="email"
            className="input"
            placeholder="nome@empresa.com"
            autoComplete="off"
            {...campo('email')}
            required
          />
        </label>

        <label className="campo">
          <span className="campo-rotulo">
            Telefone <span className="form-opcional">(opcional)</span>
          </span>
          <input className="input" placeholder="(11) 90000-0000" {...campo('telefone')} />
        </label>

        {!editando && (
          <label className="campo">
            <span className="campo-rotulo">Senha inicial</span>
            <input
              type="password"
              className="input"
              autoComplete="new-password"
              {...campo('senhaInicial')}
              required
            />
            <span className="form-ajuda">
              Repasse a senha ao atendente. Ele será obrigado a trocá-la no primeiro acesso.
            </span>
            <span className="form-pendencia">
              <TagPendencia descricao="Nenhuma regra de tamanho/complexidade de senha foi decidida">
                Política de senha pendente
              </TagPendencia>
            </span>
          </label>
        )}

        {erro && (
          <p className="modal-erro" role="alert">
            {erro}
          </p>
        )}

        <div className="modal-acoes">
          <button type="button" className="btn btn-secondary" onClick={onFechar} disabled={salvando}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Adicionar atendente'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
