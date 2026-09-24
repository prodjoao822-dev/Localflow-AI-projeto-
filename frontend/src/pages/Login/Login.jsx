import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Logo from '../../components/Logo/Logo';
import TagPendencia from '../../components/TagPendencia/TagPendencia';
import './Login.css';

const DESTINO_APOS_LOGIN = '/atendimentos';

/**
 * Tela de Login (RF03). Administrador e Atendente usam o mesmo formulário.
 * Não existe cadastro público: quem cria Atendentes é o Administrador (RN05).
 *
 * Autenticação ainda simulada (authService). RNF01 — segurança real (hash +
 * JWT) chega com o módulo IAM no backend, sem mudar esta tela.
 */
export default function Login() {
  const { usuario, entrar } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to={DESTINO_APOS_LOGIN} replace />;

  async function autenticar(emailInformado, senhaInformada) {
    setErro('');
    setEnviando(true);
    try {
      await entrar(emailInformado, senhaInformada);
      navigate(DESTINO_APOS_LOGIN, { replace: true });
    } catch (e) {
      setErro(e.message || 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  }

  function aoSubmeter(evento) {
    evento.preventDefault();
    autenticar(email, senha);
  }

  return (
    <div className="login">
      <div className="login-cabecalho">
        <Logo vertical />
        <p className="login-subtitulo">Entre com sua conta para continuar</p>
      </div>

      <form className="login-card" onSubmit={aoSubmeter} noValidate>
        <label className="campo">
          <span className="campo-rotulo">E-mail</span>
          <input
            type="email"
            className="input"
            placeholder="voce@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <div className="campo">
          <div className="login-senha-topo">
            <label htmlFor="login-senha" className="campo-rotulo">Senha</label>
            {/* [PENDENTE] Redefinição de senha não decidida (lacunas-e-decisoes 1.4) */}
            <button
              type="button"
              className="btn-link"
              disabled
              title="[PENDENTE] Fluxo de redefinição de senha ainda não definido"
            >
              Esqueci minha senha
            </button>
          </div>
          <input
            id="login-senha"
            type="password"
            className="input"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {erro && (
          <p className="login-erro" role="alert">
            {erro}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary login-enviar"
          disabled={enviando || !email.trim() || !senha}
        >
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <p className="login-rodape">O cadastro de atendentes é feito pelo administrador da conta.</p>

      {/* Atalhos só em desenvolvimento (não fazem parte da tela validada) */}
      {import.meta.env.DEV && (
        <div className="login-demo">
          <TagPendencia descricao="RNF01 — hash de senha + JWT chegam com o módulo IAM">
            Protótipo — autenticação simulada
          </TagPendencia>
          <div className="login-demo-botoes">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={enviando}
              onClick={() => autenticar('joao@casadasoleira.com', '123456')}
            >
              Entrar como Atendente
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={enviando}
              onClick={() => autenticar('admin@casadasoleira.com', 'admin123')}
            >
              Entrar como Administrador
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
