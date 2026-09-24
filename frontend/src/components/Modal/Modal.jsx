import { useEffect, useRef } from 'react';
import Icone from '../Icone/Icone';
import './Modal.css';

/**
 * Janela sobreposta (formulários e confirmações).
 * - Esc ou clique no fundo fecham (a menos que `bloqueado`, ex.: salvando).
 * - O foco vai para dentro do modal ao abrir e volta ao elemento anterior
 *   ao fechar — importante para quem navega por teclado.
 *
 * @param {{ titulo: string, onFechar: () => void, bloqueado?: boolean, children }} props
 */
export default function Modal({ titulo, onFechar, bloqueado = false, children }) {
  const caixaRef = useRef(null);

  useEffect(() => {
    const anterior = document.activeElement;
    // Prefere o primeiro campo do formulário; sem campos, o primeiro botão.
    const caixa = caixaRef.current;
    const alvo = caixa?.querySelector('input, select, textarea') ?? caixa?.querySelector('button');
    alvo?.focus();
    return () => anterior?.focus?.();
  }, []);

  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === 'Escape' && !bloqueado) onFechar();
    }
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [onFechar, bloqueado]);

  return (
    <div
      className="modal-fundo"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !bloqueado) onFechar();
      }}
    >
      <div
        ref={caixaRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
      >
        <header className="modal-cabecalho">
          <h2 id="modal-titulo" className="modal-titulo">
            {titulo}
          </h2>
          <button
            type="button"
            className="btn btn-ghost btn-sm modal-fechar"
            onClick={onFechar}
            disabled={bloqueado}
            aria-label="Fechar"
          >
            <Icone nome="fechar" size={16} />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
