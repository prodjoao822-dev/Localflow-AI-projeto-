import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

/**
 * Rota protegida: exige usuário autenticado e, opcionalmente, um perfil.
 * Sem sessão, redireciona para /login.
 */
export default function RotaProtegida({ perfil, children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <div style={{ padding: 40, color: 'var(--text-secondary)' }}>Carregando…</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (perfil && usuario.perfil !== perfil) {
    // Perfil correto para cada painel: admin -> /admin, atendente -> /painel
    return <Navigate to={usuario.perfil === 'admin' ? '/admin' : '/painel'} replace />;
  }

  return children;
}
