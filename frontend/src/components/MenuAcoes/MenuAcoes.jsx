import { useEffect, useRef, useState } from 'react';
import Icone from '../Icone/Icone';
import './MenuAcoes.css';

/**
 * Menu "⋯" com ações de um item de lista.
 * Fecha ao clicar fora ou com Esc.
 *
 * @param {{
 *   rotulo: string,  // nome acessível, ex.: "Ações de Ana"
 *   itens: Array<{ label, icone?, onClick, perigo?, disabled?, title? }>,
 * }} props
 */
export default function MenuAcoes({ rotulo, itens }) {
  const [aberto, setAberto] = useState(false);
  const raizRef = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    function aoClicarFora(e) {
      if (!raizRef.current?.contains(e.target)) setAberto(false);
    }
    function aoTeclar(e) {
      if (e.key === 'Escape') setAberto(false);
    }
    document.addEventListener('mousedown', aoClicarFora);
    document.addEventListener('keydown', aoTeclar);
    return () => {
      document.removeEventListener('mousedown', aoClicarFora);
      document.removeEventListener('keydown', aoTeclar);
    };
  }, [aberto]);

  return (
    <div className="menu-acoes" ref={raizRef}>
      <button
        type="button"
        className="btn btn-ghost btn-sm menu-acoes-gatilho"
        aria-label={rotulo}
        aria-haspopup="menu"
        aria-expanded={aberto}
        onClick={() => setAberto((v) => !v)}
      >
        <Icone nome="pontos" size={18} />
      </button>

      {aberto && (
        <ul className="menu-acoes-lista" role="menu">
          {itens.map((item) => (
            <li key={item.label} role="none">
              <button
                type="button"
                role="menuitem"
                className={`menu-acoes-item${item.perigo ? ' perigo' : ''}`}
                disabled={item.disabled}
                title={item.title}
                onClick={() => {
                  setAberto(false);
                  item.onClick();
                }}
              >
                {item.icone && <Icone nome={item.icone} size={16} />}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
