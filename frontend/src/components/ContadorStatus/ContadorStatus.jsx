import './ContadorStatus.css';

/**
 * Card de contagem no topo da tela de Atendimentos ("3 Precisam de ação").
 * @param {{
 *   valor: number,
 *   rotulo: string,
 *   tone: 'danger'|'info'|'warning'|'neutral',
 *   destaque?: boolean,  // fundo/borda tintados — usado em "Precisam de ação"
 * }} props
 */
export default function ContadorStatus({ valor, rotulo, tone, destaque = false }) {
  return (
    <div className={`contador contador-${tone}${destaque ? ' contador-destaque' : ''}`}>
      <span className="contador-valor">{valor}</span>
      <span className="contador-rotulo">{rotulo}</span>
    </div>
  );
}
