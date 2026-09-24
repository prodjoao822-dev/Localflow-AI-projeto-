import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import RotaProtegida from './components/RotaProtegida/RotaProtegida';
import Login from './pages/Login/Login';
import Atendimentos from './pages/Atendimentos/Atendimentos';
import Atendentes from './pages/Atendentes/Atendentes';

/**
 * Protótipo navegável — LocalFlow AI (MVP).
 * - /login         → Login (RF03)
 * - /atendimentos  → fila + conversa + contexto em 3 colunas. Admin e Atendente
 *                    (RN05: o Administrador também pode operar Conversas)
 * - /configuracoes/atendentes → Gestão de Atendentes (RF02, só Admin)
 */

/** Raiz: manda para o login ou para os atendimentos. */
function Inicio() {
  const { usuario, carregando } = useAuth();
  if (carregando) return null;
  return <Navigate to={usuario ? '/atendimentos' : '/login'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/atendimentos"
            element={
              <RotaProtegida>
                <Atendimentos />
              </RotaProtegida>
            }
          />
          <Route
            path="/configuracoes/atendentes"
            element={
              <RotaProtegida perfil="admin">
                <Atendentes />
              </RotaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
