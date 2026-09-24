import { TagIA } from '../Badge/Badge';
import { formatarMomento } from '../../utils/formatadores';
import './BolhaMensagem.css';

/**
 * Uma mensagem da thread (RF17). A origem define lado e cor (RN07: mensagens
 * da IA e do Atendente precisam ser distinguíveis):
 * - cliente   → esquerda, cinza
 * - ia        → direita, violeta tracejado + tag "✦ IA"
 * - atendente → direita, azul + nome de quem enviou   [ASSUMIDO: sem PNG]
 *
 * @param {{ mensagem: { origem, autor, texto, createdAt } }} props
 */
export default function BolhaMensagem({ mensagem }) {
  const { origem, autor, texto, createdAt } = mensagem;

  return (
    <div className={`bolha-linha bolha-${origem}`}>
      {origem === 'ia' && <TagIA />}
      {origem === 'atendente' && autor && <span className="bolha-autor">{autor.nome}</span>}
      <div className="bolha">
        <p>{texto}</p>
      </div>
      <time className="bolha-hora" dateTime={createdAt}>
        {formatarMomento(createdAt)}
      </time>
    </div>
  );
}
