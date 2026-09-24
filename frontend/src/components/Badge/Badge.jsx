import Icone from '../Icone/Icone';
import './Badge.css';

/**
 * Rótulo curto com tom semântico (estado, resultado, IA, status de usuário).
 *
 * @param {{
 *   children: React.ReactNode,
 *   tone?: 'neutral'|'info'|'warning'|'danger'|'success'|'ia',
 *   pilula?: boolean,   // raio total — usado em status de usuário (Ativo/Inativo)
 *   ponto?: boolean,    // bolinha antes do texto
 * }} props
 */
export default function Badge({ children, tone = 'neutral', pilula = false, ponto = false }) {
  if (!children) return null;
  const classes = ['lf-badge', `lf-badge-${tone}`, pilula && 'lf-badge-pilula']
    .filter(Boolean)
    .join(' ');
  return (
    <span className={classes}>
      {ponto && <span className="lf-badge-ponto" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** Tag "✦ IA" — marca o que foi feito pela IA (RN02: distinguível do humano). */
export function TagIA() {
  return (
    <span className="lf-badge lf-badge-ia" title="Gerado pela IA">
      <Icone nome="brilho" size={11} />
      IA
    </span>
  );
}
