import Icone from '../Icone/Icone';
import './Logo.css';

/**
 * Marca "LocalFlow AI" (ícone + nome, com "AI" em verde).
 * @param {{ vertical?: boolean }} props vertical = ícone acima do nome (login)
 */
export default function Logo({ vertical = false }) {
  return (
    <span className={`lf-logo${vertical ? ' lf-logo-vertical' : ''}`}>
      <span className="lf-logo-icone">
        <Icone nome="marca" size={vertical ? 44 : 26} />
      </span>
      <span className="lf-logo-nome">
        LocalFlow <span className="lf-logo-ai">AI</span>
      </span>
    </span>
  );
}
