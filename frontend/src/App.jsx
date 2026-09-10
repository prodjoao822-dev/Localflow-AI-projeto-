import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import RotaProtegida from './components/RotaProtegida/RotaProtegida';
import Login from './pages/Login/Login';
import PainelAtendente from './pages/PainelAtendente/PainelAtendente';
import Conversa from './pages/Conversa/Conversa';
import PainelAdmin from './pages/PainelAdmin/PainelAdmin';

/**
 * Protótipo navegável — LocalFlow AI (MVP).
 * 4 telas: Login, Painel do Atendente, Conversa individual, Painel do
 * Administrador. Rotas protegidas por autenticação simulada (mock).
 */

/** Raiz: redireciona conforme a sessão. */
function Inicio() {
  const { usuario, carregando } = useAuth();
  if (carregando) return <div style={{ padding: 40, color: 'var(--text-secondary)' }}>Carregando…</div>;
  if (!usuario) return <Navigate to="/login" replace />;
  return <Navigate to={usuario.perfil === 'admin' ? '/admin' : '/painel'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />

          {/* Painel do Atendente + Conversa individual */}
          <Route
            path="/painel"
            element={
              <RotaProtegida perfil="atendente">
                <PainelAtendente />
              </RotaProtegida>
            }
          />
          <Route
            path="/painel/conversa/:id"
            element={
              <RotaProtegida perfil="atendente">
                <Conversa />
              </RotaProtegida>
            }
          />

          {/* Painel do Administrador */}
          <Route
            path="/admin"
            element={
              <RotaProtegida perfil="admin">
                <PainelAdmin />
              </RotaProtegida>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
