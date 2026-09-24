import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Icone from '../Icone/Icone';
import Avatar from '../Avatar/Avatar';
import Logo from '../Logo/Logo';
import './Layout.css';

/**
 * Menu do MVP. Itens fora do MVP (Dashboard, Clientes, Produtos, Orçamentos,
 * Operação, Integrações) ficam FORA de propósito — decisão de escopo, não
 * esquecimento. `perfis` limita quem vê o item (RN05).
 */
const MENU = [
  { to: '/atendimentos', label: 'Atendimentos', icone: 'conversas', perfis: ['admin', 'atendente'] },
  { to: '/configuracoes/atendentes', label: 'Configurações', icone: 'engrenagem', perfis: ['admin'] },
];

/**
 * Esqueleto das telas internas: menu lateral + área de conteúdo.
 * O menu e o usuário vêm do contexto de autenticação — as telas só passam
 * o conteúdo (children).
 */
export default function Layout({ children }) {
  const { usuario, sair } = useAuth();
  const itens = MENU.filter((item) => item.perfis.includes(usuario?.perfil));

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-marca">
          <Logo />
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          {itens.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' ativo' : ''}`}
              title={item.label}
            >
              <Icone nome={item.icone} size={18} />
              <span className="sidebar-nav-rotulo">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-usuario">
          <Avatar nome={usuario?.nome} size={36} />
          <div className="sidebar-usuario-texto">
            <strong>{usuario?.nome}</strong>
            <span>{usuario?.email}</span>
          </div>
          <button className="sidebar-sair" title="Sair" aria-label="Sair" onClick={sair}>
            <Icone nome="sair" size={18} />
          </button>
        </div>
      </aside>

      <main className="conteudo">{children}</main>
    </div>
  );
}
