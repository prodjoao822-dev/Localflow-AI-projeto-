import { rotuloPrioridade } from '../../utils/formatadores';
import './IndicadorPrioridade.css';

/**
 * Bolinha colorida da prioridade da IA (RF06): alta | media | baixa.
 * A cor vem do token --prioridade-{valor}; o texto fica acessível por
 * leitor de tela e no tooltip (a cor sozinha não pode ser a única pista).
 * @param {{ prioridade: 'alta'|'media'|'baixa'|null, comTexto?: boolean }} props
 */
export default function IndicadorPrioridade({ prioridade, comTexto = false }) {
  const label = `Prioridade ${rotuloPrioridade(prioridade).toLowerCase()}`;
  return (
    <span className={`lf-prioridade lf-prioridade-${prioridade ?? 'nenhuma'}`} title={label}>
      <span className="lf-prioridade-ponto" aria-hidden="true" />
      {comTexto ? rotuloPrioridade(prioridade) : <span className="sr-only">{label}</span>}
    </span>
  );
}
