import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

/**
 * Rota protegida: exige usuário autenticado e, opcionalmente, um perfil.
 * Sem sessão, redireciona para /login.
 */
export default function RotaProtegida({ perfil, children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Carregando…</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (perfil && usuario.perfil !== perfil) {
    // Perfil sem acesso a esta tela: volta para a tela comum a todos.
    return <Navigate to="/atendimentos" replace />;
  }

  return children;
}
