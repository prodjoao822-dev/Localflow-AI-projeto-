import './Layout.css';
import Icone from '../Icone/Icone';
import Avatar from '../Avatar/Avatar';

/**
 * Esqueleto das telas internas (painéis).
 * - Sidebar responsiva (empresa no topo, navegação, usuário no rodapé).
 * - Área de conteúdo centralizada, largura máxima, foco em tipografia.
 *
 * Props:
 * - empresa: { nome }
 * - usuario: { nome, perfil }
 * - navItens: [{ to, label, icone, ativo }]
 * - onLogout
 * - children: conteúdo da página
 */
export default function Layout({
  empresa,
  usuario,
  navItens = [],
  onLogout,
  children,
}) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-empresa">
            <span className="sidebar-empresa-marca">LF</span>
            <div className="sidebar-empresa-texto">
              <strong>{empresa?.nome || 'LocalFlow AI'}</strong>
              <span>Administração de atendimento</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          {navItens.map((item) => (
            <a
              key={item.to}
              href={item.to}
              className={`sidebar-nav-item${item.ativo ? ' ativo' : ''}`}
            >
              <Icone nome={item.icone} size={17} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-usuario">
            <Avatar nome={usuario?.nome} size={32} />
            <div className="sidebar-usuario-texto">
              <strong>{usuario?.nome}</strong>
              <span>{usuario?.perfil === 'admin' ? 'Administrador' : 'Atendente'}</span>
            </div>
            <button className="sidebar-logout" title="Sair" onClick={onLogout}>
              <Icone nome="sair" size={17} />
            </button>
          </div>
        </div>
      </aside>

      <main className="conteudo">{children}</main>
    </div>
  );
}
