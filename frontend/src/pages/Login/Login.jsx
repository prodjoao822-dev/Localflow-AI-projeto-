import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Icone from '../../components/Icone/Icone';
import './Login.css';

/**
 * Tela 1 — Login (RF03).
 * Administrador e Atendente usam o mesmo formulário; o destino após o login
 * depende do perfil (admin -> /admin, atendente -> /painel).
 *
 * NOTA: no MVP a autenticação é simulada (sem backend). As credenciais reais
 * virão do módulo IAM (JWT) — ver "Usuários de demonstração" no rodapé.
 */
export default function Login() {
  const { usuario, entrar } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) {
    return <Navigate to={usuario.perfil === 'admin' ? '/admin' : '/painel'} replace />;
  }

  async function aoSubmeter(evento) {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      const autenticado = await entrar(email, senha);
      navigate(autenticado.perfil === 'admin' ? '/admin' : '/painel', { replace: true });
    } catch (e) {
      setErro(e.message || 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  }

  /** Acesso rápido de demonstração (usuários fictícios do mock). */
  async function entrarComo(emailDemo, senhaDemo) {
    setErro('');
    setEnviando(true);
    try {
      const autenticado = await entrar(emailDemo, senhaDemo);
      navigate(autenticado.perfil === 'admin' ? '/admin' : '/painel', { replace: true });
    } catch (e) {
      setErro(e.message || 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login">
      <div className="login-marca">
        <span className="login-marca-quadro">LF</span>
        <span className="login-marca-nome">LocalFlow AI</span>
      </div>

      <form className="login-card" onSubmit={aoSubmeter}>
        <h1 className="login-titulo">Entrar</h1>
        <p className="login-subtitulo">
          Acesso ao painel de atendimento da{' '}
          <strong>Casa da Soleira</strong>.
        </p>

        <label className="login-campo">
          <span>E-mail</span>
          <input
            type="email"
            className="input"
            placeholder="voce@casadasoleira.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="login-campo">
          <span>Senha</span>
          <input
            type="password"
            className="input"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {erro && <div className="login-erro">{erro}</div>}

        <button type="submit" className="btn btn-primary login-enviar" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <div className="login-demo">
        <p className="login-demo-titulo">
          <Icone nome="bot" size={15} />
          Protótipo — usuários de demonstração
        </p>
        <div className="login-demo-botoes">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={enviando}
            onClick={() => entrarComo('joao@casadasoleira.com', '123456')}
          >
            Entrar como Atendente
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={enviando}
            onClick={() => entrarComo('admin@casadasoleira.com', 'admin123')}
          >
            Entrar como Administrador
          </button>
        </div>
      </div>

      <span className="pendencia-tag login-pendencia" title="RNF01 — autenticação segura fica para a etapa de IAM + JWT no backend.">
        <span className="pendencia-dot" />
        Autenticação simulada nesta etapa — RNF01 (segurança real fica no backend)
      </span>
    </div>
  );
}
