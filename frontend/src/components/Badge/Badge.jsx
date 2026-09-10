import './Badge.css';

/**
 * Rótulo de estado com tom visual. O tom é um mapa neutro de tokens de cor
 * (a hierarquia principal continua sendo tipografia).
 * @param {{ children, tone?: 'neutral'|'accent'|'success'|'warning'|'danger'|'ia' }} props
 */
export default function Badge({ children, tone = 'neutral' }) {
  if (!children) return null;
  return <span className={`lf-badge lf-badge-${tone}`}>{children}</span>;
}
